import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const aliquotSumExample = {
  input: { n: 12 },
  output: { aliquotSum: 16 },
} satisfies ToolExample<
  { readonly n: number },
  { readonly aliquotSum: number }
>;

export const calculateAliquotSum = (input: {
  readonly n: number;
}): { readonly aliquotSum: number } => {
  const n = input.n as number;
  if (n <= 0) simpleError("n", "n must be a positive integer.", "invalid_n");
  let sum = n > 1 ? 1 : 0;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      sum += d;
      if (d !== n / d) sum += n / d;
    }
  }
  return { aliquotSum: sum };
};

export const aliquotSumTool = createSimpleTool({
  calculate: (input) =>
    calculateAliquotSum(input as unknown as { readonly n: number }),
  description: "Compute the sum of proper divisors of n excluding n itself.",
  id: "number/aliquot-sum",
  inputs: [{ id: "n", kind: "integer", label: "n", minimum: 1 }],
  outputs: [{ id: "aliquotSum", kind: "integer", label: "Aliquot sum" }],
  title: "Aliquot Sum Calculator",
});
export const runAliquotSum = aliquotSumTool.execute;
export default aliquotSumTool;
