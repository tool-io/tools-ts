import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureAvailableTime: number;
  readonly eventTime: number;
  readonly allowEquality: boolean;
};
export type Output = {
  readonly availableBeforeEvent: boolean;
  readonly lag: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureAvailableTime: { type: "number" },
    eventTime: { type: "number" },
    allowEquality: { type: "boolean" },
  },
  required: ["featureAvailableTime", "eventTime", "allowEquality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableBeforeEvent: { type: "boolean" },
    lag: { type: "number" },
  },
  required: ["availableBeforeEvent", "lag"],
} as const;
/** Compare an explicit feature-availability time with an event boundary under a supplied equality convention without asserting absence of other leakage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureAvailableTime, eventTime, allowEquality } = request;
  const compute = (): Output => {
    return {
      availableBeforeEvent:
        featureAvailableTime < eventTime ||
        (featureAvailableTime === eventTime && allowEquality),
      lag: eventTime - featureAvailableTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureAvailableTime: 90, eventTime: 100, allowEquality: false },
  output: { availableBeforeEvent: true, lag: 10 },
} satisfies ToolExample<Input, Output>;
export const eventTimeFeatureTimeOrderFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/event-time-feature-time-order-flag",
    title: "Event Time Feature Time Order Flag",
    description:
      "Compare an explicit feature-availability time with an event boundary under a supplied equality convention without asserting absence of other leakage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureAvailableTime: { type: "number" },
        eventTime: { type: "number" },
        allowEquality: { type: "boolean" },
      },
      required: ["featureAvailableTime", "eventTime", "allowEquality"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableBeforeEvent: { type: "boolean" },
        lag: { type: "number" },
      },
      required: ["availableBeforeEvent", "lag"],
    },
    ports: {
      inputs: [
        {
          id: "featureAvailableTime",
          label: "Feature Available Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowEquality",
          label: "Allow Equality",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "availableBeforeEvent",
          label: "Available Before Event",
          valueType: { type: "boolean" },
        },
        { id: "lag", label: "Lag", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eventTimeFeatureTimeOrderFlagTool.execute;
export default eventTimeFeatureTimeOrderFlagTool;
