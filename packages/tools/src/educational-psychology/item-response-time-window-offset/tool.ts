import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly suppliedClockOffset: number;
};
export type Output = {
  readonly normalizedTime: number;
  readonly lowerOffset: number;
  readonly upperOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["responseTime", "windowStart", "windowEnd", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedTime: { type: "number" },
    lowerOffset: { type: "number" },
    upperOffset: { type: "number" },
  },
  required: ["normalizedTime", "lowerOffset", "upperOffset"],
} as const;
/** Compare a supplied research item timestamp to explicit clock/window bounds without ability inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseTime, windowStart, windowEnd, suppliedClockOffset } = request;
  const compute = (): Output => {
    H.domain(windowStart <= windowEnd);
    return {
      normalizedTime: responseTime - suppliedClockOffset,
      lowerOffset: responseTime - suppliedClockOffset - windowStart,
      upperOffset: windowEnd - responseTime + suppliedClockOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseTime: 15,
    windowStart: 10,
    windowEnd: 20,
    suppliedClockOffset: 2,
  },
  output: { normalizedTime: 13, lowerOffset: 3, upperOffset: 7 },
} satisfies ToolExample<Input, Output>;
export const itemResponseTimeWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/item-response-time-window-offset",
    title: "Item Response Time Window Offset Tool",
    description:
      "Compare a supplied research item timestamp to explicit clock/window bounds without ability inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: [
        "responseTime",
        "windowStart",
        "windowEnd",
        "suppliedClockOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedTime: { type: "number" },
        lowerOffset: { type: "number" },
        upperOffset: { type: "number" },
      },
      required: ["normalizedTime", "lowerOffset", "upperOffset"],
    },
    ports: {
      inputs: [
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedTime",
          label: "Normalized Time",
          valueType: { type: "number" },
        },
        {
          id: "lowerOffset",
          label: "Lower Offset",
          valueType: { type: "number" },
        },
        {
          id: "upperOffset",
          label: "Upper Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = itemResponseTimeWindowOffsetTool.execute;
export default itemResponseTimeWindowOffsetTool;
