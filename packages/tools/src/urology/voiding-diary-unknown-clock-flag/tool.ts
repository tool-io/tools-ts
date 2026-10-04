import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hour: number;
  readonly minute: number;
  readonly clockKnown: boolean;
};
export type Output = {
  readonly minuteOfDay: number;
  readonly timeDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer", minimum: 0, maximum: 23 },
    minute: { type: "integer", minimum: 0, maximum: 59 },
    clockKnown: { type: "boolean" },
  },
  required: ["hour", "minute", "clockKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer" },
    timeDefined: { type: "boolean" },
  },
  required: ["minuteOfDay", "timeDefined"],
} as const;
/** Preserve unknown diary clock time with a definition flag rather than assigning midnight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hour, minute, clockKnown } = request;
  const compute = (): Output => {
    H.integer(hour, 0, 23);
    H.integer(minute, 0, 59);
    return {
      minuteOfDay: clockKnown ? hour * 60 + minute : 0,
      timeDefined: clockKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hour: 8, minute: 30, clockKnown: true },
  output: { minuteOfDay: 510, timeDefined: true },
} satisfies ToolExample<Input, Output>;
export const voidingDiaryUnknownClockFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/voiding-diary-unknown-clock-flag",
    title: "Voiding Diary Unknown Clock Flag Tool",
    description:
      "Preserve unknown diary clock time with a definition flag rather than assigning midnight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hour: { type: "integer", minimum: 0, maximum: 23 },
        minute: { type: "integer", minimum: 0, maximum: 59 },
        clockKnown: { type: "boolean" },
      },
      required: ["hour", "minute", "clockKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer" },
        timeDefined: { type: "boolean" },
      },
      required: ["minuteOfDay", "timeDefined"],
    },
    ports: {
      inputs: [
        {
          id: "hour",
          label: "Hour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minute",
          label: "Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "clockKnown",
          label: "Clock Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          valueType: { type: "integer" },
        },
        {
          id: "timeDefined",
          label: "Time Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = voidingDiaryUnknownClockFlagTool.execute;
export default voidingDiaryUnknownClockFlagTool;
