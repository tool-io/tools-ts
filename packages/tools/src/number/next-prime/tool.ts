import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NextPrimeInput = { readonly n: number };
export type NextPrimeOutput = { readonly nextPrime: number };

export const nextPrimeExample = {
  input: { n: 20 },
  output: { nextPrime: 23 },
} satisfies ToolExample<NextPrimeInput, NextPrimeOutput>;

const isPrime = (value: number): boolean => {
  if (value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2)
    if (value % divisor === 0) return false;
  return true;
};

export const calculateNextPrime = (input: NextPrimeInput): NextPrimeOutput => {
  if (input.n < 1) simpleError("n", "Provide an integer of at least one.");
  let candidate = input.n + 1;
  while (!isPrime(candidate)) candidate += 1;
  return { nextPrime: candidate };
};

export const nextPrimeTool = createSimpleTool({
  calculate: (input) => calculateNextPrime(input as unknown as NextPrimeInput),
  description: "Smallest prime strictly greater than the given integer.",
  id: "number/next-prime",
  inputs: [
    {
      description: "Search starts above this value.",
      id: "n",
      kind: "integer",
      label: "n",
    },
  ],
  outputs: [
    {
      description: "Next prime.",
      id: "nextPrime",
      kind: "integer",
      label: "p",
    },
  ],
  title: "Next Prime Calculator",
});
export const runNextPrime = nextPrimeTool.execute;
export { nextPrimeExample as example };
export default nextPrimeTool;
