import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly batchReference: number;
  readonly targetReference: number;
};
export type Output = {
  readonly blankCorrected: number;
  readonly normalizationFactor: number;
  readonly normalizedSignal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
    batchReference: { type: "number", exclusiveMinimum: 0 },
    targetReference: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleSignal",
    "blankSignal",
    "batchReference",
    "targetReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankCorrected: { type: "number" },
    normalizationFactor: { type: "number" },
    normalizedSignal: { type: "number" },
  },
  required: ["blankCorrected", "normalizationFactor", "normalizedSignal"],
} as const;
/** Linear reference-slide normalization after explicit blank subtraction, not a stain-interpretation or diagnostic threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal, batchReference, targetReference } =
    request;
  const compute = (): Output => {
    H.positive(batchReference);
    H.positive(targetReference);
    return {
      blankCorrected: sampleSignal - blankSignal,
      normalizationFactor: targetReference / batchReference,
      normalizedSignal:
        ((sampleSignal - blankSignal) * targetReference) / batchReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleSignal: 120,
    blankSignal: 20,
    batchReference: 80,
    targetReference: 100,
  },
  output: {
    blankCorrected: 100,
    normalizationFactor: 1.25,
    normalizedSignal: 125,
  },
} satisfies ToolExample<Input, Output>;
export const stainBatchReferenceSlideGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/stain-batch-reference-slide-gap",
    title: "Stain Batch Reference Slide Gap Tool",
    description:
      "Linear reference-slide normalization after explicit blank subtraction, not a stain-interpretation or diagnostic threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
        batchReference: { type: "number", exclusiveMinimum: 0 },
        targetReference: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sampleSignal",
        "blankSignal",
        "batchReference",
        "targetReference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankCorrected: { type: "number" },
        normalizationFactor: { type: "number" },
        normalizedSignal: { type: "number" },
      },
      required: ["blankCorrected", "normalizationFactor", "normalizedSignal"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignal",
          label: "Sample Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSignal",
          label: "Blank Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "batchReference",
          label: "Batch Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetReference",
          label: "Target Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blankCorrected",
          label: "Blank Corrected",
          valueType: { type: "number" },
        },
        {
          id: "normalizationFactor",
          label: "Normalization Factor",
          valueType: { type: "number" },
        },
        {
          id: "normalizedSignal",
          label: "Normalized Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stainBatchReferenceSlideGapTool.execute;
export default stainBatchReferenceSlideGapTool;
