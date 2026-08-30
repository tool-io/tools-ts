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
  integer,
  primes,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly oddInteger: number }>;
export type Output = Readonly<{
  readonly weakGoldbachRepresentationFound: boolean;
  readonly primeTripleWitness: readonly number[];
}>;
const inputFields = [
  { id: "oddInteger", label: "Odd integer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.oddInteger, "oddInteger", 7, 100000);
  if (n % 2 === 0)
    simpleError("oddInteger", "Odd integer greater than five required.");
  const ps = primes(n),
    set = new Set(ps);
  let work = 0;
  for (const a of ps) {
    if (a > n / 3) break;
    for (const b of ps) {
      if (b < a) continue;
      if (b > (n - a) / 2) break;
      if (++work > 1000000)
        simpleError("search", "At most one million pair comparisons required.");
      const c = n - a - b;
      if (set.has(c))
        return {
          weakGoldbachRepresentationFound: true,
          primeTripleWitness: [a, b, c],
        };
    }
  }
  return { weakGoldbachRepresentationFound: false, primeTripleWitness: [] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { oddInteger: 9 } satisfies Input;
export const exampleOutput = {
  weakGoldbachRepresentationFound: true,
  primeTripleWitness: [2, 2, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/goldbach-weak-conjecture",
  title: "Weak Goldbach Conjecture Checker",
  description:
    "Find first nondecreasing prime triple summing to caller odd n>5 using actual sieve and bounded pair search; witnesses may repeat primes, distinct from existing strong two-prime Goldbach partition count.",
  inputs: inputFields,
  outputs: [
    {
      id: "weakGoldbachRepresentationFound",
      label: "Weak goldbach representation found",
      kind: "boolean",
    },
    {
      id: "primeTripleWitness",
      label: "Prime triple witness",
      kind: "numberList",
    },
  ],
  calculate: (value) => calculate({ oddInteger: value.oddInteger as number }),
});
export const run = tool.execute;
export default tool;
