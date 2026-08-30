import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  mean,
  norm,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly centeredPearlOutlinePointsMm: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly principalOutlineAxisRatio: number;
  readonly rmsRadialDeviationFraction: number;
}>;
const inputFields = [
  {
    id: "centeredPearlOutlinePointsMm",
    label: "Centered pearl outline points mm",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (shape(input.centeredPearlOutlinePointsMm, "outline") !== 2)
    simpleError(
      "outline",
      "Caller centered two-dimensional outline samples required.",
    );
  const a = input.centeredPearlOutlinePointsMm,
    n = a.length;
  if (n < 3)
    simpleError("outline", "At least three centered outline points required.");
  const mx = mean(a.map((r) => r[0])),
    my = mean(a.map((r) => r[1]));
  if (
    Math.abs(mx) > 1e-9 * norm(a.map((r) => r[0])) ||
    Math.abs(my) > 1e-9 * norm(a.map((r) => r[1]))
  )
    simpleError(
      "center",
      "Outline samples must be centered at their sample centroid.",
    );
  const xx = mean(a.map((r) => r[0] ** 2)),
    yy = mean(a.map((r) => r[1] ** 2)),
    xy = mean(a.map((r) => r[0] * r[1])),
    delta = Math.hypot(xx - yy, 2 * xy),
    small = positive((xx + yy - delta) / 2, "minorVariance"),
    large = (xx + yy + delta) / 2,
    radii = a.map((r) => Math.hypot(...r)),
    m = positive(mean(radii), "meanRadius");
  return {
    principalOutlineAxisRatio: Math.sqrt(large / small),
    rmsRadialDeviationFraction:
      Math.sqrt(mean(radii.map((v) => (v - m) ** 2))) / m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  centeredPearlOutlinePointsMm: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ],
} satisfies Input;
export const exampleOutput = {
  principalOutlineAxisRatio: 1,
  rmsRadialDeviationFraction: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/pearl-shape-rater",
  title: "Pearl Shape Symmetry Rater",
  description:
    "Audit centered pearl outline through principal second-moment axes and radial RMS residual, distinct from paired mirror errors; sampling must be comparable, not a pearl shape/market grade or 3D reconstruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "principalOutlineAxisRatio",
      label: "Principal outline axis ratio",
      kind: "number",
    },
    {
      id: "rmsRadialDeviationFraction",
      label: "Rms radial deviation fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      centeredPearlOutlinePointsMm:
        value.centeredPearlOutlinePointsMm as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
