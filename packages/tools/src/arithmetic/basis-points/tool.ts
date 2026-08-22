import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const basisPointsExample = {
  input: { percent: 1.5 },
  output: { basisPoints: 150 },
} satisfies ToolExample<
  { readonly percent: number },
  { readonly basisPoints: number }
>;

export const calculateBasisPoints = (input: {
  readonly percent: number;
}): { readonly basisPoints: number } => ({
  basisPoints: input.percent * 100,
});

export const basisPointsTool = createSimpleTool({
  calculate: (input) =>
    calculateBasisPoints(input as unknown as { readonly percent: number }),
  description:
    "Convert a percentage to basis points (multiply by one hundred).",
  id: "arithmetic/basis-points",
  inputs: [{ id: "percent", kind: "number", label: "Percent", unit: "%" }],
  outputs: [
    { id: "basisPoints", kind: "number", label: "Basis points", unit: "bp" },
  ],
  title: "Basis Points Calculator",
});
export const runBasisPoints = basisPointsTool.execute;
export default basisPointsTool;
