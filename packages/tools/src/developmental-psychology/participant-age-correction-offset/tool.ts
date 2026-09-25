import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAgeDays: number;
  readonly suppliedCorrectionDays: number;
  readonly targetAgeDays: number;
};
export type Output = {
  readonly correctedAgeDays: number;
  readonly targetOffsetDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAgeDays: { type: "integer" },
    suppliedCorrectionDays: { type: "integer" },
    targetAgeDays: { type: "integer" },
  },
  required: ["recordedAgeDays", "suppliedCorrectionDays", "targetAgeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAgeDays: { type: "integer" },
    targetOffsetDays: { type: "integer" },
  },
  required: ["correctedAgeDays", "targetOffsetDays"],
} as const;
/** Apply an explicit research age correction without deriving clinical corrected age or developmental expectations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAgeDays, suppliedCorrectionDays, targetAgeDays } = request;
  const compute = (): Output => {
    return {
      correctedAgeDays: recordedAgeDays + suppliedCorrectionDays,
      targetOffsetDays:
        recordedAgeDays + suppliedCorrectionDays - targetAgeDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedAgeDays: 100,
    suppliedCorrectionDays: -10,
    targetAgeDays: 85,
  },
  output: { correctedAgeDays: 90, targetOffsetDays: 5 },
} satisfies ToolExample<Input, Output>;
export const participantAgeCorrectionOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/participant-age-correction-offset",
    title: "Participant Age Correction Offset Tool",
    description:
      "Apply an explicit research age correction without deriving clinical corrected age or developmental expectations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAgeDays: { type: "integer" },
        suppliedCorrectionDays: { type: "integer" },
        targetAgeDays: { type: "integer" },
      },
      required: ["recordedAgeDays", "suppliedCorrectionDays", "targetAgeDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedAgeDays: { type: "integer" },
        targetOffsetDays: { type: "integer" },
      },
      required: ["correctedAgeDays", "targetOffsetDays"],
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
          id: "targetAgeDays",
          label: "Target Age Days",
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
        {
          id: "targetOffsetDays",
          label: "Target Offset Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = participantAgeCorrectionOffsetTool.execute;
export default participantAgeCorrectionOffsetTool;
