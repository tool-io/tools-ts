import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preservedLength: number;
  readonly suppliedRetentionFactor: number;
  readonly freshReference: number;
};
export type Output = {
  readonly conditionalFreshLength: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedLength: { type: "number", minimum: 0 },
    suppliedRetentionFactor: { type: "number", exclusiveMinimum: 0 },
    freshReference: { type: "number", minimum: 0 },
  },
  required: ["preservedLength", "suppliedRetentionFactor", "freshReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalFreshLength: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["conditionalFreshLength", "referenceGap"],
} as const;
/** Invert an explicitly supplied preservation scale factor; no species/material correction is guessed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preservedLength, suppliedRetentionFactor, freshReference } = request;
  const compute = (): Output => {
    H.domain(preservedLength >= 0 && freshReference >= 0);
    H.positive(suppliedRetentionFactor);
    return {
      conditionalFreshLength: preservedLength / suppliedRetentionFactor,
      referenceGap: preservedLength / suppliedRetentionFactor - freshReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preservedLength: 8,
    suppliedRetentionFactor: 0.8,
    freshReference: 9,
  },
  output: { conditionalFreshLength: 10, referenceGap: 1 },
} satisfies ToolExample<Input, Output>;
export const insectMeasurementPreservationBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-measurement-preservation-base",
    title: "Insect Measurement Preservation Base Tool",
    description:
      "Invert an explicitly supplied preservation scale factor; no species/material correction is guessed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preservedLength: { type: "number", minimum: 0 },
        suppliedRetentionFactor: { type: "number", exclusiveMinimum: 0 },
        freshReference: { type: "number", minimum: 0 },
      },
      required: [
        "preservedLength",
        "suppliedRetentionFactor",
        "freshReference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalFreshLength: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["conditionalFreshLength", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "preservedLength",
          label: "Preserved Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetentionFactor",
          label: "Supplied Retention Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freshReference",
          label: "Fresh Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionalFreshLength",
          label: "Conditional Fresh Length",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectMeasurementPreservationBaseTool.execute;
export default insectMeasurementPreservationBaseTool;
