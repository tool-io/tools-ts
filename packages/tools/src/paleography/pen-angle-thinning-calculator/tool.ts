import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PenAngleThinningCalculatorInput = {
  readonly nibWidthMm: number;
  readonly penAngleDegrees: number;
};

export type PenAngleThinningCalculatorOutput = {
  readonly verticalStemWidthMm: number;
  readonly horizontalStrokeWidthMm: number;
  readonly thinningRatio: number;
};

export const calculatePenAngleThinningCalculator = (
  input: PenAngleThinningCalculatorInput,
): PenAngleThinningCalculatorOutput => {
  if (!(Number.isFinite(input.nibWidthMm) && input.nibWidthMm > 0))
    return simpleError(
      "nibWidthMm",
      "Nib width must be greater than zero millimetres.",
      "invalid_width",
    );
  if (!(
    Number.isFinite(input.penAngleDegrees) &&
    input.penAngleDegrees > 0 &&
    input.penAngleDegrees < 90
  ))
    return simpleError(
      "penAngleDegrees",
      "Pen angle must lie strictly between 0 and 90 degrees.",
      "invalid_angle",
    );
  const radians = (input.penAngleDegrees * Math.PI) / 180;
  return {
    verticalStemWidthMm: input.nibWidthMm * Math.cos(radians),
    horizontalStrokeWidthMm: input.nibWidthMm * Math.sin(radians),
    thinningRatio: Math.cos(radians) / Math.sin(radians),
  };
};

export const penAngleThinningCalculatorExample = {
  input: { nibWidthMm: 2, penAngleDegrees: 45 },
  output: {
    verticalStemWidthMm: 1.4142135623730951,
    horizontalStrokeWidthMm: 1.414213562373095,
    thinningRatio: 1.0000000000000002,
  },
} satisfies ToolExample<
  PenAngleThinningCalculatorInput,
  PenAngleThinningCalculatorOutput
>;

export const penAngleThinningCalculatorTool = createSimpleTool({
  id: "paleography/pen-angle-thinning-calculator",
  title: "Pen Angle Thinning Calculator",
  description:
    "Compute exact broad-nib stroke geometry for a nib of width w held at angle theta to the writing line: vertical stems take w*cos(theta), horizontal strokes w*sin(theta), and the thinning ratio is their quotient cot(theta).",
  inputs: [
    {
      description: "Full width of the broad nib edge in mm.",
      id: "nibWidthMm",
      kind: "number",
      label: "Nib width",
      minimum: 0,
      unit: "mm",
    },
    {
      description:
        "Pen angle in degrees measured from the baseline (strictly between 0 and 90).",
      id: "penAngleDegrees",
      kind: "number",
      label: "Pen angle",
      minimum: 0,
      maximum: 90,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Width of a vertical stem: nib width times cos(angle).",
      id: "verticalStemWidthMm",
      kind: "number",
      label: "Stem width",
      unit: "mm",
    },
    {
      description: "Width of a horizontal stroke: nib width times sin(angle).",
      id: "horizontalStrokeWidthMm",
      kind: "number",
      label: "Horizontal width",
      unit: "mm",
    },
    {
      description: "Thinning ratio cot(angle) of stem over horizontal stroke.",
      id: "thinningRatio",
      kind: "number",
      label: "Thinning ratio",
    },
  ],
  calculate: (input) =>
    calculatePenAngleThinningCalculator({
      nibWidthMm: input.nibWidthMm as number,
      penAngleDegrees: input.penAngleDegrees as number,
    }),
});

export const runPenAngleThinningCalculator =
  penAngleThinningCalculatorTool.execute;
export default penAngleThinningCalculatorTool;
