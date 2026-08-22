import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const totientExample = {
  input: { n: 12 },
  output: { totient: 4 },
} satisfies ToolExample<{ readonly n: number }, { readonly totient: number }>;

export const calculateTotient = (input: {
  readonly n: number;
}): { readonly totient: number } => {
  const n = input.n as number;
  if (n <= 0) simpleError("n", "n must be a positive integer.", "invalid_n");
  let result = n;
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      while (m % p === 0) m /= p;
      result -= result / p;
    }
  }
  if (m > 1) result -= result / m;
  return { totient: Math.round(result) };
};

export const totientTool = createSimpleTool({
  calculate: (input) =>
    calculateTotient(input as unknown as { readonly n: number }),
  description: "Compute Euler's totient function φ(n).",
  id: "number/totient",
  inputs: [{ id: "n", kind: "integer", label: "n", minimum: 1 }],
  outputs: [{ id: "totient", kind: "integer", label: "φ(n)" }],
  title: "Euler Totient Calculator",
});
export const runTotient = totientTool.execute;
export default totientTool;
