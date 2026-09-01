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
  unique,
  sum,
  shape,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly routeIds: readonly string[];
  readonly observedRouteDistributedLossesM: readonly (readonly number[])[];
  readonly observedRouteLocalLossesM: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly totalLossesByRouteM: readonly number[];
  readonly maximumObservedRouteLossM: number;
  readonly maximumLossRouteIds: readonly string[];
}>;
const inputFields = [
  { id: "routeIds", label: "Route ids", kind: "stringList" },
  {
    id: "observedRouteDistributedLossesM",
    label: "Observed route distributed losses m",
    kind: "matrix",
  },
  {
    id: "observedRouteLocalLossesM",
    label: "Observed route local losses m",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.routeIds, "routes");
  const width = shape(input.observedRouteDistributedLossesM, "losses");
  if (shape(input.observedRouteLocalLossesM, "losses") !== width)
    simpleError(
      "losses",
      "Aligned route×segment distributed/local loss evidence required.",
    );
  aligned(input.routeIds, input.observedRouteDistributedLossesM, "routes");
  aligned(input.routeIds, input.observedRouteLocalLossesM, "routes");
  [
    ...input.observedRouteDistributedLossesM,
    ...input.observedRouteLocalLossesM,
  ].forEach((r) => r.forEach((v) => nonnegative(v, "loss")));
  const totals = input.observedRouteDistributedLossesM.map((r, i) =>
      sum([...r, ...input.observedRouteLocalLossesM[i]]),
    ),
    max = Math.max(...totals);
  return {
    totalLossesByRouteM: totals,
    maximumObservedRouteLossM: max,
    maximumLossRouteIds: input.routeIds.filter((_, i) => totals[i] === max),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  routeIds: ["a", "b"],
  observedRouteDistributedLossesM: [
    [1, 2],
    [3, 4],
  ],
  observedRouteLocalLossesM: [
    [0.5, 1],
    [0, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  totalLossesByRouteM: [4.5, 8],
  maximumObservedRouteLossM: 8,
  maximumLossRouteIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/total-head-loss",
  title: "Plumbing Total Head Loss Calculator",
  description:
    "Reconcile independently measured multi-route distributed/local losses, preserving all tied controlling paths rather than summing parallel-route losses; not scalar total head or network solver.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalLossesByRouteM",
      label: "Total losses by route m",
      kind: "numberList",
    },
    {
      id: "maximumObservedRouteLossM",
      label: "Maximum observed route loss m",
      kind: "number",
    },
    {
      id: "maximumLossRouteIds",
      label: "Maximum loss route ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      routeIds: value.routeIds as readonly string[],
      observedRouteDistributedLossesM:
        value.observedRouteDistributedLossesM as readonly (readonly number[])[],
      observedRouteLocalLossesM:
        value.observedRouteLocalLossesM as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
