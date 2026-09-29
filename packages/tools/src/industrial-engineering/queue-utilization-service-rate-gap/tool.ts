import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalRate: number;
  readonly serviceRatePerServer: number;
  readonly servers: number;
};
export type Output = {
  readonly capacity: number;
  readonly utilization: number;
  readonly capacityGap: number;
  readonly stableMeanRateCondition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalRate: { type: "number", minimum: 0 },
    serviceRatePerServer: { type: "number", exclusiveMinimum: 0 },
    servers: { type: "integer", minimum: 1 },
  },
  required: ["arrivalRate", "serviceRatePerServer", "servers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number" },
    utilization: { type: "number" },
    capacityGap: { type: "number" },
    stableMeanRateCondition: { type: "boolean" },
  },
  required: [
    "capacity",
    "utilization",
    "capacityGap",
    "stableMeanRateCondition",
  ],
} as const;
/** Mean arrival/capacity load check only; queueing distribution and finite waiting times require additional assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalRate, serviceRatePerServer, servers } = request;
  const compute = (): Output => {
    H.domain(arrivalRate >= 0);
    H.positive(serviceRatePerServer);
    H.integer(servers, 1);
    return {
      capacity: servers * serviceRatePerServer,
      utilization: arrivalRate / (servers * serviceRatePerServer),
      capacityGap: servers * serviceRatePerServer - arrivalRate,
      stableMeanRateCondition: arrivalRate < servers * serviceRatePerServer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalRate: 8, serviceRatePerServer: 5, servers: 2 },
  output: {
    capacity: 10,
    utilization: 0.8,
    capacityGap: 2,
    stableMeanRateCondition: true,
  },
} satisfies ToolExample<Input, Output>;
export const queueUtilizationServiceRateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/queue-utilization-service-rate-gap",
    title: "Queue Utilization Service Rate Gap Tool",
    description:
      "Mean arrival/capacity load check only; queueing distribution and finite waiting times require additional assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalRate: { type: "number", minimum: 0 },
        serviceRatePerServer: { type: "number", exclusiveMinimum: 0 },
        servers: { type: "integer", minimum: 1 },
      },
      required: ["arrivalRate", "serviceRatePerServer", "servers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number" },
        utilization: { type: "number" },
        capacityGap: { type: "number" },
        stableMeanRateCondition: { type: "boolean" },
      },
      required: [
        "capacity",
        "utilization",
        "capacityGap",
        "stableMeanRateCondition",
      ],
    },
    ports: {
      inputs: [
        {
          id: "arrivalRate",
          label: "Arrival Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "serviceRatePerServer",
          label: "Service Rate Per Server",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "servers",
          label: "Servers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "capacity", label: "Capacity", valueType: { type: "number" } },
        {
          id: "utilization",
          label: "Utilization",
          valueType: { type: "number" },
        },
        {
          id: "capacityGap",
          label: "Capacity Gap",
          valueType: { type: "number" },
        },
        {
          id: "stableMeanRateCondition",
          label: "Stable Mean Rate Condition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = queueUtilizationServiceRateGapTool.execute;
export default queueUtilizationServiceRateGapTool;
