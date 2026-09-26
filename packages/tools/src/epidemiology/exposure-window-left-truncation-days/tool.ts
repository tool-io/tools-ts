import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly observationEntry: number;
};
export type Output = {
  readonly unobservedDays: number;
  readonly observedDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStart: { type: "integer" },
    windowEnd: { type: "integer" },
    observationEntry: { type: "integer" },
  },
  required: ["windowStart", "windowEnd", "observationEntry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unobservedDays: { type: "integer" },
    observedDays: { type: "integer" },
  },
  required: ["unobservedDays", "observedDays"],
} as const;
/** Split a supplied half-open exposure window at observation entry without inferring exposure or incidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowStart, windowEnd, observationEntry } = request;
  const compute = (): Output => {
    H.domain(windowStart <= windowEnd);
    return {
      unobservedDays: Math.max(
        0,
        Math.min(windowEnd, observationEntry) - windowStart,
      ),
      observedDays: Math.max(
        0,
        windowEnd - Math.max(windowStart, observationEntry),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { windowStart: 0, windowEnd: 100, observationEntry: 30 },
  output: { unobservedDays: 30, observedDays: 70 },
} satisfies ToolExample<Input, Output>;
export const exposureWindowLeftTruncationDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/exposure-window-left-truncation-days",
    title: "Exposure Window Left Truncation Days Tool",
    description:
      "Split a supplied half-open exposure window at observation entry without inferring exposure or incidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowStart: { type: "integer" },
        windowEnd: { type: "integer" },
        observationEntry: { type: "integer" },
      },
      required: ["windowStart", "windowEnd", "observationEntry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unobservedDays: { type: "integer" },
        observedDays: { type: "integer" },
      },
      required: ["unobservedDays", "observedDays"],
    },
    ports: {
      inputs: [
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationEntry",
          label: "Observation Entry",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unobservedDays",
          label: "Unobserved Days",
          valueType: { type: "integer" },
        },
        {
          id: "observedDays",
          label: "Observed Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureWindowLeftTruncationDaysTool.execute;
export default exposureWindowLeftTruncationDaysTool;
