import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly deliveryTime: number;
  readonly responseOffset: number;
  readonly deliveryOffset: number;
};
export type Output = {
  readonly observedLag: number;
  readonly correctedLag: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    deliveryTime: { type: "number" },
    responseOffset: { type: "number" },
    deliveryOffset: { type: "number" },
  },
  required: [
    "responseTime",
    "deliveryTime",
    "responseOffset",
    "deliveryOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedLag: { type: "number" },
    correctedLag: { type: "number" },
  },
  required: ["observedLag", "correctedLag"],
} as const;
/** Correct two annotated research-event clocks to a supplied common reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseTime, deliveryTime, responseOffset, deliveryOffset } =
    request;
  const compute = (): Output => {
    return {
      observedLag: deliveryTime - responseTime,
      correctedLag:
        deliveryTime - deliveryOffset - responseTime + responseOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseTime: 10,
    deliveryTime: 12,
    responseOffset: 1,
    deliveryOffset: 0,
  },
  output: { observedLag: 2, correctedLag: 3 },
} satisfies ToolExample<Input, Output>;
export const reinforcementDeliveryClockGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/reinforcement-delivery-clock-gap",
    title: "Reinforcement Delivery Clock Gap Tool",
    description:
      "Correct two annotated research-event clocks to a supplied common reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        deliveryTime: { type: "number" },
        responseOffset: { type: "number" },
        deliveryOffset: { type: "number" },
      },
      required: [
        "responseTime",
        "deliveryTime",
        "responseOffset",
        "deliveryOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedLag: { type: "number" },
        correctedLag: { type: "number" },
      },
      required: ["observedLag", "correctedLag"],
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
          id: "deliveryTime",
          label: "Delivery Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseOffset",
          label: "Response Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveryOffset",
          label: "Delivery Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedLag",
          label: "Observed Lag",
          valueType: { type: "number" },
        },
        {
          id: "correctedLag",
          label: "Corrected Lag",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reinforcementDeliveryClockGapTool.execute;
export default reinforcementDeliveryClockGapTool;
