import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timestampSeconds: number;
  readonly boundaryOffsetSeconds: number;
};
export type Output = {
  readonly shiftedDayIndex: number;
  readonly secondsIntoShiftedDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timestampSeconds: { type: "number" },
    boundaryOffsetSeconds: { type: "number" },
  },
  required: ["timestampSeconds", "boundaryOffsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedDayIndex: { type: "integer" },
    secondsIntoShiftedDay: { type: "number" },
  },
  required: ["shiftedDayIndex", "secondsIntoShiftedDay"],
} as const;
/** Map an explicit timestamp to a fixed 86400-second wearable day boundary without inferring local timezone or daylight-saving changes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timestampSeconds, boundaryOffsetSeconds } = request;
  const compute = (): Output => {
    return (() => {
      const shifted = timestampSeconds - boundaryOffsetSeconds;
      const shiftedDayIndex = Math.floor(shifted / 86400);
      return {
        shiftedDayIndex,
        secondsIntoShiftedDay: shifted - shiftedDayIndex * 86400,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { timestampSeconds: 90000, boundaryOffsetSeconds: 21600 },
  output: { shiftedDayIndex: 0, secondsIntoShiftedDay: 68400 },
} satisfies ToolExample<Input, Output>;
export const wearableDayBoundaryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/wearable-day-boundary-offset",
    title: "Wearable Day Boundary Offset",
    description:
      "Map an explicit timestamp to a fixed 86400-second wearable day boundary without inferring local timezone or daylight-saving changes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timestampSeconds: { type: "number" },
        boundaryOffsetSeconds: { type: "number" },
      },
      required: ["timestampSeconds", "boundaryOffsetSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedDayIndex: { type: "integer" },
        secondsIntoShiftedDay: { type: "number" },
      },
      required: ["shiftedDayIndex", "secondsIntoShiftedDay"],
    },
    ports: {
      inputs: [
        {
          id: "timestampSeconds",
          label: "Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryOffsetSeconds",
          label: "Boundary Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shiftedDayIndex",
          label: "Shifted Day Index",
          valueType: { type: "integer" },
        },
        {
          id: "secondsIntoShiftedDay",
          label: "Seconds Into Shifted Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wearableDayBoundaryOffsetTool.execute;
export default wearableDayBoundaryOffsetTool;
