import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceAmount: number;
  readonly verifiedConversionFactor: number;
  readonly blendTotal: number;
  readonly sourceBasis: string;
  readonly targetBasis: string;
  readonly verifiedSource: string;
};
export type Output = {
  readonly convertedAmount: number;
  readonly share: number;
  readonly source: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAmount: { type: "number", minimum: 0 },
    verifiedConversionFactor: { type: "number", exclusiveMinimum: 0 },
    blendTotal: { type: "number", exclusiveMinimum: 0 },
    sourceBasis: { type: "string", maxLength: 8192 },
    targetBasis: { type: "string", maxLength: 8192 },
    verifiedSource: { type: "string", maxLength: 8192 },
  },
  required: [
    "sourceAmount",
    "verifiedConversionFactor",
    "blendTotal",
    "sourceBasis",
    "targetBasis",
    "verifiedSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedAmount: { type: "number" },
    share: { type: "number" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["convertedAmount", "share", "source"],
} as const;
/** Compute one declared blend nutrient share after a source-verified elemental/oxide conversion; no application-rate advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceAmount,
    verifiedConversionFactor,
    blendTotal,
    sourceBasis,
    targetBasis,
    verifiedSource,
  } = request;
  const compute = (): Output => {
    H.domain(
      sourceAmount >= 0 &&
        sourceBasis.length > 0 &&
        targetBasis.length > 0 &&
        verifiedSource.length > 0,
    );
    H.positive(verifiedConversionFactor);
    H.positive(blendTotal);
    H.domain(sourceAmount * verifiedConversionFactor <= blendTotal);
    return {
      convertedAmount: sourceAmount * verifiedConversionFactor,
      share: (sourceAmount * verifiedConversionFactor) / blendTotal,
      source: verifiedSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceAmount: 10,
    verifiedConversionFactor: 0.7,
    blendTotal: 100,
    sourceBasis: "oxide",
    targetBasis: "element",
    verifiedSource: "verified-A",
  },
  output: { convertedAmount: 7, share: 0.07, source: "verified-A" },
} satisfies ToolExample<Input, Output>;
export const fertilizerElementalOxideShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/fertilizer-elemental-oxide-share",
    title: "Fertilizer Elemental Oxide Share Tool",
    description:
      "Compute one declared blend nutrient share after a source-verified elemental/oxide conversion; no application-rate advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceAmount: { type: "number", minimum: 0 },
        verifiedConversionFactor: { type: "number", exclusiveMinimum: 0 },
        blendTotal: { type: "number", exclusiveMinimum: 0 },
        sourceBasis: { type: "string", maxLength: 8192 },
        targetBasis: { type: "string", maxLength: 8192 },
        verifiedSource: { type: "string", maxLength: 8192 },
      },
      required: [
        "sourceAmount",
        "verifiedConversionFactor",
        "blendTotal",
        "sourceBasis",
        "targetBasis",
        "verifiedSource",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedAmount: { type: "number" },
        share: { type: "number" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["convertedAmount", "share", "source"],
    },
    ports: {
      inputs: [
        {
          id: "sourceAmount",
          label: "Source Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verifiedConversionFactor",
          label: "Verified Conversion Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blendTotal",
          label: "Blend Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceBasis",
          label: "Source Basis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetBasis",
          label: "Target Basis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "verifiedSource",
          label: "Verified Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "convertedAmount",
          label: "Converted Amount",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fertilizerElementalOxideShareTool.execute;
export default fertilizerElementalOxideShareTool;
