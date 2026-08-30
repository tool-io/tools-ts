import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly branchNames: readonly string[];
  readonly branchProbabilities: readonly number[];
  readonly independenceConfirmed: boolean;
}>;
export type Output = Readonly<{
  readonly jointProbability: number;
  readonly logProbability: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.branchNames, input.branchProbabilities, "branchNames");
  if (!input.independenceConfirmed)
    simpleError(
      "independenceConfirmed",
      "Independent branch assumption must be confirmed.",
    );
  input.branchProbabilities.forEach((v) => fraction(v, "branchProbabilities"));
  if (input.branchProbabilities.some((v) => v === 0))
    simpleError(
      "branchProbabilities",
      "Positive branch probabilities required for finite log output.",
    );
  const logProbability = input.branchProbabilities.reduce(
    (sum, v) => sum + Math.log(v),
    0,
  );
  return { jointProbability: Math.exp(logProbability), logProbability };
};
export const exampleInput = {
  branchNames: ["A", "B", "C"],
  branchProbabilities: [0.5, 0.25, 0.5],
  independenceConfirmed: true,
} satisfies Input;
export const exampleOutput = {
  jointProbability: 0.0625,
  logProbability: -2.772588722239781,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/forked-branch-probability",
  title: "Forked Branch Probability",
  description:
    "Combine explicitly independent genetic-cross branch probabilities with a finite log-probability output.",
  inputs: [
    { id: "branchNames", label: "Branch names", kind: "stringList" },
    {
      id: "branchProbabilities",
      label: "Branch probabilities",
      kind: "numberList",
    },
    {
      id: "independenceConfirmed",
      label: "Independence confirmed",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "jointProbability", label: "Joint probability", kind: "number" },
    { id: "logProbability", label: "Log probability", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      branchNames: value.branchNames as readonly string[],
      branchProbabilities: value.branchProbabilities as readonly number[],
      independenceConfirmed: value.independenceConfirmed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
