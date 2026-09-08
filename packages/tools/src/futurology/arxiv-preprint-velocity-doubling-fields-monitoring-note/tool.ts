import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  aligned,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerFieldIds: readonly string[];
  readonly previousWindowPreprintCounts: readonly number[];
  readonly currentWindowPreprintCounts: readonly number[];
  readonly matchedWindowDurationDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerFieldIds", label: "Caller field ids", kind: "stringList" },
  {
    id: "previousWindowPreprintCounts",
    label: "Previous window preprint counts",
    kind: "numberList",
  },
  {
    id: "currentWindowPreprintCounts",
    label: "Current window preprint counts",
    kind: "numberList",
  },
  {
    id: "matchedWindowDurationDays",
    label: "Matched window duration days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerFieldIds, "fields");
  aligned(input.callerFieldIds, input.previousWindowPreprintCounts, "previous");
  aligned(input.callerFieldIds, input.currentWindowPreprintCounts, "current");
  positive(input.matchedWindowDurationDays, "window");
  [
    input.previousWindowPreprintCounts,
    input.currentWindowPreprintCounts,
  ].forEach((v) => v.forEach((x) => bounded(x, "count", 0, 1000000000)));
  const r = input.previousWindowPreprintCounts.map((v, i) =>
    v ? input.currentWindowPreprintCounts[i] / v : 0,
  );
  return {
    observedGrowthMultipliers: r,
    multiplierKnownFlags: input.previousWindowPreprintCounts.map((v) =>
      v ? 1 : 0,
    ),
    conditionalDoublingDays: r.map((v) =>
      v > 1
        ? (input.matchedWindowDurationDays * Math.log(2)) / Math.log(v)
        : -1,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerFieldIds: ["a", "b"],
    previousWindowPreprintCounts: [10, 0],
    currentWindowPreprintCounts: [20, 3],
    matchedWindowDurationDays: 30,
  },
  output: {
    result: {
      observedGrowthMultipliers: [2, 0],
      multiplierKnownFlags: [1, 0],
      conditionalDoublingDays: [30, -1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/arxiv-preprint-velocity-doubling-fields-monitoring-note",
  title: "Arxiv Preprint Velocity Doubling Fields Monitoring Note",
  description:
    "Observed independently categorized arXivpreprint count changes across matched windows. Conditional constant-growth doubling,-1non-growth/undefined; no field quality, publication validity or inevitable technology acceleration inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
