import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly phaseTypeCounts: readonly (readonly number[])[];
  readonly phaseExcludedUnclassifiedCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly classifiedTypePercentages: readonly (readonly number[])[];
  readonly unclassifiedPercentOfAllByPhase: readonly number[];
}>;
const inputFields = [
  { id: "phaseTypeCounts", label: "Phase type counts", kind: "matrix" },
  {
    id: "phaseExcludedUnclassifiedCounts",
    label: "Phase excluded unclassified counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.phaseExcludedUnclassifiedCounts.forEach((v) =>
    count(v, "phaseExcludedUnclassifiedCounts"),
  );
  shape(input.phaseTypeCounts, "phaseTypeCounts");
  aligned(
    input.phaseTypeCounts,
    input.phaseExcludedUnclassifiedCounts,
    "phases",
  );
  const totals = input.phaseTypeCounts.map((row) => {
    row.forEach((v) => count(v, "phaseTypeCounts"));
    return positive(
      row.reduce((a, b) => a + b, 0),
      "phaseTotal",
    );
  });
  return {
    classifiedTypePercentages: input.phaseTypeCounts.map((row, i) =>
      row.map((v) => (100 * v) / totals[i]),
    ),
    unclassifiedPercentOfAllByPhase: totals.map(
      (t, i) =>
        (100 * input.phaseExcludedUnclassifiedCounts[i]) /
        (t + input.phaseExcludedUnclassifiedCounts[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phaseTypeCounts: [
    [1, 3],
    [2, 2],
  ],
  phaseExcludedUnclassifiedCounts: [1, 0],
} satisfies Input;
export const exampleOutput = {
  classifiedTypePercentages: [
    [25, 75],
    [50, 50],
  ],
  unclassifiedPercentOfAllByPhase: [20, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/type-frequency-percent-per-phase",
  title: "Type Frequency Percent Per Phase",
  description:
    "Normalize classified ceramic types within each phase and report excluded unclassified coverage on original denominators; not pooled across phases or a forced chronological classifier.",
  inputs: inputFields,
  outputs: [
    {
      id: "classifiedTypePercentages",
      label: "Classified type percentages",
      kind: "matrix",
    },
    {
      id: "unclassifiedPercentOfAllByPhase",
      label: "Unclassified percent of all by phase",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      phaseTypeCounts: value.phaseTypeCounts as readonly (readonly number[])[],
      phaseExcludedUnclassifiedCounts:
        value.phaseExcludedUnclassifiedCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
