import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, primes } from "../batch-shared.js";
export type Input = Readonly<{ readonly integerN: number }>;
export type Output = Readonly<{
  readonly primesStrictlyBetweenNAndTwiceN: readonly number[];
  readonly observedBertrandIntervalNonempty: boolean;
}>;
const inputFields = [
  { id: "integerN", label: "Integer n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.integerN, "n", 2, 500000),
    ps = primes(2 * n).filter((p) => p > n && p < 2 * n);
  return {
    primesStrictlyBetweenNAndTwiceN: ps,
    observedBertrandIntervalNonempty: ps.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { integerN: 4 } satisfies Input;
export const exampleOutput = {
  primesStrictlyBetweenNAndTwiceN: [5, 7],
  observedBertrandIntervalNonempty: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/bertrand-postulate-checker",
  title: "Bertrand Postulate Checker",
  description:
    "Enumerate actual primes in open Bertrand interval (n,2n) for supplied n>1; a finite witness check of an established theorem, not an unproved-conjecture certificate or next-prime alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "primesStrictlyBetweenNAndTwiceN",
      label: "Primes strictly between n and twice n",
      kind: "numberList",
    },
    {
      id: "observedBertrandIntervalNonempty",
      label: "Observed bertrand interval nonempty",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ integerN: value.integerN as number }),
});
export const run = tool.execute;
export default tool;
