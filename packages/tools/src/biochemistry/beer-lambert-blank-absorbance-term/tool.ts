import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleAbsorbance: number;
  readonly blankAbsorbance: number;
  readonly extinction: number;
  readonly pathLength: number;
  readonly dilution: number;
};
export type Output = {
  readonly netAbsorbance: number;
  readonly originalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleAbsorbance: { type: "number" },
    blankAbsorbance: { type: "number" },
    extinction: { type: "number", exclusiveMinimum: 0 },
    pathLength: { type: "number", exclusiveMinimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleAbsorbance",
    "blankAbsorbance",
    "extinction",
    "pathLength",
    "dilution",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netAbsorbance: { type: "number" },
    originalConcentration: { type: "number" },
  },
  required: ["netAbsorbance", "originalConcentration"],
} as const;
/** Signed blank-corrected ideal Beer-Lambert concentration with explicit extinction units and dilution factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleAbsorbance,
    blankAbsorbance,
    extinction,
    pathLength,
    dilution,
  } = request;
  const compute = (): Output => {
    H.positive(extinction);
    H.positive(pathLength);
    H.positive(dilution);
    return {
      netAbsorbance: sampleAbsorbance - blankAbsorbance,
      originalConcentration:
        ((sampleAbsorbance - blankAbsorbance) * dilution) /
        (extinction * pathLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleAbsorbance: 0.8,
    blankAbsorbance: 0.2,
    extinction: 2,
    pathLength: 1,
    dilution: 5,
  },
  output: {
    netAbsorbance: 0.6000000000000001,
    originalConcentration: 1.5000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const beerLambertBlankAbsorbanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/beer-lambert-blank-absorbance-term",
    title: "Beer Lambert Blank Absorbance Term Tool",
    description:
      "Signed blank-corrected ideal Beer-Lambert concentration with explicit extinction units and dilution factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleAbsorbance: { type: "number" },
        blankAbsorbance: { type: "number" },
        extinction: { type: "number", exclusiveMinimum: 0 },
        pathLength: { type: "number", exclusiveMinimum: 0 },
        dilution: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sampleAbsorbance",
        "blankAbsorbance",
        "extinction",
        "pathLength",
        "dilution",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netAbsorbance: { type: "number" },
        originalConcentration: { type: "number" },
      },
      required: ["netAbsorbance", "originalConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "sampleAbsorbance",
          label: "Sample Absorbance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankAbsorbance",
          label: "Blank Absorbance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extinction",
          label: "Extinction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathLength",
          label: "Path Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netAbsorbance",
          label: "Net Absorbance",
          valueType: { type: "number" },
        },
        {
          id: "originalConcentration",
          label: "Original Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beerLambertBlankAbsorbanceTermTool.execute;
export default beerLambertBlankAbsorbanceTermTool;
