import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  properDivisors,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly candidateInteger: number }>;
export type Output = Readonly<{
  readonly properDivisorSum: number;
  readonly isAbundant: boolean;
  readonly isSemiperfect: boolean;
  readonly isWeird: boolean;
}>;
const inputFields = [
  { id: "candidateInteger", label: "Candidate integer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.candidateInteger, "candidateInteger", 1, 20000),
    divisors = properDivisors(n),
    total = divisors.reduce((a, b) => a + b, 0);
  if (divisors.length * n > 1000000)
    simpleError(
      "candidate",
      "Subset sum requires at most one million updates.",
    );
  const reachable = new Uint8Array(n + 1);
  reachable[0] = 1;
  for (const d of divisors)
    for (let s = n; s >= d; s--) if (reachable[s - d]) reachable[s] = 1;
  const semi = !!reachable[n];
  return {
    properDivisorSum: total,
    isAbundant: total > n,
    isSemiperfect: semi,
    isWeird: total > n && !semi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { candidateInteger: 70 } satisfies Input;
export const exampleOutput = {
  properDivisorSum: 74,
  isAbundant: true,
  isSemiperfect: false,
  isWeird: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/weird-number-checker",
  title: "Weird Number Checker",
  description:
    "Check exact weirdness as abundance with no subset of distinct proper divisors summing to n; bounded 0/1 knapsack, not abundance alone or an exhaustive integer classification beyond caller n.",
  inputs: inputFields,
  outputs: [
    { id: "properDivisorSum", label: "Proper divisor sum", kind: "number" },
    { id: "isAbundant", label: "Is abundant", kind: "boolean" },
    { id: "isSemiperfect", label: "Is semiperfect", kind: "boolean" },
    { id: "isWeird", label: "Is weird", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ candidateInteger: value.candidateInteger as number }),
});
export const run = tool.execute;
export default tool;
