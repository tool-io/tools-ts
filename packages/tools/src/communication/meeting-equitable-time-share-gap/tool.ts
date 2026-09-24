import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakerSeconds: number;
  readonly totalSeconds: number;
  readonly participants: number;
};
export type Output = {
  readonly actualFraction: number;
  readonly equalFraction: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakerSeconds: { type: "number", minimum: 0 },
    totalSeconds: { type: "number", exclusiveMinimum: 0 },
    participants: { type: "integer", minimum: 1 },
  },
  required: ["speakerSeconds", "totalSeconds", "participants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualFraction: { type: "number" },
    equalFraction: { type: "number" },
    gap: { type: "number" },
  },
  required: ["actualFraction", "equalFraction", "gap"],
} as const;
/** Compare an explicit speaking-time fraction with equal allocation; equality alone is not an assessment of meeting quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerSeconds, totalSeconds, participants } = request;
  const compute = (): Output => {
    H.positive(totalSeconds);
    H.domain(speakerSeconds >= 0 && speakerSeconds <= totalSeconds);
    H.integer(participants, 1);
    return {
      actualFraction: speakerSeconds / totalSeconds,
      equalFraction: 1 / participants,
      gap: speakerSeconds / totalSeconds - 1 / participants,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakerSeconds: 30, totalSeconds: 100, participants: 5 },
  output: { actualFraction: 0.3, equalFraction: 0.2, gap: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const meetingEquitableTimeShareGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/meeting-equitable-time-share-gap",
    title: "Meeting Equitable Time Share Gap Tool",
    description:
      "Compare an explicit speaking-time fraction with equal allocation; equality alone is not an assessment of meeting quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerSeconds: { type: "number", minimum: 0 },
        totalSeconds: { type: "number", exclusiveMinimum: 0 },
        participants: { type: "integer", minimum: 1 },
      },
      required: ["speakerSeconds", "totalSeconds", "participants"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualFraction: { type: "number" },
        equalFraction: { type: "number" },
        gap: { type: "number" },
      },
      required: ["actualFraction", "equalFraction", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "speakerSeconds",
          label: "Speaker Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participants",
          label: "Participants",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "actualFraction",
          label: "Actual Fraction",
          valueType: { type: "number" },
        },
        {
          id: "equalFraction",
          label: "Equal Fraction",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meetingEquitableTimeShareGapTool.execute;
export default meetingEquitableTimeShareGapTool;
