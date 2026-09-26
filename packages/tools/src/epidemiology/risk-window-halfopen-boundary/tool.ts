import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = {
  readonly inRiskWindow: boolean;
  readonly atExcludedEnd: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["eventTime", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inRiskWindow: { type: "boolean" },
    atExcludedEnd: { type: "boolean" },
  },
  required: ["inRiskWindow", "atExcludedEnd"],
} as const;
/** Membership in a supplied half-open research risk window, without estimating individual medical risk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(windowEnd >= windowStart);
    return {
      inRiskWindow: eventTime >= windowStart && eventTime < windowEnd,
      atExcludedEnd: eventTime === windowEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 20, windowStart: 10, windowEnd: 20 },
  output: { inRiskWindow: false, atExcludedEnd: true },
} satisfies ToolExample<Input, Output>;
export const riskWindowHalfopenBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/risk-window-halfopen-boundary",
    title: "Risk Window Halfopen Boundary Tool",
    description:
      "Membership in a supplied half-open research risk window, without estimating individual medical risk.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["eventTime", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inRiskWindow: { type: "boolean" },
        atExcludedEnd: { type: "boolean" },
      },
      required: ["inRiskWindow", "atExcludedEnd"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
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
      ],
      outputs: [
        {
          id: "inRiskWindow",
          label: "In Risk Window",
          valueType: { type: "boolean" },
        },
        {
          id: "atExcludedEnd",
          label: "At Excluded End",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskWindowHalfopenBoundaryTool.execute;
export default riskWindowHalfopenBoundaryTool;
