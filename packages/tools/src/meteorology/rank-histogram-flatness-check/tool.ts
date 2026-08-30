import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, mean } from "../shared.js";

export type Input = Readonly<{
  readonly observedRankBinCounts: readonly number[];
  readonly ensembleMemberCount: number;
}>;
export type Output = Readonly<{
  readonly pearsonUniformRankStatistic: number;
  readonly uniformRankDegreesOfFreedom: number;
  readonly meanRankBinCount: number;
  readonly relativeEndBinExcess: number;
}>;
const inputFields = [
  {
    id: "observedRankBinCounts",
    label: "Observed rank bin counts",
    kind: "numberList",
  },
  {
    id: "ensembleMemberCount",
    label: "Ensemble member count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRankBinCounts.forEach((v) => count(v, "observedRankBinCounts"));
  count(input.ensembleMemberCount, "ensembleMemberCount");
  if (
    input.ensembleMemberCount < 1 ||
    input.observedRankBinCounts.length !== input.ensembleMemberCount + 1
  )
    simpleError(
      "bins",
      "M-member ensemble requires M+1 observation-rank bins.",
    );
  const meanRankBinCount = positive(
      mean(input.observedRankBinCounts),
      "rankMean",
    ),
    pearsonUniformRankStatistic = input.observedRankBinCounts.reduce(
      (s, v) => s + (v - meanRankBinCount) ** 2 / meanRankBinCount,
      0,
    );
  return {
    pearsonUniformRankStatistic,
    uniformRankDegreesOfFreedom: input.ensembleMemberCount,
    meanRankBinCount,
    relativeEndBinExcess:
      (input.observedRankBinCounts[0] + input.observedRankBinCounts.at(-1)!) /
        (2 * meanRankBinCount) -
      1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRankBinCounts: [10, 10, 10, 10],
  ensembleMemberCount: 3,
} satisfies Input;
export const exampleOutput = {
  pearsonUniformRankStatistic: 0,
  uniformRankDegreesOfFreedom: 3,
  meanRankBinCount: 10,
  relativeEndBinExcess: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/rank-histogram-flatness-check",
  title: "Rank Histogram Flatness Check Tool",
  description:
    "Audit supplied rank histogram versus uniform bins using descriptive Pearson statistic/end-bin excess; tie randomization and independent cases are caller responsibilities, no automatic significance or calibrated ensemble claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "pearsonUniformRankStatistic",
      label: "Pearson uniform rank statistic",
      kind: "number",
    },
    {
      id: "uniformRankDegreesOfFreedom",
      label: "Uniform rank degrees of freedom",
      kind: "number",
    },
    { id: "meanRankBinCount", label: "Mean rank bin count", kind: "number" },
    {
      id: "relativeEndBinExcess",
      label: "Relative end bin excess",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRankBinCounts: value.observedRankBinCounts as readonly number[],
      ensembleMemberCount: value.ensembleMemberCount as number,
    }),
});
export const run = tool.execute;
export default tool;
