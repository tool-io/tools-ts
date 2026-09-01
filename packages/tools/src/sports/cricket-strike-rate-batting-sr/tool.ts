import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBatterRuns: readonly number[];
  readonly observedLegalBallsFaced: readonly number[];
}>;
export type Output = Readonly<{ readonly pooledBattingStrikeRate: number }>;
const inputFields = [
  {
    id: "observedBatterRuns",
    label: "Observed batter runs",
    kind: "numberList",
  },
  {
    id: "observedLegalBallsFaced",
    label: "Observed legal balls faced",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observedBatterRuns, input.observedLegalBallsFaced, "innings");
  input.observedBatterRuns.forEach((v) => bounded(v, "runs", 0, 1000000));
  input.observedLegalBallsFaced.forEach((v) => bounded(v, "balls", 1, 1000000));
  return {
    pooledBattingStrikeRate:
      (100 * sum(input.observedBatterRuns)) /
      sum(input.observedLegalBallsFaced),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBatterRuns: [30, 70],
  observedLegalBallsFaced: [20, 50],
} satisfies Input;
export const exampleOutput = {
  pooledBattingStrikeRate: 142.85714285714286,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/cricket-strike-rate-batting-sr",
  title: "Batting Strike Rate Calculator",
  description:
    "Compute actual cricket batter runs per hundred faced legal balls; no innings-average rate or team extras assignment.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledBattingStrikeRate",
      label: "Pooled batting strike rate",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBatterRuns: value.observedBatterRuns as readonly number[],
      observedLegalBallsFaced:
        value.observedLegalBallsFaced as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
