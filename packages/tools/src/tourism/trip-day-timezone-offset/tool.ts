import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localHour: number;
  readonly sourceOffsetHours: number;
  readonly targetOffsetHours: number;
};
export type Output = { readonly targetHour: number; readonly dayShift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localHour: { type: "number", minimum: 0, exclusiveMaximum: 24 },
    sourceOffsetHours: { type: "number", minimum: -24, maximum: 24 },
    targetOffsetHours: { type: "number", minimum: -24, maximum: 24 },
  },
  required: ["localHour", "sourceOffsetHours", "targetOffsetHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetHour: { type: "number" }, dayShift: { type: "integer" } },
  required: ["targetHour", "dayShift"],
} as const;
/** Shift a supplied local clock hour using explicit UTC offsets; no time-zone database or daylight-saving inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localHour, sourceOffsetHours, targetOffsetHours } = request;
  const compute = (): Output => {
    H.domain(
      localHour >= 0 &&
        localHour < 24 &&
        sourceOffsetHours >= -24 &&
        sourceOffsetHours <= 24 &&
        targetOffsetHours >= -24 &&
        targetOffsetHours <= 24,
    );
    return {
      targetHour: H.mod(localHour - sourceOffsetHours + targetOffsetHours, 24),
      dayShift: Math.floor(
        (localHour - sourceOffsetHours + targetOffsetHours) / 24,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localHour: 23, sourceOffsetHours: -5, targetOffsetHours: 2 },
  output: { targetHour: 6, dayShift: 1 },
} satisfies ToolExample<Input, Output>;
export const tripDayTimezoneOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/trip-day-timezone-offset",
    title: "Trip Day Timezone Offset Tool",
    description:
      "Shift a supplied local clock hour using explicit UTC offsets; no time-zone database or daylight-saving inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localHour: { type: "number", minimum: 0, exclusiveMaximum: 24 },
        sourceOffsetHours: { type: "number", minimum: -24, maximum: 24 },
        targetOffsetHours: { type: "number", minimum: -24, maximum: 24 },
      },
      required: ["localHour", "sourceOffsetHours", "targetOffsetHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetHour: { type: "number" },
        dayShift: { type: "integer" },
      },
      required: ["targetHour", "dayShift"],
    },
    ports: {
      inputs: [
        {
          id: "localHour",
          label: "Local Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceOffsetHours",
          label: "Source Offset Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetOffsetHours",
          label: "Target Offset Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetHour",
          label: "Target Hour",
          valueType: { type: "number" },
        },
        { id: "dayShift", label: "Day Shift", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = tripDayTimezoneOffsetTool.execute;
export default tripDayTimezoneOffsetTool;
