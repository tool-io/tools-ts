import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDay: number;
  readonly recordedBirthDay: number;
  readonly correctedBirthDay: number;
};
export type Output = {
  readonly recordedAge: number;
  readonly correctedAge: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDay: { type: "integer" },
    recordedBirthDay: { type: "integer" },
    correctedBirthDay: { type: "integer" },
  },
  required: ["observationDay", "recordedBirthDay", "correctedBirthDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAge: { type: "integer" },
    correctedAge: { type: "integer" },
    gap: { type: "integer" },
  },
  required: ["recordedAge", "correctedAge", "gap"],
} as const;
/** Compare supplied research age anchors; does not choose a clinical age correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDay, recordedBirthDay, correctedBirthDay } = request;
  const compute = (): Output => {
    H.domain(
      observationDay >= recordedBirthDay && observationDay >= correctedBirthDay,
    );
    return {
      recordedAge: observationDay - recordedBirthDay,
      correctedAge: observationDay - correctedBirthDay,
      gap: recordedBirthDay - correctedBirthDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationDay: 100, recordedBirthDay: 20, correctedBirthDay: 25 },
  output: { recordedAge: 80, correctedAge: 75, gap: -5 },
} satisfies ToolExample<Input, Output>;
export const infancyAgeAnchorCorrectionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/infancy-age-anchor-correction-gap",
    title: "Infancy Age Anchor Correction Gap Tool",
    description:
      "Compare supplied research age anchors; does not choose a clinical age correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDay: { type: "integer" },
        recordedBirthDay: { type: "integer" },
        correctedBirthDay: { type: "integer" },
      },
      required: ["observationDay", "recordedBirthDay", "correctedBirthDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAge: { type: "integer" },
        correctedAge: { type: "integer" },
        gap: { type: "integer" },
      },
      required: ["recordedAge", "correctedAge", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedBirthDay",
          label: "Recorded Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "correctedBirthDay",
          label: "Corrected Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "recordedAge",
          label: "Recorded Age",
          valueType: { type: "integer" },
        },
        {
          id: "correctedAge",
          label: "Corrected Age",
          valueType: { type: "integer" },
        },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = infancyAgeAnchorCorrectionGapTool.execute;
export default infancyAgeAnchorCorrectionGapTool;
