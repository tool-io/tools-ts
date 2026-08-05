import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RightTriangleMeasurements = {
  readonly area: number;
  readonly hypotenuse: number;
  readonly perimeter: number;
};

export const calculateRightTriangle = (
  sideA: number,
  sideB: number,
): RightTriangleMeasurements | null => {
  if (
    !Number.isFinite(sideA) ||
    !Number.isFinite(sideB) ||
    sideA <= 0 ||
    sideB <= 0
  )
    return null;
  const result = {
    area: (sideA * sideB) / 2,
    hypotenuse: Math.hypot(sideA, sideB),
    perimeter: sideA + sideB + Math.hypot(sideA, sideB),
  };
  return Object.values(result).every(Number.isFinite) ? result : null;
};

export const rightTriangleExample = {
  input: { sideA: 3, sideB: 4 },
  output: { area: 6, hypotenuse: 5, perimeter: 12 },
} satisfies ToolExample<
  { readonly sideA: number; readonly sideB: number },
  RightTriangleMeasurements
>;

export const rightTriangleTool = createSimpleTool({
  id: "geometry/right-triangle",
  title: "Right Triangle Calculator",
  description: "Calculate a right triangle's hypotenuse, area, and perimeter.",
  inputs: [
    { id: "sideA", kind: "number", label: "Side a", minimum: 0 },
    { id: "sideB", kind: "number", label: "Side b", minimum: 0 },
  ],
  outputs: [
    { id: "hypotenuse", kind: "number", label: "Hypotenuse" },
    { id: "area", kind: "number", label: "Area" },
    { id: "perimeter", kind: "number", label: "Perimeter" },
  ],
  calculate: (input) => {
    const result = calculateRightTriangle(
      input.sideA as number,
      input.sideB as number,
    );
    if (!result)
      simpleError("sideA", "Enter two positive finite side lengths.");
    return result;
  },
});

export const runRightTriangle = rightTriangleTool.execute;
export default rightTriangleTool;
