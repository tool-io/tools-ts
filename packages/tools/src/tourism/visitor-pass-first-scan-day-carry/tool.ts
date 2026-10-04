import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scanMinute: number;
  readonly offsetMinutes: number;
  readonly dayBoundaryMinute: number;
};
export type Output = {
  readonly operatingDay: number;
  readonly minuteIntoDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scanMinute: { type: "integer" },
    offsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
    dayBoundaryMinute: { type: "integer", minimum: 0, maximum: 1439 },
  },
  required: ["scanMinute", "offsetMinutes", "dayBoundaryMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatingDay: { type: "integer" },
    minuteIntoDay: { type: "integer" },
  },
  required: ["operatingDay", "minuteIntoDay"],
} as const;
/** Assign an explicit minute index to an operating day with supplied UTC offset and day boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scanMinute, offsetMinutes, dayBoundaryMinute } = request;
  const compute = (): Output => {
    H.integer(scanMinute, -Number.MAX_SAFE_INTEGER);
    H.integer(offsetMinutes, -1439, 1439);
    H.integer(dayBoundaryMinute, 0, 1439);
    return {
      operatingDay: Math.floor(
        (scanMinute + offsetMinutes - dayBoundaryMinute) / 1440,
      ),
      minuteIntoDay:
        (((scanMinute + offsetMinutes - dayBoundaryMinute) % 1440) + 1440) %
        1440,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scanMinute: 60, offsetMinutes: 0, dayBoundaryMinute: 240 },
  output: { operatingDay: -1, minuteIntoDay: 1260 },
} satisfies ToolExample<Input, Output>;
export const visitorPassFirstScanDayCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/visitor-pass-first-scan-day-carry",
    title: "Visitor Pass First Scan Day Carry Tool",
    description:
      "Assign an explicit minute index to an operating day with supplied UTC offset and day boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scanMinute: { type: "integer" },
        offsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
        dayBoundaryMinute: { type: "integer", minimum: 0, maximum: 1439 },
      },
      required: ["scanMinute", "offsetMinutes", "dayBoundaryMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operatingDay: { type: "integer" },
        minuteIntoDay: { type: "integer" },
      },
      required: ["operatingDay", "minuteIntoDay"],
    },
    ports: {
      inputs: [
        {
          id: "scanMinute",
          label: "Scan Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetMinutes",
          label: "Offset Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dayBoundaryMinute",
          label: "Day Boundary Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "operatingDay",
          label: "Operating Day",
          valueType: { type: "integer" },
        },
        {
          id: "minuteIntoDay",
          label: "Minute Into Day",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = visitorPassFirstScanDayCarryTool.execute;
export default visitorPassFirstScanDayCarryTool;
