import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BilinearInterpolationInput = {
  readonly pointX: number;
  readonly pointY: number;
  readonly values: readonly (readonly number[])[];
  readonly x0?: number;
  readonly x1?: number;
  readonly y0?: number;
  readonly y1?: number;
};

export type BilinearInterpolationOutput = {
  readonly value: number;
};

export const bilinearInterpolationExample = {
  input: { pointX: 0.5, pointY: 0.5, values: [[0, 2], [2, 4]] },
  output: { value: 2 },
} satisfies ToolExample<BilinearInterpolationInput, BilinearInterpolationOutput>;

export const calculateBilinearInterpolation = (
  input: BilinearInterpolationInput,
): BilinearInterpolationOutput => {
  const values = input.values as readonly (readonly number[])[];
  if (values.length !== 2 || values.some((row) => row.length !== 2))
    simpleError(
      "values",
      "Provide a 2x2 grid of corner values.",
      "not_2x2_grid",
    );
  const x0 = input.x0 ?? 0;
  const x1 = input.x1 ?? 1;
  const y0 = input.y0 ?? 0;
  const y1 = input.y1 ?? 1;
  if (x1 === x0)
    simpleError(
      "x1",
      "The x coordinates must differ.",
      "equal_x_coordinates",
    );
  if (y1 === y0)
    simpleError(
      "y1",
      "The y coordinates must differ.",
      "equal_y_coordinates",
    );
  const t = (input.pointX - x0) / (x1 - x0);
  const s = (input.pointY - y0) / (y1 - y0);
  const bottom = (1 - t) * values[0]![0]! + t * values[0]![1]!;
  const top = (1 - t) * values[1]![0]! + t * values[1]![1]!;
  return { value: roundStatistic((1 - s) * bottom + s * top) };
};

export const bilinearInterpolationTool = createSimpleTool({
  calculate: (input) =>
    calculateBilinearInterpolation(
      input as unknown as BilinearInterpolationInput,
    ),
  description:
    "Interpolate a value inside a unit of a 2x2 grid from its four corner values.",
  id: "interpolation/bilinear",
  inputs: [
    {
      description:
        "Corner values as [[y0x0, y0x1], [y1x0, y1x1]].",
      id: "values",
      kind: "matrix",
      label: "Corner values",
    },
    {
      default: 0,
      description: "X coordinate of the first grid column.",
      id: "x0",
      kind: "number",
      label: "X0",
    },
    {
      default: 1,
      description: "X coordinate of the second grid column.",
      id: "x1",
      kind: "number",
      label: "X1",
    },
    {
      default: 0,
      description: "Y coordinate of the first grid row.",
      id: "y0",
      kind: "number",
      label: "Y0",
    },
    {
      default: 1,
      description: "Y coordinate of the second grid row.",
      id: "y1",
      kind: "number",
      label: "Y1",
    },
    {
      description: "Query x coordinate.",
      id: "pointX",
      kind: "number",
      label: "Point X",
    },
    {
      description: "Query y coordinate.",
      id: "pointY",
      kind: "number",
      label: "Point Y",
    },
  ],
  outputs: [
    {
      description: "Interpolated value at the query point.",
      id: "value",
      kind: "number",
      label: "Value",
    },
  ],
  title: "Bilinear Interpolation Calculator",
});
export const runBilinearInterpolation = bilinearInterpolationTool.execute;
export default bilinearInterpolationTool;
