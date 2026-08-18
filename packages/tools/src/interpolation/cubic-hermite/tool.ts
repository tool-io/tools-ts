import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CubicHermiteInput = {
  readonly m0: number;
  readonly m1: number;
  readonly p0: number;
  readonly p1: number;
  readonly t: number;
};

export type CubicHermiteOutput = {
  readonly value: number;
};

export const cubicHermiteExample = {
  input: { m0: 0, m1: 0, p0: 0, p1: 10, t: 0.5 },
  output: { value: 5 },
} satisfies ToolExample<CubicHermiteInput, CubicHermiteOutput>;

export const calculateCubicHermite = (
  input: CubicHermiteInput,
): CubicHermiteOutput => {
  const { p0, p1, m0, m1, t } = input;
  if (t < 0 || t > 1)
    simpleError(
      "t",
      "The interpolation parameter must be between zero and one.",
      "t_out_of_range",
    );
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return {
    value: roundStatistic(h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1),
  };
};

export const cubicHermiteTool = createSimpleTool({
  calculate: (input) =>
    calculateCubicHermite(input as unknown as CubicHermiteInput),
  description:
    "Interpolate between two values with specified tangents using cubic Hermite basis functions.",
  id: "interpolation/cubic-hermite",
  inputs: [
    { description: "Value at the start point.", id: "p0", kind: "number", label: "P0" },
    { description: "Tangent at the start point.", id: "m0", kind: "number", label: "M0" },
    { description: "Value at the end point.", id: "p1", kind: "number", label: "P1" },
    { description: "Tangent at the end point.", id: "m1", kind: "number", label: "M1" },
    {
      description: "Interpolation parameter between zero and one.",
      id: "t",
      kind: "number",
      label: "T",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Interpolated curve value at parameter t.",
      id: "value",
      kind: "number",
      label: "Value",
    },
  ],
  title: "Cubic Hermite Interpolation Calculator",
});
export const runCubicHermite = cubicHermiteTool.execute;
export default cubicHermiteTool;
