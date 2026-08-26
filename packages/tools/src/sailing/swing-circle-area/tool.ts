import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SwingCircleAreaInput = {
  readonly anchorCircleRadiusMeters: number;
};

export type SwingCircleAreaOutput = {
  readonly swingCircleAreaM2: number;
};

export const calculateSwingCircleArea = (
  anchorCircleRadiusMeters: number,
): number | null =>
  Number.isFinite(anchorCircleRadiusMeters) && anchorCircleRadiusMeters >= 0
    ? Math.PI * anchorCircleRadiusMeters ** 2
    : null;

export const swingCircleAreaExample = {
  input: { anchorCircleRadiusMeters: 10 },
  output: { swingCircleAreaM2: 314.1592653589793 },
} satisfies ToolExample<SwingCircleAreaInput, SwingCircleAreaOutput>;

export const swingCircleAreaTool = createSimpleTool({
  id: "sailing/swing-circle-area",
  title: "Swing Circle Area Calculator",
  description:
    "Calculate the area a boat can sweep as a circle around its anchor from the anchor circle radius.",
  inputs: [
    {
      id: "anchorCircleRadiusMeters",
      kind: "number",
      label: "Anchor circle radius",
      unit: "m",
    },
  ],
  outputs: [
    {
      format: "area-m2",
      id: "swingCircleAreaM2",
      kind: "number",
      label: "Swing circle area",
      unit: "m²",
    },
  ],
  calculate: (input) => {
    const radius = input.anchorCircleRadiusMeters as number;
    const swingCircleAreaM2 = calculateSwingCircleArea(radius);
    if (swingCircleAreaM2 === null)
      simpleError(
        "anchorCircleRadiusMeters",
        "Enter a non-negative anchor circle radius.",
        "invalid_radius",
      );
    return { swingCircleAreaM2 };
  },
});

export const runSwingCircleArea = swingCircleAreaTool.execute;
export default swingCircleAreaTool;
