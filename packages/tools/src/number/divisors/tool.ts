import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DivisorsInput = { readonly n: number };
export type DivisorsOutput = {
  readonly count: number;
  readonly divisors: readonly number[];
};

export const divisorsExample = {
  input: { n: 36 },
  output: { divisors: [1, 2, 3, 4, 6, 9, 12, 18, 36], count: 9 },
} satisfies ToolExample<DivisorsInput, DivisorsOutput>;

export const calculateDivisors = (input: DivisorsInput): DivisorsOutput => {
  const n = input.n;
  if (n < 1) simpleError("n", "n must be a positive integer.");
  const small: number[] = [];
  const large: number[] = [];
  for (let divisor = 1; divisor * divisor <= n; divisor += 1) {
    if (n % divisor !== 0) continue;
    small.push(divisor);
    if (divisor !== n / divisor) large.push(n / divisor);
  }
  return {
    count: small.length + large.length,
    divisors: [...small, ...large.reverse()],
  };
};

export const divisorsTool = createSimpleTool({
  calculate: (input) => calculateDivisors(input as unknown as DivisorsInput),
  description: "All positive divisors of a positive integer, sorted ascending.",
  id: "number/divisors",
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
      description: "Sorted divisors.",
      id: "divisors",
      kind: "numberList",
      label: "d",
    },
    {
      description: "Number of divisors.",
      id: "count",
      kind: "integer",
      label: "τ(n)",
    },
  ],
  title: "Number Divisors Calculator",
});
export const runDivisors = divisorsTool.execute;
export { divisorsExample as example };
export default divisorsTool;
