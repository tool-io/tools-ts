import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, prime } from "../batch-shared.js";
export type Input = Readonly<{ readonly candidatePrime: number }>;
export type Output = Readonly<{
  readonly isPrimeCandidate: boolean;
  readonly witnessFactorialIndices: readonly number[];
  readonly isPillaiPrime: boolean;
}>;
const inputFields = [
  { id: "candidatePrime", label: "Candidate prime", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = bounded(input.candidatePrime, "candidatePrime", 2, 10000),
    is = prime(p),
    witnesses: number[] = [];
  if (is) {
    let f = 1;
    for (let k = 1; k < p; k++) {
      f = (f * k) % p;
      if (f === p - 1 && (p - 1) % k !== 0) witnesses.push(k);
    }
  }
  return {
    isPrimeCandidate: is,
    witnessFactorialIndices: witnesses,
    isPillaiPrime: witnesses.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { candidatePrime: 23 } satisfies Input;
export const exampleOutput = {
  isPrimeCandidate: true,
  witnessFactorialIndices: [14, 18],
  isPillaiPrime: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/pillai-prime-checker-math",
  title: "Pillai Prime Checker",
  description:
    "Find exact Pillai prime witnesses k!≡−1 mod p with k not dividing p−1; exhaustive bounded k<p, no inferred classification from one arbitrary k.",
  inputs: inputFields,
  outputs: [
    { id: "isPrimeCandidate", label: "Is prime candidate", kind: "boolean" },
    {
      id: "witnessFactorialIndices",
      label: "Witness factorial indices",
      kind: "numberList",
    },
    { id: "isPillaiPrime", label: "Is pillai prime", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ candidatePrime: value.candidatePrime as number }),
});
export const run = tool.execute;
export default tool;
