import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, jumps } from "../batch-shared.js";
export type Input = Readonly<{ readonly primeCutoff: number }>;
export type Output = Readonly<{
  readonly checkedAdjacentPrimePairCount: number;
  readonly exactFiroozbakhtViolationLeftPrimes: readonly number[];
  readonly allObservedPairsSatisfyInequality: boolean;
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.primeCutoff, "primeCutoff", 2, 2000);
  const { ps } = jumps(input.primeCutoff),
    bad: number[] = [];
  for (let i = 0; i < ps.length - 1; i++) {
    const n = BigInt(i + 1);
    if (BigInt(ps[i + 1]) ** n >= BigInt(ps[i]) ** (n + 1n)) bad.push(ps[i]);
  }
  return {
    checkedAdjacentPrimePairCount: ps.length - 1,
    exactFiroozbakhtViolationLeftPrimes: bad,
    allObservedPairsSatisfyInequality: bad.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primeCutoff: 13 } satisfies Input;
export const exampleOutput = {
  checkedAdjacentPrimePairCount: 5,
  exactFiroozbakhtViolationLeftPrimes: [],
  allObservedPairsSatisfyInequality: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/firoozbakht-conjecture",
  title: "Firoozbakht Conjecture Checker",
  description:
    "Exactly check finite Firoozbakht p_(n+1)^n < p_n^(n+1) using BigInt and true prime indices from complete sieve; observed satisfaction is not global conjecture proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "checkedAdjacentPrimePairCount",
      label: "Checked adjacent prime pair count",
      kind: "number",
    },
    {
      id: "exactFiroozbakhtViolationLeftPrimes",
      label: "Exact firoozbakht violation left primes",
      kind: "numberList",
    },
    {
      id: "allObservedPairsSatisfyInequality",
      label: "All observed pairs satisfy inequality",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ primeCutoff: value.primeCutoff as number }),
});
export const run = tool.execute;
export default tool;
