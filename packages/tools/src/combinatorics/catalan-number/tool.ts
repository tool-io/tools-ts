import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const catalanNumberExample = {
  input: { n: 5 },
  output: { catalanNumber: 42 },
} satisfies ToolExample<CatalanInput, CatalanOutput>;

export type CatalanInput = { readonly n: number };
export type CatalanOutput = { readonly catalanNumber: number };

export const calculateCatalanNumber = (input: CatalanInput): CatalanOutput => {
  const n = input.n as number;
  if (n < 0 || n > 30)
    simpleError("n", "n must be between zero and thirty.", "invalid_n");
  let c = 1n;
  for (let i = 0; i < n; i++)
    c = (c * BigInt(2 * (2 * i + 1))) / (BigInt(i) + 2n);
  return { catalanNumber: Number(c) };
};

export const catalanNumberTool = createSimpleTool({
  calculate: (input) =>
    calculateCatalanNumber(input as unknown as CatalanInput),
  description:
    "Compute the nth Catalan number using the multiplicative formula.",
  id: "combinatorics/catalan-number",
  inputs: [{ id: "n", kind: "integer", label: "n", maximum: 30, minimum: 0 }],
  outputs: [{ id: "catalanNumber", kind: "integer", label: "Catalan number" }],
  title: "Catalan Number Calculator",
});
export const runCatalanNumber = catalanNumberTool.execute;
export default catalanNumberTool;
