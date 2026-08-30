import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly deviceLatenciesMilliseconds: readonly number[];
  readonly networkHopCount: number;
  readonly latencyPerHopMilliseconds: number;
  readonly maximumLatencyMilliseconds: number;
}>;
export type Output = Readonly<{
  readonly deviceLatencyMilliseconds: number;
  readonly networkLatencyMilliseconds: number;
  readonly totalLatencyMilliseconds: number;
  readonly latencyMarginMilliseconds: number;
  readonly withinBudget: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.deviceLatenciesMilliseconds.some((value) => value < 0))
    simpleError(
      "deviceLatenciesMilliseconds",
      "Device latencies must be nonnegative.",
      "invalid_latencies",
    );
  const deviceLatencyMilliseconds = input.deviceLatenciesMilliseconds.reduce(
      (a, b) => a + b,
      0,
    ),
    networkLatencyMilliseconds =
      input.networkHopCount * input.latencyPerHopMilliseconds,
    totalLatencyMilliseconds =
      deviceLatencyMilliseconds + networkLatencyMilliseconds;
  return {
    deviceLatencyMilliseconds,
    networkLatencyMilliseconds,
    totalLatencyMilliseconds,
    latencyMarginMilliseconds:
      input.maximumLatencyMilliseconds - totalLatencyMilliseconds,
    withinBudget: totalLatencyMilliseconds <= input.maximumLatencyMilliseconds,
  };
};

export const exampleInput = {
  deviceLatenciesMilliseconds: [1, 2, 1],
  networkHopCount: 2,
  latencyPerHopMilliseconds: 0.5,
  maximumLatencyMilliseconds: 6,
} satisfies Input;
export const exampleOutput = {
  deviceLatencyMilliseconds: 4,
  networkLatencyMilliseconds: 1,
  totalLatencyMilliseconds: 5,
  latencyMarginMilliseconds: 1,
  withinBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      deviceLatenciesMilliseconds:
        input.deviceLatenciesMilliseconds as readonly number[],
      networkHopCount: input.networkHopCount as number,
      latencyPerHopMilliseconds: input.latencyPerHopMilliseconds as number,
      maximumLatencyMilliseconds: input.maximumLatencyMilliseconds as number,
    }),
  description: "Budget Dante audio latency across devices and network hops.",
  id: "theatre/dante-latency-budget",
  inputs: [
    {
      id: "deviceLatenciesMilliseconds",
      label: "Device latencies",
      kind: "numberList",
      unit: "ms",
    },
    {
      id: "networkHopCount",
      label: "Network hop count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "latencyPerHopMilliseconds",
      label: "Latency per hop",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "maximumLatencyMilliseconds",
      label: "Maximum end-to-end latency",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "deviceLatencyMilliseconds",
      label: "Total device latency",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "networkLatencyMilliseconds",
      label: "Network latency",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "totalLatencyMilliseconds",
      label: "Total latency",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "latencyMarginMilliseconds",
      label: "Latency margin",
      kind: "number",
      unit: "ms",
    },
    { id: "withinBudget", label: "Within supplied budget", kind: "boolean" },
  ],
  title: "Dante Latency Budget",
});

export const run = tool.execute;
export default tool;
