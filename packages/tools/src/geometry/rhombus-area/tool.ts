import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rhombusAreaExample = {
  input: { d1: 6, d2: 8 },
  output: { area: 24 },
} satisfies ToolExample<
  { readonly d1: number; readonly d2: number },
  { readonly area: number }
>;

export const calculateRhombusArea = (
  input: RhombusAreaInput,
): RhombusAreaOutput => ({
  area: (input.d1 * input.d2) / 2,
});

export type RhombusAreaInput = { readonly d1: number; readonly d2: number };
export type RhombusAreaOutput = { readonly area: number };

export const rhombusAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateRhombusArea(input as unknown as RhombusAreaInput),
  description: "Compute the area of a rhombus from its two diagonals.",
  id: "geometry/rhombus-area",
  inputs: [
    { id: "d1", kind: "number", label: "Diagonal 1", minimum: 0 },
    { id: "d2", kind: "number", label: "Diagonal 2", minimum: 0 },
  ],
  outputs: [{ id: "area", kind: "number", label: "Area" }],
  title: "Rhombus Area Calculator",
});
export const runRhombusArea = rhombusAreaTool.execute;
export default rhombusAreaTool;
