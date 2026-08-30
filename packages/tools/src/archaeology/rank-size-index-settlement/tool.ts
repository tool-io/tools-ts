import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, regression } from "../shared.js";
export type Input = Readonly<{ readonly settlementSizes: readonly number[] }>;
export type Output = Readonly<{
  readonly sizeRanks: readonly number[];
  readonly logSizeLogRankSlope: number;
  readonly logFitRSquared: number;
  readonly observedLargestToSecondRatio: number;
}>;
const inputFields = [
  { id: "settlementSizes", label: "Settlement sizes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.settlementSizes.forEach((v) => positive(v, "settlementSizes"));
  if (input.settlementSizes.length < 2)
    simpleError(
      "settlementSizes",
      "At least two comparable settlement sizes required.",
    );
  const sorted = [...input.settlementSizes].sort((a, b) => b - a),
    sizeRanks = sorted.map((_, i) => i + 1),
    fit = regression(sizeRanks.map(Math.log), sorted.map(Math.log));
  return {
    sizeRanks,
    logSizeLogRankSlope: fit.slope,
    logFitRSquared: fit.rSquared,
    observedLargestToSecondRatio: sorted[0] / sorted[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { settlementSizes: [100, 50, 25] } satisfies Input;
export const exampleOutput = {
  sizeRanks: [1, 2, 3],
  logSizeLogRankSlope: -1.233661942252174,
  logFitRSquared: 0.9776539585182626,
  observedLargestToSecondRatio: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/rank-size-index-settlement",
  title: "Settlement Rank Size Index",
  description:
    "Fit log size versus log rank for supplied comparable settlement sizes and report primacy ratio; not a settlement hierarchy diagnosis or a mapped population estimator.",
  inputs: inputFields,
  outputs: [
    { id: "sizeRanks", label: "Size ranks", kind: "numberList" },
    {
      id: "logSizeLogRankSlope",
      label: "Log size log rank slope",
      kind: "number",
    },
    { id: "logFitRSquared", label: "Log fit r squared", kind: "number" },
    {
      id: "observedLargestToSecondRatio",
      label: "Observed largest to second ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ settlementSizes: value.settlementSizes as readonly number[] }),
});
export const run = tool.execute;
export default tool;
