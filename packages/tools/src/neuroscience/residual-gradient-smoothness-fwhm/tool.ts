import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly residualVariance: number;
  readonly gradientCovariancePerMm2: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly axisFwhmMm: readonly number[];
  readonly reselDensityPerMm3: number;
}>;
const inputFields = [
  { id: "residualVariance", label: "Residual variance", kind: "number" },
  {
    id: "gradientCovariancePerMm2",
    label: "Gradient covariance per mm2",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.residualVariance, "residualVariance");
  const m = input.gradientCovariancePerMm2;
  if (
    m.length !== 3 ||
    m.some((row) => row.length !== 3) ||
    m.some((row, i) => row.some((v, j) => v !== m[j][i]))
  )
    simpleError(
      "gradientCovariancePerMm2",
      "A symmetric 3×3 gradient covariance required.",
    );
  const a = positive(m[0][0], "gradientCovariancePerMm2"),
    minor = positive(a * m[1][1] - m[0][1] ** 2, "gradientCovariancePerMm2"),
    det =
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] ** 2) -
      m[0][1] * (m[0][1] * m[2][2] - m[1][2] * m[0][2]) +
      m[0][2] * (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
  positive(minor, "gradientCovariancePerMm2");
  positive(det, "gradientCovariancePerMm2");
  return {
    axisFwhmMm: m.map((row, i) =>
      Math.sqrt((4 * Math.LN2 * input.residualVariance) / row[i]),
    ),
    reselDensityPerMm3:
      Math.sqrt(det / input.residualVariance ** 3) / (4 * Math.LN2) ** 1.5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  residualVariance: 1,
  gradientCovariancePerMm2: [
    [1, 0, 0],
    [0, 4, 0],
    [0, 0, 9],
  ],
} satisfies Input;
export const exampleOutput = {
  axisFwhmMm: [1.6651092223153954, 0.8325546111576977, 0.5550364074384652],
  reselDensityPerMm3: 1.2996400069926133,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/residual-gradient-smoothness-fwhm",
  title: "Smoothness FWHM",
  description:
    "Infer coordinate-axis Gaussian-equivalent residual FWHM and determinant-based resel density from residual variance and physical gradient covariance; not the applied smoothing-kernel width.",
  inputs: inputFields,
  outputs: [
    { id: "axisFwhmMm", label: "Axis fwhm mm", kind: "numberList" },
    {
      id: "reselDensityPerMm3",
      label: "Resel density per mm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      residualVariance: value.residualVariance as number,
      gradientCovariancePerMm2:
        value.gradientCovariancePerMm2 as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
