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
  primes,
  prime,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly lowerAdjacentPrime: number;
  readonly upperAdjacentPrime: number;
}>;
export type Output = Readonly<{
  readonly actualAdjacentPrimePair: boolean;
  readonly primesStrictlyBetweenPrimeSquares: readonly number[];
  readonly atLeastFourObservedPrimes: boolean;
}>;
const inputFields = [
  { id: "lowerAdjacentPrime", label: "Lower adjacent prime", kind: "number" },
  { id: "upperAdjacentPrime", label: "Upper adjacent prime", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = bounded(input.lowerAdjacentPrime, "lower", 3, 997),
    q = bounded(input.upperAdjacentPrime, "upper", 5, 997);
  if (p >= q || !prime(p) || !prime(q))
    simpleError("primes", "Increasing actual prime candidates required.");
  const ps = primes(q * q),
    adjacent = !ps.some((v) => v > p && v < q);
  if (!adjacent)
    simpleError("primes", "Supplied prime endpoints must be adjacent.");
  const inside = ps.filter((v) => v > p * p && v < q * q);
  return {
    actualAdjacentPrimePair: true,
    primesStrictlyBetweenPrimeSquares: inside,
    atLeastFourObservedPrimes: inside.length >= 4,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lowerAdjacentPrime: 3,
  upperAdjacentPrime: 5,
} satisfies Input;
export const exampleOutput = {
  actualAdjacentPrimePair: true,
  primesStrictlyBetweenPrimeSquares: [11, 13, 17, 19, 23],
  atLeastFourObservedPrimes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/brocard-conjecture",
  title: "Brocard Conjecture Checker",
  description:
    "Check local Brocard interval between squares of supplied adjacent primes p≥3, retaining actual prime inventory; nonadjacent endpoints refused, no global conjecture proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "actualAdjacentPrimePair",
      label: "Actual adjacent prime pair",
      kind: "boolean",
    },
    {
      id: "primesStrictlyBetweenPrimeSquares",
      label: "Primes strictly between prime squares",
      kind: "numberList",
    },
    {
      id: "atLeastFourObservedPrimes",
      label: "At least four observed primes",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      lowerAdjacentPrime: value.lowerAdjacentPrime as number,
      upperAdjacentPrime: value.upperAdjacentPrime as number,
    }),
});
export const run = tool.execute;
export default tool;
