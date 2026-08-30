import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  mean,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly setSizes: readonly number[];
  readonly reactionTimesMs: readonly number[];
  readonly correctFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly uniqueSetSizes: readonly number[];
  readonly meanCorrectReactionTimesMs: readonly number[];
  readonly slopeMsPerItem: number;
  readonly interceptMs: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "setSizes", label: "Set sizes", kind: "numberList" },
  { id: "reactionTimesMs", label: "Reaction times ms", kind: "numberList" },
  { id: "correctFlags", label: "Correct flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.setSizes, input.reactionTimesMs, "setSizes");
  aligned(input.setSizes, input.correctFlags, "setSizes");
  input.setSizes.forEach((v) => count(v, "setSizes", 1));
  input.reactionTimesMs.forEach((v) => positive(v, "reactionTimesMs"));
  input.correctFlags.forEach((v) => {
    if (v !== 0 && v !== 1)
      simpleError("correctFlags", "Binary correctness flags required.");
  });
  const uniqueSetSizes = [...new Set(input.setSizes)].sort((a, b) => a - b),
    meanCorrectReactionTimesMs = uniqueSetSizes.map((size) =>
      mean(
        input.reactionTimesMs.filter(
          (_, i) => input.setSizes[i] === size && input.correctFlags[i] === 1,
        ),
      ),
    ),
    fit = regression(uniqueSetSizes, meanCorrectReactionTimesMs);
  return {
    uniqueSetSizes,
    meanCorrectReactionTimesMs,
    slopeMsPerItem: fit.slope,
    interceptMs: fit.intercept,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  setSizes: [2, 2, 4, 4, 6, 6],
  reactionTimesMs: [200, 220, 300, 320, 400, 420],
  correctFlags: [1, 1, 1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  uniqueSetSizes: [2, 4, 6],
  meanCorrectReactionTimesMs: [210, 310, 410],
  slopeMsPerItem: 50,
  interceptMs: 110,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/correct-trial-visual-search-slope",
  title: "Visual Search Slope",
  description:
    "Aggregate correct-trial visual-search RTs by set size and fit equally weighted condition means; signed slopes are retained and no serial/parallel search diagnosis is asserted.",
  inputs: inputFields,
  outputs: [
    { id: "uniqueSetSizes", label: "Unique set sizes", kind: "numberList" },
    {
      id: "meanCorrectReactionTimesMs",
      label: "Mean correct reaction times ms",
      kind: "numberList",
    },
    { id: "slopeMsPerItem", label: "Slope ms per item", kind: "number" },
    { id: "interceptMs", label: "Intercept ms", kind: "number" },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      setSizes: value.setSizes as readonly number[],
      reactionTimesMs: value.reactionTimesMs as readonly number[],
      correctFlags: value.correctFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
