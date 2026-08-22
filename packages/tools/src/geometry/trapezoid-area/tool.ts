import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const trapezoidAreaExample = {
  input: { a: 3, b: 7, h: 4 },
  output: { area: 20 },
} satisfies ToolExample<
  { readonly a: number; readonly b: number; readonly h: number },
  { readonly area: number }
>;

export const calculateTrapezoidArea = (
  input: TrapezoidAreaInput,
): TrapezoidAreaOutput => {
  if (input.h < 0)
    simpleError("h", "The height must be positive.", "invalid_height");
  return { area: ((input.a + input.b) / 2) * input.h };
};

export type TrapezoidAreaInput = {
  readonly a: number;
  readonly b: number;
  readonly h: number;
};
export type TrapezoidAreaOutput = { readonly area: number };

export const trapezoidAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateTrapezoidArea(input as unknown as TrapezoidAreaInput),
  description:
    "Compute the area of a trapezoid from its parallel sides and height.",
  id: "geometry/trapezoid-area",
  inputs: [
    { id: "a", kind: "number", label: "Side A", minimum: 0 },
    { id: "b", kind: "number", label: "Side B", minimum: 0 },
    { id: "h", kind: "number", label: "Height", minimum: 0 },
  ],
  outputs: [{ id: "area", kind: "number", label: "Area" }],
  title: "Trapezoid Area Calculator",
});
export const runTrapezoidArea = trapezoidAreaTool.execute;
export default trapezoidAreaTool;
