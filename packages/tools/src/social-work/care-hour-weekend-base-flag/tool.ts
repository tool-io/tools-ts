import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weekdayHours: number;
  readonly weekendHours: number;
  readonly weekendMultiplier: number;
  readonly includeWeekend: boolean;
};
export type Output = {
  readonly countedHours: number;
  readonly weightedHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekdayHours: { type: "number", minimum: 0 },
    weekendHours: { type: "number", minimum: 0 },
    weekendMultiplier: { type: "number", minimum: 0 },
    includeWeekend: { type: "boolean" },
  },
  required: [
    "weekdayHours",
    "weekendHours",
    "weekendMultiplier",
    "includeWeekend",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedHours: { type: "number" },
    weightedHours: { type: "number" },
  },
  required: ["countedHours", "weightedHours"],
} as const;
/** Calculate care hour weekend base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weekdayHours, weekendHours, weekendMultiplier, includeWeekend } =
    request;
  const compute = (): Output => {
    H.domain(weekdayHours >= 0 && weekendHours >= 0 && weekendMultiplier >= 0);
    return {
      countedHours: weekdayHours + (includeWeekend ? weekendHours : 0),
      weightedHours:
        weekdayHours + (includeWeekend ? weekendHours * weekendMultiplier : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    weekdayHours: 30,
    weekendHours: 10,
    weekendMultiplier: 1.5,
    includeWeekend: true,
  },
  output: { countedHours: 40, weightedHours: 45 },
} satisfies ToolExample<Input, Output>;
export const careHourWeekendBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/care-hour-weekend-base-flag",
    title: "Care Hour Weekend Base Flag Tool",
    description:
      "Calculate care hour weekend base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekdayHours: { type: "number", minimum: 0 },
        weekendHours: { type: "number", minimum: 0 },
        weekendMultiplier: { type: "number", minimum: 0 },
        includeWeekend: { type: "boolean" },
      },
      required: [
        "weekdayHours",
        "weekendHours",
        "weekendMultiplier",
        "includeWeekend",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedHours: { type: "number" },
        weightedHours: { type: "number" },
      },
      required: ["countedHours", "weightedHours"],
    },
    ports: {
      inputs: [
        {
          id: "weekdayHours",
          label: "Weekday Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weekendHours",
          label: "Weekend Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weekendMultiplier",
          label: "Weekend Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeWeekend",
          label: "Include Weekend",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedHours",
          label: "Counted Hours",
          valueType: { type: "number" },
        },
        {
          id: "weightedHours",
          label: "Weighted Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = careHourWeekendBaseFlagTool.execute;
export default careHourWeekendBaseFlagTool;
