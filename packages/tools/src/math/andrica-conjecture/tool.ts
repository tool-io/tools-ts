import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, jumps } from "../batch-shared.js";
export type Input = Readonly<{ readonly primeCutoff: number }>;
export type Output = Readonly<{
  readonly observedSquareRootPrimeGaps: readonly number[];
  readonly andricaViolationLeftPrimes: readonly number[];
  readonly allObservedPairsSatisfyInequality: boolean;
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const { ps, gaps } = jumps(input.primeCutoff),
    r = gaps.map((g, i) => g / (Math.sqrt(ps[i + 1]) + Math.sqrt(ps[i]))),
    bad = r.flatMap((v, i) => (v >= 1 ? [ps[i]] : []));
  return {
    observedSquareRootPrimeGaps: r,
    andricaViolationLeftPrimes: bad,
    allObservedPairsSatisfyInequality: bad.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primeCutoff: 7 } satisfies Input;
export const exampleOutput = {
  observedSquareRootPrimeGaps: [
    0.31783724519578205, 0.5040171699309126, 0.4096833335648009,
  ],
  andricaViolationLeftPrimes: [],
  allObservedPairsSatisfyInequality: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/andrica-conjecture",
  title: "Andrica Conjecture Checker",
  description:
    "Check finite Andrica √p_next−√p<1 using stable gap/(√p_next+√p); actual prime sieve, no inference about all future pairs.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSquareRootPrimeGaps",
      label: "Observed square root prime gaps",
      kind: "numberList",
    },
    {
      id: "andricaViolationLeftPrimes",
      label: "Andrica violation left primes",
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
