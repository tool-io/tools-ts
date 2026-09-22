import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedRate: number;
  readonly dilutionFactor: number;
  readonly sampleVolume: number;
  readonly referenceVolume: number;
};
export type Output = {
  readonly undilutedRate: number;
  readonly referenceRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedRate: { type: "number" },
    dilutionFactor: { type: "number", exclusiveMinimum: 0 },
    sampleVolume: { type: "number", exclusiveMinimum: 0 },
    referenceVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "observedRate",
    "dilutionFactor",
    "sampleVolume",
    "referenceVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undilutedRate: { type: "number" },
    referenceRate: { type: "number" },
  },
  required: ["undilutedRate", "referenceRate"],
} as const;
/** Supplied analytical-rate normalization, without enzyme activity classification or assay conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedRate, dilutionFactor, sampleVolume, referenceVolume } =
    request;
  const compute = (): Output => {
    H.positive(dilutionFactor);
    H.positive(sampleVolume);
    H.positive(referenceVolume);
    return {
      undilutedRate: observedRate * dilutionFactor,
      referenceRate:
        (observedRate * dilutionFactor * referenceVolume) / sampleVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedRate: 2,
    dilutionFactor: 5,
    sampleVolume: 1,
    referenceVolume: 2,
  },
  output: { undilutedRate: 10, referenceRate: 20 },
} satisfies ToolExample<Input, Output>;
export const enzymeDilutionRateBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/enzyme-dilution-rate-basis-factor",
    title: "Enzyme Dilution Rate Basis Factor Tool",
    description:
      "Supplied analytical-rate normalization, without enzyme activity classification or assay conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedRate: { type: "number" },
        dilutionFactor: { type: "number", exclusiveMinimum: 0 },
        sampleVolume: { type: "number", exclusiveMinimum: 0 },
        referenceVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "observedRate",
        "dilutionFactor",
        "sampleVolume",
        "referenceVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        undilutedRate: { type: "number" },
        referenceRate: { type: "number" },
      },
      required: ["undilutedRate", "referenceRate"],
    },
    ports: {
      inputs: [
        {
          id: "observedRate",
          label: "Observed Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleVolume",
          label: "Sample Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceVolume",
          label: "Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "undilutedRate",
          label: "Undiluted Rate",
          valueType: { type: "number" },
        },
        {
          id: "referenceRate",
          label: "Reference Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enzymeDilutionRateBasisFactorTool.execute;
export default enzymeDilutionRateBasisFactorTool;
