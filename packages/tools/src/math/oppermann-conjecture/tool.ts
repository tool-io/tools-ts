import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, primes } from "../batch-shared.js";
export type Input = Readonly<{ readonly integerN: number }>;
export type Output = Readonly<{
  readonly primesStrictlyBetweenNSquaredAndNNextN: readonly number[];
  readonly primesStrictlyBetweenNNextNAndNextNSquared: readonly number[];
  readonly bothObservedOppermannIntervalsNonempty: boolean;
}>;
const inputFields = [
  { id: "integerN", label: "Integer n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.integerN, "n", 2, 999),
    ps = primes((n + 1) ** 2),
    split = n * (n + 1),
    a = ps.filter((p) => p > n * n && p < split),
    b = ps.filter((p) => p > split && p < (n + 1) ** 2);
  return {
    primesStrictlyBetweenNSquaredAndNNextN: a,
    primesStrictlyBetweenNNextNAndNextNSquared: b,
    bothObservedOppermannIntervalsNonempty: !!a.length && !!b.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { integerN: 3 } satisfies Input;
export const exampleOutput = {
  primesStrictlyBetweenNSquaredAndNNextN: [11],
  primesStrictlyBetweenNNextNAndNextNSquared: [13],
  bothObservedOppermannIntervalsNonempty: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/oppermann-conjecture",
  title: "Oppermann Conjecture Checker",
  description:
    "Enumerate exact primes in both open Oppermann intervals (n²,n(n+1)) and (n(n+1),(n+1)²) for supplied n≥2; local observation, not a global proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "primesStrictlyBetweenNSquaredAndNNextN",
      label: "Primes strictly between n squared and n next n",
      kind: "numberList",
    },
    {
      id: "primesStrictlyBetweenNNextNAndNextNSquared",
      label: "Primes strictly between n next n and next n squared",
      kind: "numberList",
    },
    {
      id: "bothObservedOppermannIntervalsNonempty",
      label: "Both observed oppermann intervals nonempty",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ integerN: value.integerN as number }),
});
export const run = tool.execute;
export default tool;
