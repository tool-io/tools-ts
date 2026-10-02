import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly endDay: number;
  readonly recalledStartLower: number;
  readonly recalledStartUpper: number;
};
export type Output = {
  readonly durationLower: number;
  readonly durationUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endDay: { type: "number" },
    recalledStartLower: { type: "number" },
    recalledStartUpper: { type: "number" },
  },
  required: ["endDay", "recalledStartLower", "recalledStartUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationLower: { type: "number" },
    durationUpper: { type: "number" },
  },
  required: ["durationLower", "durationUpper"],
} as const;
/** Propagate supplied diary recall uncertainty, without symptom or diagnostic scoring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { endDay, recalledStartLower, recalledStartUpper } = request;
  const compute = (): Output => {
    H.domain(
      recalledStartLower <= recalledStartUpper && recalledStartUpper <= endDay,
    );
    return {
      durationLower: endDay - recalledStartUpper,
      durationUpper: endDay - recalledStartLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { endDay: 30, recalledStartLower: 5, recalledStartUpper: 8 },
  output: { durationLower: 22, durationUpper: 25 },
} satisfies ToolExample<Input, Output>;
export const diaryRecallStartPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/diary-recall-start-precision",
    title: "Diary Recall Start Precision Tool",
    description:
      "Propagate supplied diary recall uncertainty, without symptom or diagnostic scoring.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endDay: { type: "number" },
        recalledStartLower: { type: "number" },
        recalledStartUpper: { type: "number" },
      },
      required: ["endDay", "recalledStartLower", "recalledStartUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationLower: { type: "number" },
        durationUpper: { type: "number" },
      },
      required: ["durationLower", "durationUpper"],
    },
    ports: {
      inputs: [
        {
          id: "endDay",
          label: "End Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recalledStartLower",
          label: "Recalled Start Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recalledStartUpper",
          label: "Recalled Start Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationLower",
          label: "Duration Lower",
          valueType: { type: "number" },
        },
        {
          id: "durationUpper",
          label: "Duration Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diaryRecallStartPrecisionTool.execute;
export default diaryRecallStartPrecisionTool;
