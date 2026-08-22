import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrueHeadingInput = {
  readonly magneticHeadingDeg: number;
  readonly variationDeg: number;
};

export type TrueHeadingOutput = {
  readonly trueHeadingDeg: number;
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const trueHeadingExample = {
  input: { magneticHeadingDeg: 335, variationDeg: 15 },
  output: { trueHeadingDeg: 350 },
} satisfies ToolExample<TrueHeadingInput, TrueHeadingOutput>;

export const calculateTrueHeading = (
  input: TrueHeadingInput,
): TrueHeadingOutput => ({
  trueHeadingDeg: normalizeDegrees(
    input.magneticHeadingDeg + input.variationDeg,
  ),
});

export const trueHeadingTool = createSimpleTool({
  calculate: (input) =>
    calculateTrueHeading(input as unknown as TrueHeadingInput),
  description:
    "Convert a magnetic heading to a true heading using east-positive variation (west is best).",
  id: "aviation/true-heading",
  inputs: [
    {
      description: "Magnetic heading.",
      id: "magneticHeadingDeg",
      kind: "number",
      label: "Magnetic heading",
      unit: "°",
    },
    {
      description:
        "Magnetic variation at the position; east positive, west negative.",
      id: "variationDeg",
      kind: "number",
      label: "Variation",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "True heading normalized to zero through 360.",
      format: "angle",
      id: "trueHeadingDeg",
      kind: "number",
      label: "True heading",
      unit: "°",
    },
  ],
  title: "True Heading Calculator",
});
export const runTrueHeading = trueHeadingTool.execute;
export default trueHeadingTool;
