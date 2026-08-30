import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, boundedPairs } from "../shared.js";

export type Input = Readonly<{
  readonly orderedTimeSeriesValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly mannKendallS: number;
  readonly tieCorrectedNullVariance: number;
  readonly continuityCorrectedZ: number;
  readonly kendallTauA: number;
}>;
const inputFields = [
  {
    id: "orderedTimeSeriesValues",
    label: "Ordered time series values",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  boundedPairs(input.orderedTimeSeriesValues.length);
  const x = input.orderedTimeSeriesValues,
    n = x.length;
  let s = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) s += Math.sign(x[j] - x[i]);
  const counts = new Map<number, number>();
  x.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const ties = [...counts.values()].reduce(
      (sum, t) => sum + t * (t - 1) * (2 * t + 5),
      0,
    ),
    v = (n * (n - 1) * (2 * n + 5) - ties) / 18;
  return {
    mannKendallS: s,
    tieCorrectedNullVariance: v,
    continuityCorrectedZ: v === 0 ? 0 : (s - Math.sign(s)) / Math.sqrt(v),
    kendallTauA: s / ((n * (n - 1)) / 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedTimeSeriesValues: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  mannKendallS: 3,
  tieCorrectedNullVariance: 3.6666666666666665,
  continuityCorrectedZ: 1.044465935734187,
  kendallTauA: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/mann-kendall-trend",
  title: "Mann-Kendall Monotonic Trend Test",
  description:
    "Compute ordered Mann–Kendall S, tie-corrected independent-observation null variance and continuity-corrected z; no serial-correlation adjustment or significance claim, at most one million pairs.",
  inputs: inputFields,
  outputs: [
    { id: "mannKendallS", label: "Mann kendall s", kind: "number" },
    {
      id: "tieCorrectedNullVariance",
      label: "Tie corrected null variance",
      kind: "number",
    },
    {
      id: "continuityCorrectedZ",
      label: "Continuity corrected z",
      kind: "number",
    },
    { id: "kendallTauA", label: "Kendall tau a", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      orderedTimeSeriesValues:
        value.orderedTimeSeriesValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
