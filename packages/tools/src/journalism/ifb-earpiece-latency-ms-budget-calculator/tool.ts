import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  shape,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly stageLatenciesMs: readonly number[];
  readonly predecessorDependencyFlags: readonly (readonly number[])[];
  readonly callerMaximumEndToEndLatencyMs: number;
}>;
export type Output = Readonly<{
  readonly criticalArrivalLatenciesMs: readonly number[];
  readonly modeledCriticalPathLatencyMs: number;
  readonly withinCallerLatencyBudget: boolean;
}>;
const inputFields = [
  { id: "stageLatenciesMs", label: "Stage latencies ms", kind: "numberList" },
  {
    id: "predecessorDependencyFlags",
    label: "Predecessor dependency flags",
    kind: "matrix",
  },
  {
    id: "callerMaximumEndToEndLatencyMs",
    label: "Caller maximum end to end latency ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stageLatenciesMs.forEach((v) => nonnegative(v, "stageLatenciesMs"));
  nonnegative(
    input.callerMaximumEndToEndLatencyMs,
    "callerMaximumEndToEndLatencyMs",
  );
  const n = input.stageLatenciesMs.length;
  if (
    !n ||
    shape(input.predecessorDependencyFlags, "dependencies") !== n ||
    input.predecessorDependencyFlags.length !== n
  )
    simpleError(
      "graph",
      "Square stage dependency matrix aligned to latency evidence required.",
    );
  input.predecessorDependencyFlags.forEach((r) => binary(r, "dependencies"));
  const arrival = Array<number>(n).fill(0),
    done = Array<number>(n).fill(0);
  for (let step = 0; step < n; step++) {
    const i = done.findIndex(
      (v, i) =>
        !v &&
        input.predecessorDependencyFlags[i].every(
          (needed, j) => !needed || done[j] === 1,
        ),
    );
    if (i < 0)
      simpleError("graph", "Acyclic caller dependency graph required.");
    let previous = 0;
    input.predecessorDependencyFlags[i].forEach((needed, j) => {
      if (needed) previous = Math.max(previous, arrival[j]);
    });
    arrival[i] = previous + input.stageLatenciesMs[i];
    done[i] = 1;
  }
  const max = Math.max(...arrival);
  return {
    criticalArrivalLatenciesMs: arrival,
    modeledCriticalPathLatencyMs: max,
    withinCallerLatencyBudget: max <= input.callerMaximumEndToEndLatencyMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stageLatenciesMs: [10, 20, 30],
  predecessorDependencyFlags: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  callerMaximumEndToEndLatencyMs: 35,
} satisfies Input;
export const exampleOutput = {
  criticalArrivalLatenciesMs: [10, 30, 40],
  modeledCriticalPathLatencyMs: 40,
  withinCallerLatencyBudget: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/ifb-earpiece-latency-ms-budget-calculator",
  title: "IFB Earpiece Latency Ms Budget Calculator",
  description:
    "Compute IFB latency budget over explicit caller acyclic stage dependencies using max predecessor critical path, not incorrectly summing parallel stages; fixed latency model, no network jitter, clocks, measured equipment latency or hearing-safety assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "criticalArrivalLatenciesMs",
      label: "Critical arrival latencies ms",
      kind: "numberList",
    },
    {
      id: "modeledCriticalPathLatencyMs",
      label: "Modeled critical path latency ms",
      kind: "number",
    },
    {
      id: "withinCallerLatencyBudget",
      label: "Within caller latency budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stageLatenciesMs: value.stageLatenciesMs as readonly number[],
      predecessorDependencyFlags:
        value.predecessorDependencyFlags as readonly (readonly number[])[],
      callerMaximumEndToEndLatencyMs:
        value.callerMaximumEndToEndLatencyMs as number,
    }),
});
export const run = tool.execute;
export default tool;
