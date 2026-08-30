import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, mean, variance } from "../shared.js";
export type Input = Readonly<{
  readonly eggCountsPerMother: readonly number[];
  readonly callerLowFecundityCutoff: number;
}>;
export type Output = Readonly<{
  readonly meanEggsPerMother: number;
  readonly sampleStandardDeviation: number;
  readonly lowFecundityMotherCount: number;
}>;
const inputFields = [
  {
    id: "eggCountsPerMother",
    label: "Egg counts per mother",
    kind: "numberList",
  },
  {
    id: "callerLowFecundityCutoff",
    label: "Caller low fecundity cutoff",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.eggCountsPerMother.forEach((v) => count(v, "eggCountsPerMother"));
  count(input.callerLowFecundityCutoff, "callerLowFecundityCutoff");
  return {
    meanEggsPerMother: mean(input.eggCountsPerMother),
    sampleStandardDeviation: Math.sqrt(variance(input.eggCountsPerMother)),
    lowFecundityMotherCount: input.eggCountsPerMother.filter(
      (v) => v < input.callerLowFecundityCutoff,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eggCountsPerMother: [100, 200, 300],
  callerLowFecundityCutoff: 150,
} satisfies Input;
export const exampleOutput = {
  meanEggsPerMother: 200,
  sampleStandardDeviation: 100,
  lowFecundityMotherCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/eggs-per-moth-count-average",
  title: "Eggs Per Moth Count Average",
  description:
    "Summarize measured individual silkmoth egg counts including sample variability and caller low-fecundity count; unlike cohort egg-production forecasts, this audits observed mothers.",
  inputs: inputFields,
  outputs: [
    { id: "meanEggsPerMother", label: "Mean eggs per mother", kind: "number" },
    {
      id: "sampleStandardDeviation",
      label: "Sample standard deviation",
      kind: "number",
    },
    {
      id: "lowFecundityMotherCount",
      label: "Low fecundity mother count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eggCountsPerMother: value.eggCountsPerMother as readonly number[],
      callerLowFecundityCutoff: value.callerLowFecundityCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
