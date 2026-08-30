import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly affectedObservableSkeletonCount: number;
  readonly unaffectedObservableSkeletonCount: number;
  readonly unassessableSkeletonCount: number;
  readonly normalQuantileForInterval: number;
}>;
export type Output = Readonly<{
  readonly observablePrevalence: number;
  readonly unassessableFraction: number;
  readonly wilsonInterval: readonly number[];
}>;
const inputFields = [
  {
    id: "affectedObservableSkeletonCount",
    label: "Affected observable skeleton count",
    kind: "integer",
  },
  {
    id: "unaffectedObservableSkeletonCount",
    label: "Unaffected observable skeleton count",
    kind: "integer",
  },
  {
    id: "unassessableSkeletonCount",
    label: "Unassessable skeleton count",
    kind: "integer",
  },
  {
    id: "normalQuantileForInterval",
    label: "Normal quantile for interval",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.normalQuantileForInterval, "normalQuantileForInterval");
  count(
    input.affectedObservableSkeletonCount,
    "affectedObservableSkeletonCount",
  );
  count(
    input.unaffectedObservableSkeletonCount,
    "unaffectedObservableSkeletonCount",
  );
  count(input.unassessableSkeletonCount, "unassessableSkeletonCount");
  const n = positive(
      input.affectedObservableSkeletonCount +
        input.unaffectedObservableSkeletonCount,
      "observableSkeletons",
    ),
    p = input.affectedObservableSkeletonCount / n,
    z = input.normalQuantileForInterval,
    den = 1 + (z * z) / n,
    center = (p + (z * z) / (2 * n)) / den,
    h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
  return {
    observablePrevalence: p,
    unassessableFraction:
      input.unassessableSkeletonCount / (n + input.unassessableSkeletonCount),
    wilsonInterval: [Math.max(0, center - h), Math.min(1, center + h)],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  affectedObservableSkeletonCount: 10,
  unaffectedObservableSkeletonCount: 30,
  unassessableSkeletonCount: 10,
  normalQuantileForInterval: 2,
} satisfies Input;
export const exampleOutput = {
  observablePrevalence: 0.25,
  unassessableFraction: 0.2,
  wilsonInterval: [0.14020563875351588, 0.40524890670102953],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/pathology-prevalence-per-skeleton",
  title: "Pathology Prevalence Per Skeleton",
  description:
    "Summarize caller-observed skeletal pathology prevalence and Wilson binomial interval on assessable skeletons, retaining unassessable coverage; not living-population disease prevalence or clinical diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "observablePrevalence",
      label: "Observable prevalence",
      kind: "number",
    },
    {
      id: "unassessableFraction",
      label: "Unassessable fraction",
      kind: "number",
    },
    { id: "wilsonInterval", label: "Wilson interval", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      affectedObservableSkeletonCount:
        value.affectedObservableSkeletonCount as number,
      unaffectedObservableSkeletonCount:
        value.unaffectedObservableSkeletonCount as number,
      unassessableSkeletonCount: value.unassessableSkeletonCount as number,
      normalQuantileForInterval: value.normalQuantileForInterval as number,
    }),
});
export const run = tool.execute;
export default tool;
