import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly suppliedReferenceVolume: number;
  readonly sourceBasisFactor: number;
  readonly referenceBasisFactor: number;
};
export type Output = {
  readonly normalizedVolume: number;
  readonly normalizedReference: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    suppliedReferenceVolume: { type: "number", exclusiveMinimum: 0 },
    sourceBasisFactor: { type: "number", exclusiveMinimum: 0 },
    referenceBasisFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "volume",
    "suppliedReferenceVolume",
    "sourceBasisFactor",
    "referenceBasisFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedVolume: { type: "number" },
    normalizedReference: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["normalizedVolume", "normalizedReference", "ratio"],
} as const;
/** Compare supplied gas-volume basis factors without inferring standard-state or clinical correction constants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    volume,
    suppliedReferenceVolume,
    sourceBasisFactor,
    referenceBasisFactor,
  } = request;
  const compute = (): Output => {
    H.domain(volume >= 0);
    H.positive(suppliedReferenceVolume);
    H.positive(sourceBasisFactor);
    H.positive(referenceBasisFactor);
    return {
      normalizedVolume: volume * sourceBasisFactor,
      normalizedReference: suppliedReferenceVolume * referenceBasisFactor,
      ratio:
        (volume * sourceBasisFactor) /
        (suppliedReferenceVolume * referenceBasisFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volume: 2,
    suppliedReferenceVolume: 4,
    sourceBasisFactor: 2,
    referenceBasisFactor: 1,
  },
  output: { normalizedVolume: 4, normalizedReference: 4, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const gasVolumeReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/gas-volume-reference-ratio",
    title: "Gas Volume Reference Ratio Tool",
    description:
      "Compare supplied gas-volume basis factors without inferring standard-state or clinical correction constants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        suppliedReferenceVolume: { type: "number", exclusiveMinimum: 0 },
        sourceBasisFactor: { type: "number", exclusiveMinimum: 0 },
        referenceBasisFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "volume",
        "suppliedReferenceVolume",
        "sourceBasisFactor",
        "referenceBasisFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedVolume: { type: "number" },
        normalizedReference: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["normalizedVolume", "normalizedReference", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceVolume",
          label: "Supplied Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceBasisFactor",
          label: "Source Basis Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceBasisFactor",
          label: "Reference Basis Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedVolume",
          label: "Normalized Volume",
          valueType: { type: "number" },
        },
        {
          id: "normalizedReference",
          label: "Normalized Reference",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gasVolumeReferenceRatioTool.execute;
export default gasVolumeReferenceRatioTool;
