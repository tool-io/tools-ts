import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ExponentialInterpolationInput = {
  readonly x: number;
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
};

export type ExponentialInterpolationOutput = {
  readonly y: number;
};

export const exponentialInterpolationExample = {
  input: { x: 1, x0: 0, x1: 2, y0: 1, y1: 4 },
  output: { y: 2 },
} satisfies ToolExample<ExponentialInterpolationInput, ExponentialInterpolationOutput>;

export const calculateExponentialInterpolation = (
  input: ExponentialInterpolationInput,
): ExponentialInterpolationOutput => {
  const { x, x0, x1, y0, y1 } = input;
  if (x1 === x0)
    simpleError(
      "x1",
      "The two points must have different x coordinates.",
      "equal_x_points",
    );
  if (y0 === 0 || y1 === 0 || y0 > 0 !== y1 > 0)
    simpleError(
      "y0",
      "Both y values must be nonzero and share the same sign.",
      "invalid_y_range",
    );
  const ratio = (x - x0) / (x1 - x0);
  const y = y0 * (y1 / y0) ** ratio;
  return { y: roundStatistic(y) };
};

export const exponentialInterpolationTool = createSimpleTool({
  calculate: (input) =>
    calculateExponentialInterpolation(
      input as unknown as ExponentialInterpolationInput,
    ),
  description:
    "Interpolate between two points along an exponential curve of constant ratio.",
  id: "interpolation/exponential",
  inputs: [
    { description: "First point x coordinate.", id: "x0", kind: "number", label: "X0" },
    { description: "First point y coordinate.", id: "y0", kind: "number", label: "Y0" },
    { description: "Second point x coordinate.", id: "x1", kind: "number", label: "X1" },
    { description: "Second point y coordinate.", id: "y1", kind: "number", label: "Y1" },
    { description: "Query x coordinate.", id: "x", kind: "number", label: "X" },
  ],
  outputs: [
    {
      description: "Interpolated y value on the exponential curve.",
      id: "y",
      kind: "number",
      label: "Y",
    },
  ],
  title: "Exponential Interpolation Calculator",
});
export const runExponentialInterpolation = exponentialInterpolationTool.execute;
export default exponentialInterpolationTool;
