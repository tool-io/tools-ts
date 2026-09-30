import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counter: number;
  readonly compare: number;
  readonly modulus: number;
  readonly latencyTicks: number;
  readonly equalMeansNextCycle: boolean;
};
export type Output = {
  readonly ticksUntil: number;
  readonly margin: number;
  readonly reachableBeforeCompare: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counter: { type: "integer", minimum: 0 },
    compare: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 1 },
    latencyTicks: { type: "integer", minimum: 0 },
    equalMeansNextCycle: { type: "boolean" },
  },
  required: [
    "counter",
    "compare",
    "modulus",
    "latencyTicks",
    "equalMeansNextCycle",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticksUntil: { type: "integer" },
    margin: { type: "integer" },
    reachableBeforeCompare: { type: "boolean" },
  },
  required: ["ticksUntil", "margin", "reachableBeforeCompare"],
} as const;
/** Modular compare horizon and strict latency slack under an explicit equality policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counter, compare, modulus, latencyTicks, equalMeansNextCycle } =
    request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    H.integer(counter, 0, modulus - 1);
    H.integer(compare, 0, modulus - 1);
    H.integer(latencyTicks, 0);
    let ticksUntil = Number(
      (BigInt(compare) - BigInt(counter) + BigInt(modulus)) % BigInt(modulus),
    );
    if (ticksUntil === 0 && equalMeansNextCycle) ticksUntil = modulus;
    const margin = ticksUntil - latencyTicks;
    return { ticksUntil, margin, reachableBeforeCompare: margin > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counter: 250,
    compare: 5,
    modulus: 256,
    latencyTicks: 3,
    equalMeansNextCycle: false,
  },
  output: { ticksUntil: 11, margin: 8, reachableBeforeCompare: true },
} satisfies ToolExample<Input, Output>;
export const timerCompareWrapLatencyBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/timer-compare-wrap-latency-budget",
    title: "Timer Compare Wrap Latency Budget Tool",
    description:
      "Modular compare horizon and strict latency slack under an explicit equality policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counter: { type: "integer", minimum: 0 },
        compare: { type: "integer", minimum: 0 },
        modulus: { type: "integer", minimum: 1 },
        latencyTicks: { type: "integer", minimum: 0 },
        equalMeansNextCycle: { type: "boolean" },
      },
      required: [
        "counter",
        "compare",
        "modulus",
        "latencyTicks",
        "equalMeansNextCycle",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ticksUntil: { type: "integer" },
        margin: { type: "integer" },
        reachableBeforeCompare: { type: "boolean" },
      },
      required: ["ticksUntil", "margin", "reachableBeforeCompare"],
    },
    ports: {
      inputs: [
        {
          id: "counter",
          label: "Counter",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "compare",
          label: "Compare",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latencyTicks",
          label: "Latency Ticks",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "equalMeansNextCycle",
          label: "Equal Means Next Cycle",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "ticksUntil",
          label: "Ticks Until",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
        {
          id: "reachableBeforeCompare",
          label: "Reachable Before Compare",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = timerCompareWrapLatencyBudgetTool.execute;
export default timerCompareWrapLatencyBudgetTool;
