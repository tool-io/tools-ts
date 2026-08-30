import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, primes } from "../batch-shared.js";
export type Input = Readonly<{ readonly integerN: number }>;
export type Output = Readonly<{
  readonly primesStrictlyBetweenConsecutiveSquares: readonly number[];
  readonly observedLegendreIntervalNonempty: boolean;
}>;
const inputFields = [
  { id: "integerN", label: "Integer n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.integerN, "n", 1, 999),
    ps = primes((n + 1) ** 2).filter((p) => p > n * n && p < (n + 1) ** 2);
  return {
    primesStrictlyBetweenConsecutiveSquares: ps,
    observedLegendreIntervalNonempty: ps.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { integerN: 3 } satisfies Input;
export const exampleOutput = {
  primesStrictlyBetweenConsecutiveSquares: [11, 13],
  observedLegendreIntervalNonempty: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/legendre-conjecture",
  title: "Legendre Conjecture Checker",
  description:
    "Enumerate actual primes in one open consecutive-square interval (n²,(n+1)²); coarser distinct interval operation from Oppermann split, not a global Legendre conjecture proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "primesStrictlyBetweenConsecutiveSquares",
      label: "Primes strictly between consecutive squares",
      kind: "numberList",
    },
    {
      id: "observedLegendreIntervalNonempty",
      label: "Observed legendre interval nonempty",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ integerN: value.integerN as number }),
});
export const run = tool.execute;
export default tool;
