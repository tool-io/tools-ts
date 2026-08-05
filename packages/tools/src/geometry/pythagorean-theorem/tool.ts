import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PythagoreanInput = {
  readonly hypotenuse?: number;
  readonly sideA?: number;
  readonly sideB?: number;
};

export const calculateMissingRightTriangleSide = (
  input: PythagoreanInput,
): number | null => {
  const values = [input.sideA, input.sideB, input.hypotenuse];
  if (
    values.filter((value) => value !== undefined).length !== 2 ||
    values.some(
      (value) => value !== undefined && (!Number.isFinite(value) || value <= 0),
    )
  )
    return null;
  if (input.hypotenuse === undefined)
    return Math.hypot(input.sideA!, input.sideB!);
  const leg = input.sideA ?? input.sideB!;
  if (input.hypotenuse <= leg) return null;
  const result = Math.sqrt((input.hypotenuse - leg) * (input.hypotenuse + leg));
  return Number.isFinite(result) && result > 0 ? result : null;
};

export const pythagoreanTheoremExample = {
  input: { sideA: 3, sideB: 4 },
  output: { missingSide: 5 },
} satisfies ToolExample<PythagoreanInput, { readonly missingSide: number }>;

export const pythagoreanTheoremTool = createSimpleTool({
  id: "geometry/pythagorean-theorem",
  title: "Pythagorean Theorem Calculator",
  description:
    "Calculate a missing side of a right triangle from two known sides.",
  inputs: [
    {
      id: "sideA",
      kind: "number",
      label: "Side a",
      minimum: 0,
      required: false,
    },
    {
      id: "sideB",
      kind: "number",
      label: "Side b",
      minimum: 0,
      required: false,
    },
    {
      id: "hypotenuse",
      kind: "number",
      label: "Hypotenuse",
      minimum: 0,
      required: false,
    },
  ],
  outputs: [{ id: "missingSide", kind: "number", label: "Missing side" }],
  calculate: (input) => {
    const missingSide = calculateMissingRightTriangleSide(
      input as PythagoreanInput,
    );
    if (missingSide === null)
      simpleError("sideA", "Enter exactly two valid side lengths.");
    return { missingSide };
  },
});

export const runPythagoreanTheorem = pythagoreanTheoremTool.execute;
export default pythagoreanTheoremTool;
