import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{ readonly candidateInteger: number }>;
export type Output = Readonly<{
  readonly vampireFangPairs: readonly (readonly number[])[];
  readonly isVampireNumber: boolean;
}>;
const inputFields = [
  { id: "candidateInteger", label: "Candidate integer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.candidateInteger, "candidate", 1, 999999),
    s = String(n);
  if (s.length % 2) return { vampireFangPairs: [], isVampireNumber: false };
  const digits = s.length / 2,
    lo = 10 ** (digits - 1),
    hi = 10 ** digits - 1,
    pairs: number[][] = [],
    key = [...s].sort().join("");
  for (let a = lo; a <= Math.min(hi, Math.floor(Math.sqrt(n))); a++)
    if (n % a === 0) {
      const b = n / a;
      if (b < lo || b > hi || (a % 10 === 0 && b % 10 === 0)) continue;
      if ([...(String(a) + String(b))].sort().join("") === key)
        pairs.push([a, b]);
    }
  return { vampireFangPairs: pairs, isVampireNumber: pairs.length > 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { candidateInteger: 1260 } satisfies Input;
export const exampleOutput = {
  vampireFangPairs: [[21, 60]],
  isVampireNumber: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/vampire-number-checker",
  title: "Vampire Number Checker",
  description:
    "Find all unordered equal-digit factor fangs whose combined decimal multiset matches candidate; both trailing-zero fangs excluded, 1–6 digit bounded search and odd lengths false.",
  inputs: inputFields,
  outputs: [
    { id: "vampireFangPairs", label: "Vampire fang pairs", kind: "matrix" },
    { id: "isVampireNumber", label: "Is vampire number", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ candidateInteger: value.candidateInteger as number }),
});
export const run = tool.execute;
export default tool;
