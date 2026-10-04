import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localStart: number;
  readonly localEnd: number;
  readonly startUtcOffset: number;
  readonly endUtcOffset: number;
};
export type Output = {
  readonly localDuration: number;
  readonly correctedDuration: number;
  readonly offsetChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localStart: { type: "number" },
    localEnd: { type: "number" },
    startUtcOffset: { type: "number" },
    endUtcOffset: { type: "number" },
  },
  required: ["localStart", "localEnd", "startUtcOffset", "endUtcOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localDuration: { type: "number" },
    correctedDuration: { type: "number" },
    offsetChange: { type: "number" },
  },
  required: ["localDuration", "correctedDuration", "offsetChange"],
} as const;
/** Elapsed duration after explicit offset correction, using one shared time unit and no inferred time zone rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localStart, localEnd, startUtcOffset, endUtcOffset } = request;
  const compute = (): Output => {
    return {
      localDuration: localEnd - localStart,
      correctedDuration: localEnd - endUtcOffset - localStart + startUtcOffset,
      offsetChange: endUtcOffset - startUtcOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localStart: 0, localEnd: 8, startUtcOffset: 1, endUtcOffset: 2 },
  output: { localDuration: 8, correctedDuration: 7, offsetChange: 1 },
} satisfies ToolExample<Input, Output>;
export const urinaryDiaryClockShiftDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/urinary-diary-clock-shift-duration",
    title: "Urinary Diary Clock Shift Duration Tool",
    description:
      "Elapsed duration after explicit offset correction, using one shared time unit and no inferred time zone rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localStart: { type: "number" },
        localEnd: { type: "number" },
        startUtcOffset: { type: "number" },
        endUtcOffset: { type: "number" },
      },
      required: ["localStart", "localEnd", "startUtcOffset", "endUtcOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localDuration: { type: "number" },
        correctedDuration: { type: "number" },
        offsetChange: { type: "number" },
      },
      required: ["localDuration", "correctedDuration", "offsetChange"],
    },
    ports: {
      inputs: [
        {
          id: "localStart",
          label: "Local Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "localEnd",
          label: "Local End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startUtcOffset",
          label: "Start Utc Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endUtcOffset",
          label: "End Utc Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "localDuration",
          label: "Local Duration",
          valueType: { type: "number" },
        },
        {
          id: "correctedDuration",
          label: "Corrected Duration",
          valueType: { type: "number" },
        },
        {
          id: "offsetChange",
          label: "Offset Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urinaryDiaryClockShiftDurationTool.execute;
export default urinaryDiaryClockShiftDurationTool;
