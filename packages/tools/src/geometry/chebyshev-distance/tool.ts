import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateChebyshevDistance = (
  first: readonly number[],
  second: readonly number[],
): number | null => {
  if (
    first.length === 0 ||
    first.length !== second.length ||
    !first.every(Number.isFinite) ||
    !second.every(Number.isFinite)
  )
    return null;
  const distance = Math.max(
    ...first.map((value, index) => Math.abs(value - second[index]!)),
  );
  return Number.isFinite(distance) ? distance : null;
};

export const chebyshevDistanceExample = {
  input: { first: [1, 2, 3], second: [4, 2, -1] },
  output: { distance: 4 },
} satisfies ToolExample<
  { readonly first: readonly number[]; readonly second: readonly number[] },
  { readonly distance: number }
>;

export const chebyshevDistanceTool = createSimpleTool({
  id: "geometry/chebyshev-distance",
  title: "Chebyshev Distance Calculator",
  description:
    "Find the greatest coordinate difference between two equal-length points or vectors.",
  inputs: [
    { id: "first", kind: "numberList", label: "First vector" },
    { id: "second", kind: "numberList", label: "Second vector" },
  ],
  outputs: [{ id: "distance", kind: "number", label: "Chebyshev distance" }],
  calculate: (input) => {
    const distance = calculateChebyshevDistance(
      input.first as number[],
      input.second as number[],
    );
    if (distance === null)
      simpleError("first", "Enter two nonempty vectors of equal length.");
    return { distance };
  },
});

export const runChebyshevDistance = chebyshevDistanceTool.execute;
export default chebyshevDistanceTool;
