import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LiftToDragRatioInput = {
  readonly dragLb: number;
  readonly liftLb: number;
};

export type LiftToDragRatioOutput = {
  readonly liftToDragRatio: number;
};

export const liftToDragRatioExample = {
  input: { dragLb: 240, liftLb: 2400 },
  output: { liftToDragRatio: 10 },
} satisfies ToolExample<LiftToDragRatioInput, LiftToDragRatioOutput>;

export const calculateLiftToDragRatio = (
  input: LiftToDragRatioInput,
): LiftToDragRatioOutput => {
  if (input.dragLb <= 0)
    simpleError("dragLb", "The drag force must be positive.", "invalid_drag");
  return { liftToDragRatio: input.liftLb / input.dragLb };
};

export const liftToDragRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateLiftToDragRatio(input as unknown as LiftToDragRatioInput),
  description:
    "Compute the aerodynamic efficiency of an aircraft as the ratio of lift to drag.",
  id: "aviation/lift-to-drag-ratio",
  inputs: [
    {
      description: "Total lift force.",
      id: "liftLb",
      kind: "number",
      label: "Lift",
      unit: "lb",
    },
    {
      description: "Total drag force.",
      id: "dragLb",
      kind: "number",
      label: "Drag",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Dimensionless lift-to-drag ratio.",
      format: "ratio",
      id: "liftToDragRatio",
      kind: "number",
      label: "L/D",
    },
  ],
  title: "Lift-to-Drag Ratio Calculator",
});
export const runLiftToDragRatio = liftToDragRatioTool.execute;
export default liftToDragRatioTool;
