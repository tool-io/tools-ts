import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fisherExactTwoSided = (
  a: number,
  b: number,
  c: number,
  d: number,
): number => {
  const total = a + b + c + d;
  if (total > 10000)
    simpleError(
      "a",
      "The supported exact-table total is at most 10,000.",
      "resource_limit",
    );
  const logFactorials = Array<number>(total + 1).fill(0);
  for (let i = 2; i <= total; i++)
    logFactorials[i] = logFactorials[i - 1]! + Math.log(i);
  const choose = (n: number, k: number) =>
    logFactorials[n]! - logFactorials[k]! - logFactorials[n - k]!;
  const row1 = a + b,
    col1 = a + c,
    col2 = b + d;
  const logProbability = (x: number) =>
    choose(col1, x) + choose(col2, row1 - x) - choose(total, row1);
  const observed = logProbability(a);
  let p = 0;
  for (let x = Math.max(0, row1 - col2); x <= Math.min(row1, col1); x++) {
    const lp = logProbability(x);
    if (lp <= observed + 1e-12) p += Math.exp(lp);
  }
  return Math.min(1, p);
};

export const example = {
  input: { a: 1, b: 9, c: 11, d: 3 },
  output: { pValue: 0.0027594561852200745 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "statistics/fisher-exact-test",
  title: "Fisher's Exact Test",
  description:
    "Compute the two-sided Fisher exact p-value for a 2×2 contingency table with fixed margins. Tables above 10,000 total observations are rejected to bound exact enumeration.",
  inputs: [
    { id: "a", kind: "integer", label: "Top-left count", minimum: 0 },
    { id: "b", kind: "integer", label: "Top-right count", minimum: 0 },
    { id: "c", kind: "integer", label: "Bottom-left count", minimum: 0 },
    { id: "d", kind: "integer", label: "Bottom-right count", minimum: 0 },
  ],
  outputs: [{ id: "pValue", kind: "number", label: "Two-sided p-value" }],
  calculate: (input) => ({
    pValue: fisherExactTwoSided(
      input.a as number,
      input.b as number,
      input.c as number,
      input.d as number,
    ),
  }),
});
export type FisherExactTestInput = Readonly<typeof example.input>;
export type FisherExactTestOutput = Readonly<typeof example.output>;
export const fisherExactTestTool = tool;
export const runFisherExactTest = tool.execute;
export default tool;
