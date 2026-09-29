import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workloads: readonly number[];
  readonly availableTimes: readonly number[];
};
export type Output = {
  readonly utilizations: readonly number[];
  readonly maximumUtilization: number;
  readonly minimumUtilization: number;
  readonly imbalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workloads: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    availableTimes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["workloads", "availableTimes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utilizations: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumUtilization: { type: "number" },
    minimumUtilization: { type: "number" },
    imbalance: { type: "number" },
  },
  required: [
    "utilizations",
    "maximumUtilization",
    "minimumUtilization",
    "imbalance",
  ],
} as const;
/** Calculate station workload imbalance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workloads, availableTimes } = request;
  const compute = (): Output => {
    H.sameLength(workloads, availableTimes);
    H.domain(
      workloads.length > 0 &&
        workloads.every((x) => x >= 0) &&
        availableTimes.every((x) => x > 0),
    );
    return (() => {
      const utilizations = workloads.map((x, i) => x / availableTimes[i]),
        maximumUtilization = Math.max(...utilizations),
        minimumUtilization = Math.min(...utilizations);
      return {
        utilizations,
        maximumUtilization,
        minimumUtilization,
        imbalance: maximumUtilization - minimumUtilization,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workloads: [5, 8], availableTimes: [10, 10] },
  output: {
    utilizations: [0.5, 0.8],
    maximumUtilization: 0.8,
    minimumUtilization: 0.5,
    imbalance: 0.30000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const stationWorkloadImbalanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/station-workload-imbalance-gap",
    title: "Station Workload Imbalance Gap Tool",
    description:
      "Calculate station workload imbalance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workloads: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        availableTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["workloads", "availableTimes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utilizations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        maximumUtilization: { type: "number" },
        minimumUtilization: { type: "number" },
        imbalance: { type: "number" },
      },
      required: [
        "utilizations",
        "maximumUtilization",
        "minimumUtilization",
        "imbalance",
      ],
    },
    ports: {
      inputs: [
        {
          id: "workloads",
          label: "Workloads",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "availableTimes",
          label: "Available Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "utilizations",
          label: "Utilizations",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumUtilization",
          label: "Maximum Utilization",
          valueType: { type: "number" },
        },
        {
          id: "minimumUtilization",
          label: "Minimum Utilization",
          valueType: { type: "number" },
        },
        { id: "imbalance", label: "Imbalance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stationWorkloadImbalanceGapTool.execute;
export default stationWorkloadImbalanceGapTool;
