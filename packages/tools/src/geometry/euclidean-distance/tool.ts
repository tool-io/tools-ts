import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateEuclideanDistance = (
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
  const distance = Math.hypot(
    ...first.map((value, index) => value - second[index]!),
  );
  return Number.isFinite(distance) ? distance : null;
};

export const euclideanDistanceExample = {
  input: { first: [0, 0], second: [3, 4] },
  output: { distance: 5 },
} satisfies ToolExample<
  { readonly first: readonly number[]; readonly second: readonly number[] },
  { readonly distance: number }
>;

export const euclideanDistanceTool = createSimpleTool({
  id: "geometry/euclidean-distance",
  title: "Euclidean Distance Calculator",
  description:
    "Calculate straight-line distance between two equal-length points or vectors.",
  inputs: [
    { id: "first", kind: "numberList", label: "First point" },
    { id: "second", kind: "numberList", label: "Second point" },
  ],
  outputs: [{ id: "distance", kind: "number", label: "Euclidean distance" }],
  calculate: (input) => {
    const distance = calculateEuclideanDistance(
      input.first as number[],
      input.second as number[],
    );
    if (distance === null)
      simpleError("first", "Enter two nonempty vectors of equal length.");
    return { distance };
  },
});

export const runEuclideanDistance = euclideanDistanceTool.execute;
export default euclideanDistanceTool;
