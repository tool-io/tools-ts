import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly windowEnd: number;
  readonly windowWidth: number;
};
export type Output = {
  readonly included: boolean;
  readonly lowerInclusive: number;
  readonly upperExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    windowEnd: { type: "number" },
    windowWidth: { type: "number", minimum: 0 },
  },
  required: ["eventTime", "windowEnd", "windowWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "boolean" },
    lowerInclusive: { type: "number" },
    upperExclusive: { type: "number" },
  },
  required: ["included", "lowerInclusive", "upperExclusive"],
} as const;
/** Check a supplied event against a half-open rolling window ending at an explicit timestamp. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, windowEnd, windowWidth } = request;
  const compute = (): Output => {
    H.domain(windowWidth >= 0, "windowWidth");
    return {
      included: eventTime >= windowEnd - windowWidth && eventTime < windowEnd,
      lowerInclusive: windowEnd - windowWidth,
      upperExclusive: windowEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 8, windowEnd: 10, windowWidth: 5 },
  output: { included: true, lowerInclusive: 5, upperExclusive: 10 },
} satisfies ToolExample<Input, Output>;
export const rollingMetricWindowBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/rolling-metric-window-boundary",
    title: "Rolling Metric Window Boundary",
    description:
      "Check a supplied event against a half-open rolling window ending at an explicit timestamp.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        windowEnd: { type: "number" },
        windowWidth: { type: "number", minimum: 0 },
      },
      required: ["eventTime", "windowEnd", "windowWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "boolean" },
        lowerInclusive: { type: "number" },
        upperExclusive: { type: "number" },
      },
      required: ["included", "lowerInclusive", "upperExclusive"],
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
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowWidth",
          label: "Window Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          valueType: { type: "number" },
        },
        {
          id: "upperExclusive",
          label: "Upper Exclusive",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rollingMetricWindowBoundaryTool.execute;
export default rollingMetricWindowBoundaryTool;
