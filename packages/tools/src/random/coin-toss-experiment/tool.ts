import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  bounded,
  fraction,
  sum,
  mean,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly successProbability: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "successProbability", label: "Success probability", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  bounded(input.count, "trials", 1, 64);
  fraction(input.successProbability, "probability");
  const outcomes = Array.from({ length: input.count }, () =>
    random() < input.successProbability ? 1 : 0,
  );
  let run = 0,
    longest = 0;
  const streakEndIndices: number[] = [];
  outcomes.forEach((v, i) => {
    run = v ? run + 1 : 0;
    longest = Math.max(longest, run);
    if (v && (i === outcomes.length - 1 || !outcomes[i + 1]))
      streakEndIndices.push(i);
  });
  return {
    result: {
      outcomes,
      successes: sum(outcomes),
      observedSuccessFraction: mean(outcomes),
      longestSuccessStreak: longest,
      successStreakEndIndices: streakEndIndices,
      samplingConvention: "independent-Bernoulli-with-replacement",
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, successProbability: 0.5 },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/coin-toss-experiment",
  title: "Random Coin-Toss Experiment Generator",
  description:
    "Simulate caller biased coin outcomes using explicit independent success probability; finite observed proportions and streaks do not establish fairness or population probability.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
