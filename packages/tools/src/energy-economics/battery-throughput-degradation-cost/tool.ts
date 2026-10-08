import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly throughputEnergy: number;
  readonly suppliedCostPerThroughputUnit: number;
};
export type Output = { readonly allocatedDegradationCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    throughputEnergy: { type: "number", minimum: 0 },
    suppliedCostPerThroughputUnit: { type: "number", minimum: 0 },
  },
  required: ["throughputEnergy", "suppliedCostPerThroughputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocatedDegradationCost: { type: "number" } },
  required: ["allocatedDegradationCost"],
} as const;
/** Allocate an explicitly supplied battery degradation cost per throughput-energy unit without modelling battery aging. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { throughputEnergy, suppliedCostPerThroughputUnit } = request;
  const compute = (): Output => {
    H.domain(
      throughputEnergy >= 0 && suppliedCostPerThroughputUnit >= 0,
      "throughputEnergy",
    );
    return {
      allocatedDegradationCost:
        throughputEnergy * suppliedCostPerThroughputUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { throughputEnergy: 1000, suppliedCostPerThroughputUnit: 0.02 },
  output: { allocatedDegradationCost: 20 },
} satisfies ToolExample<Input, Output>;
export const batteryThroughputDegradationCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/battery-throughput-degradation-cost",
    title: "Battery Throughput Degradation Cost",
    description:
      "Allocate an explicitly supplied battery degradation cost per throughput-energy unit without modelling battery aging.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        throughputEnergy: { type: "number", minimum: 0 },
        suppliedCostPerThroughputUnit: { type: "number", minimum: 0 },
      },
      required: ["throughputEnergy", "suppliedCostPerThroughputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allocatedDegradationCost: { type: "number" } },
      required: ["allocatedDegradationCost"],
    },
    ports: {
      inputs: [
        {
          id: "throughputEnergy",
          label: "Throughput Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCostPerThroughputUnit",
          label: "Supplied Cost Per Throughput Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedDegradationCost",
          label: "Allocated Degradation Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batteryThroughputDegradationCostTool.execute;
export default batteryThroughputDegradationCostTool;
