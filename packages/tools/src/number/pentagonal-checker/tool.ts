import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PentagonalCheckerInput = {
  readonly value: number;
};

export type PentagonalCheckerOutput = {
  readonly isPentagonal: boolean;
};

export const pentagonalCheckerExample = {
  input: { value: 22 },
  output: { isPentagonal: true },
} satisfies ToolExample<PentagonalCheckerInput, PentagonalCheckerOutput>;

export const pentagonalCheckerTool = createSimpleTool({
  id: "number/pentagonal-checker",
  title: "Pentagonal Number Checker",
  description:
    "Check whether a nonnegative safe integer equals k(3k-1)/2 for some integer k >= 1.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    {
      id: "isPentagonal",
      label: "Is a pentagonal number",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const discriminant = 24 * value + 1;
    const root = Math.floor(Math.sqrt(discriminant));
    if (root * root !== discriminant) return { isPentagonal: false };
    if ((root + 1) % 6 !== 0) return { isPentagonal: false };
    const k = (root + 1) / 6;
    return { isPentagonal: (k * (3 * k - 1)) / 2 === value };
  },
});
export const runPentagonalChecker = pentagonalCheckerTool.execute;
export default pentagonalCheckerTool;
