import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MobiusInput = { readonly n: number };
export type MobiusOutput = { readonly mobiusValue: number };

export const mobiusExample = {
  input: { n: 30 },
  output: { mobiusValue: -1 },
} satisfies ToolExample<MobiusInput, MobiusOutput>;

export const calculateMobius = (input: MobiusInput): MobiusOutput => {
  let remaining = input.n;
  if (remaining < 1) simpleError("n", "n must be a positive integer.");
  let distinctPrimeFactors = 0;
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    if (remaining % prime !== 0) continue;
    remaining /= prime;
    if (remaining % prime === 0) return { mobiusValue: 0 };
    distinctPrimeFactors += 1;
  }
  if (remaining > 1) distinctPrimeFactors += 1;
  return { mobiusValue: distinctPrimeFactors % 2 === 0 ? 1 : -1 };
};

export const mobiusTool = createSimpleTool({
  calculate: (input) => calculateMobius(input as unknown as MobiusInput),
  description:
    "Möbius μ(n): 0 when divisible by a square, (−1)^k with k distinct primes, μ(1)=1.",
  id: "number/mobius",
  inputs: [
    {
      minimum: 1,
      description: "Positive integer.",
      id: "n",
      kind: "integer",
      label: "n",
    },
  ],
  outputs: [
    {
      description: "−1, 0, or 1.",
      id: "mobiusValue",
      kind: "integer",
      label: "μ(n)",
    },
  ],
  title: "Möbius Function Calculator",
});
export const runMobius = mobiusTool.execute;
export { mobiusExample as example };
export default mobiusTool;
