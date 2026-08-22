import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const midpointExample = {
  input: { a: 3, b: 7 },
  output: { midpoint: 5 },
} satisfies ToolExample<
  { readonly a: number; readonly b: number },
  { readonly midpoint: number }
>;

export const calculateMidpoint = (input: {
  readonly a: number;
  readonly b: number;
}): { readonly midpoint: number } => ({
  midpoint: (input.a + input.b) / 2,
});

export const midpointTool = createSimpleTool({
  calculate: (input) =>
    calculateMidpoint(
      input as unknown as { readonly a: number; readonly b: number },
    ),
  description: "Compute the midpoint between two values.",
  id: "arithmetic/midpoint",
  inputs: [
    { id: "a", kind: "number", label: "A" },
    { id: "b", kind: "number", label: "B" },
  ],
  outputs: [{ id: "midpoint", kind: "number", label: "Midpoint" }],
  title: "Midpoint Calculator",
});
export const runMidpoint = midpointTool.execute;
export default midpointTool;
