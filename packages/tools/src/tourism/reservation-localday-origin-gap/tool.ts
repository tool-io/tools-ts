import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utcEpochSeconds: number;
  readonly firstOffsetSeconds: number;
  readonly secondOffsetSeconds: number;
};
export type Output = {
  readonly firstLocalDay: number;
  readonly secondLocalDay: number;
  readonly dayGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utcEpochSeconds: { type: "number" },
    firstOffsetSeconds: { type: "number" },
    secondOffsetSeconds: { type: "number" },
  },
  required: ["utcEpochSeconds", "firstOffsetSeconds", "secondOffsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLocalDay: { type: "integer" },
    secondLocalDay: { type: "integer" },
    dayGap: { type: "integer" },
  },
  required: ["firstLocalDay", "secondLocalDay", "dayGap"],
} as const;
/** Compare supplied fixed UTC-offset civil-day indices without choosing time zones or daylight rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utcEpochSeconds, firstOffsetSeconds, secondOffsetSeconds } = request;
  const compute = (): Output => {
    return (() => {
      const firstLocalDay = Math.floor(
          (utcEpochSeconds + firstOffsetSeconds) / 86400,
        ),
        secondLocalDay = Math.floor(
          (utcEpochSeconds + secondOffsetSeconds) / 86400,
        );
      return {
        firstLocalDay,
        secondLocalDay,
        dayGap: secondLocalDay - firstLocalDay,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    utcEpochSeconds: 0,
    firstOffsetSeconds: 0,
    secondOffsetSeconds: -3600,
  },
  output: { firstLocalDay: 0, secondLocalDay: -1, dayGap: -1 },
} satisfies ToolExample<Input, Output>;
export const reservationLocaldayOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/reservation-localday-origin-gap",
    title: "Reservation Localday Origin Gap Tool",
    description:
      "Compare supplied fixed UTC-offset civil-day indices without choosing time zones or daylight rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utcEpochSeconds: { type: "number" },
        firstOffsetSeconds: { type: "number" },
        secondOffsetSeconds: { type: "number" },
      },
      required: [
        "utcEpochSeconds",
        "firstOffsetSeconds",
        "secondOffsetSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLocalDay: { type: "integer" },
        secondLocalDay: { type: "integer" },
        dayGap: { type: "integer" },
      },
      required: ["firstLocalDay", "secondLocalDay", "dayGap"],
    },
    ports: {
      inputs: [
        {
          id: "utcEpochSeconds",
          label: "Utc Epoch Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOffsetSeconds",
          label: "First Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOffsetSeconds",
          label: "Second Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstLocalDay",
          label: "First Local Day",
          valueType: { type: "integer" },
        },
        {
          id: "secondLocalDay",
          label: "Second Local Day",
          valueType: { type: "integer" },
        },
        { id: "dayGap", label: "Day Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = reservationLocaldayOriginGapTool.execute;
export default reservationLocaldayOriginGapTool;
