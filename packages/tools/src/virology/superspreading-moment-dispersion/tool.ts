import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly meanSecondaryCases: number;
  readonly varianceSecondaryCases: number;
}>;
export type Output = Readonly<{
  readonly dispersionK: number;
  readonly varianceMeanRatio: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.meanSecondaryCases, "meanSecondaryCases");
  if (input.varianceSecondaryCases <= input.meanSecondaryCases)
    simpleError(
      "varianceSecondaryCases",
      "Negative-binomial moment estimate requires variance greater than the positive mean.",
    );
  return {
    dispersionK:
      input.meanSecondaryCases ** 2 /
      (input.varianceSecondaryCases - input.meanSecondaryCases),
    varianceMeanRatio: input.varianceSecondaryCases / input.meanSecondaryCases,
  };
};
export const exampleInput = {
  meanSecondaryCases: 2,
  varianceSecondaryCases: 6,
} satisfies Input;
export const exampleOutput = {
  dispersionK: 1,
  varianceMeanRatio: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/superspreading-moment-dispersion",
  title: "Superspreading Moment Dispersion",
  description:
    "Estimate negative-binomial offspring dispersion k by moments; underdispersed or Poisson data do not have a finite positive k.",
  inputs: [
    { id: "meanSecondaryCases", label: "Mean secondary cases", kind: "number" },
    {
      id: "varianceSecondaryCases",
      label: "Variance secondary cases",
      kind: "number",
    },
  ],
  outputs: [
    { id: "dispersionK", label: "Dispersion k", kind: "number" },
    { id: "varianceMeanRatio", label: "Variance mean ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      meanSecondaryCases: value.meanSecondaryCases as number,
      varianceSecondaryCases: value.varianceSecondaryCases as number,
    }),
});
export const run = tool.execute;
export default tool;
