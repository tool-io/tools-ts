import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetTimestampSeconds: number;
  readonly endTimestampSeconds: number;
};
export type Output = { readonly durationSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetTimestampSeconds: { type: "number" },
    endTimestampSeconds: { type: "number" },
  },
  required: ["onsetTimestampSeconds", "endTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationSeconds: { type: "number" } },
  required: ["durationSeconds"],
} as const;
/** Measure one explicitly recorded itch-diary interval without diagnosing or grading a symptom. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetTimestampSeconds, endTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      endTimestampSeconds >= onsetTimestampSeconds,
      "endTimestampSeconds",
    );
    return { durationSeconds: endTimestampSeconds - onsetTimestampSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onsetTimestampSeconds: 1000, endTimestampSeconds: 1180 },
  output: { durationSeconds: 180 },
} satisfies ToolExample<Input, Output>;
export const dermatologyDiaryItchTimePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/dermatology-diary-itch-time-pair",
    title: "Dermatology Diary Itch Time Pair",
    description:
      "Measure one explicitly recorded itch-diary interval without diagnosing or grading a symptom.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetTimestampSeconds: { type: "number" },
        endTimestampSeconds: { type: "number" },
      },
      required: ["onsetTimestampSeconds", "endTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationSeconds: { type: "number" } },
      required: ["durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "onsetTimestampSeconds",
          label: "Onset Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endTimestampSeconds",
          label: "End Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dermatologyDiaryItchTimePairTool.execute;
export default dermatologyDiaryItchTimePairTool;
