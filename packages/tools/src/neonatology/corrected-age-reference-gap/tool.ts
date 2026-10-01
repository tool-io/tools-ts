import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAgeDays: number;
  readonly suppliedCorrectionDays: number;
  readonly referenceAgeDays: number;
};
export type Output = {
  readonly correctedAgeDays: number;
  readonly gapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAgeDays: { type: "integer" },
    suppliedCorrectionDays: { type: "integer" },
    referenceAgeDays: { type: "integer" },
  },
  required: ["recordedAgeDays", "suppliedCorrectionDays", "referenceAgeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAgeDays: { type: "integer" },
    gapDays: { type: "integer" },
  },
  required: ["correctedAgeDays", "gapDays"],
} as const;
/** Compare caller-supplied research age correction and reference values without deriving prematurity adjustments or developmental norms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAgeDays, suppliedCorrectionDays, referenceAgeDays } = request;
  const compute = (): Output => {
    return {
      correctedAgeDays: recordedAgeDays - suppliedCorrectionDays,
      gapDays: recordedAgeDays - suppliedCorrectionDays - referenceAgeDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedAgeDays: 100,
    suppliedCorrectionDays: 20,
    referenceAgeDays: 75,
  },
  output: { correctedAgeDays: 80, gapDays: 5 },
} satisfies ToolExample<Input, Output>;
export const correctedAgeReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/corrected-age-reference-gap",
    title: "Corrected Age Reference Gap Tool",
    description:
      "Compare caller-supplied research age correction and reference values without deriving prematurity adjustments or developmental norms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAgeDays: { type: "integer" },
        suppliedCorrectionDays: { type: "integer" },
        referenceAgeDays: { type: "integer" },
      },
      required: [
        "recordedAgeDays",
        "suppliedCorrectionDays",
        "referenceAgeDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedAgeDays: { type: "integer" },
        gapDays: { type: "integer" },
      },
      required: ["correctedAgeDays", "gapDays"],
    },
    ports: {
      inputs: [
        {
          id: "recordedAgeDays",
          label: "Recorded Age Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCorrectionDays",
          label: "Supplied Correction Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceAgeDays",
          label: "Reference Age Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "correctedAgeDays",
          label: "Corrected Age Days",
          valueType: { type: "integer" },
        },
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = correctedAgeReferenceGapTool.execute;
export default correctedAgeReferenceGapTool;
