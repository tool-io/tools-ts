import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preservedLength: number;
  readonly originalRetention: number;
  readonly preservedMass: number;
  readonly massRetention: number;
};
export type Output = {
  readonly correctedLength: number;
  readonly correctedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedLength: { type: "number", minimum: 0 },
    originalRetention: { type: "number", exclusiveMinimum: 0 },
    preservedMass: { type: "number", minimum: 0 },
    massRetention: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "preservedLength",
    "originalRetention",
    "preservedMass",
    "massRetention",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedLength: { type: "number" },
    correctedMass: { type: "number" },
  },
  required: ["correctedLength", "correctedMass"],
} as const;
/** Separate caller-calibrated length and mass retention corrections; an isotropic mass-length relation is not imposed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preservedLength, originalRetention, preservedMass, massRetention } =
    request;
  const compute = (): Output => {
    H.domain(preservedLength >= 0 && preservedMass >= 0);
    H.positive(originalRetention);
    H.positive(massRetention);
    return {
      correctedLength: preservedLength / originalRetention,
      correctedMass: preservedMass / massRetention,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preservedLength: 90,
    originalRetention: 0.9,
    preservedMass: 18,
    massRetention: 0.75,
  },
  output: { correctedLength: 100, correctedMass: 24 },
} satisfies ToolExample<Input, Output>;
export const fishSamplePreservationShrinkFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-sample-preservation-shrink-factor",
    title: "Fish Sample Preservation Shrink Factor Tool",
    description:
      "Separate caller-calibrated length and mass retention corrections; an isotropic mass-length relation is not imposed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preservedLength: { type: "number", minimum: 0 },
        originalRetention: { type: "number", exclusiveMinimum: 0 },
        preservedMass: { type: "number", minimum: 0 },
        massRetention: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "preservedLength",
        "originalRetention",
        "preservedMass",
        "massRetention",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedLength: { type: "number" },
        correctedMass: { type: "number" },
      },
      required: ["correctedLength", "correctedMass"],
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
          id: "originalRetention",
          label: "Original Retention",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preservedMass",
          label: "Preserved Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massRetention",
          label: "Mass Retention",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedLength",
          label: "Corrected Length",
          valueType: { type: "number" },
        },
        {
          id: "correctedMass",
          label: "Corrected Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishSamplePreservationShrinkFactorTool.execute;
export default fishSamplePreservationShrinkFactorTool;
