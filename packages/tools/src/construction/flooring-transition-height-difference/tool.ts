import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlooringTransitionHeightDifferenceInput = Readonly<{
  readonly firstHeightMillimeters: number;
  readonly secondHeightMillimeters: number;
}>;
export type FlooringTransitionHeightDifferenceOutput = Readonly<{
  readonly differenceMillimeters: number;
}>;

export const calculateFlooringTransitionHeightDifference = (
  x: FlooringTransitionHeightDifferenceInput,
): FlooringTransitionHeightDifferenceOutput => {
  if (!Number.isFinite(x.firstHeightMillimeters))
    simpleError("firstHeightMillimeters", "Provide a finite number.");
  if (!Number.isFinite(x.secondHeightMillimeters))
    simpleError("secondHeightMillimeters", "Provide a finite number.");
  const differenceMillimeters = Math.abs(
    x.firstHeightMillimeters - x.secondHeightMillimeters,
  );
  if (!Number.isFinite(differenceMillimeters))
    simpleError(
      "differenceMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    differenceMillimeters: Object.is(differenceMillimeters, -0)
      ? 0
      : differenceMillimeters,
  };
};

export const example = {
  input: { firstHeightMillimeters: 10, secondHeightMillimeters: 12 },
  output: { differenceMillimeters: 2 },
} satisfies ToolExample<
  FlooringTransitionHeightDifferenceInput,
  FlooringTransitionHeightDifferenceOutput
>;

export const tool = createSimpleTool({
  id: "construction/flooring-transition-height-difference",
  title: "Flooring Transition Height Difference",
  description:
    "Absolute finished-floor height difference at a transition between two adjacent surfaces.",
  inputs: [
    {
      id: "firstHeightMillimeters",
      kind: "number",
      label: "First Height Millimeters",
      unit: "mm",
    },
    {
      id: "secondHeightMillimeters",
      kind: "number",
      label: "Second Height Millimeters",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "differenceMillimeters",
      kind: "number",
      label: "Difference Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFlooringTransitionHeightDifference({
      firstHeightMillimeters: input.firstHeightMillimeters as number,
      secondHeightMillimeters: input.secondHeightMillimeters as number,
    }),
});
export const flooringTransitionHeightDifferenceTool = tool;
export const runFlooringTransitionHeightDifference = tool.execute;
export default tool;
