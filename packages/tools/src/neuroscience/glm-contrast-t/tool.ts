import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly coefficients: readonly number[];
  readonly contrast: readonly number[];
  readonly coefficientCovariance: readonly (readonly number[])[];
  readonly residualDegreesOfFreedom: number;
}>;
export type Output = Readonly<{
  readonly contrastEstimate: number;
  readonly contrastStandardError: number;
  readonly tStatistic: number;
  readonly degreesOfFreedom: number;
}>;
const inputFields = [
  { id: "coefficients", label: "Coefficients", kind: "numberList" },
  { id: "contrast", label: "Contrast", kind: "numberList" },
  {
    id: "coefficientCovariance",
    label: "Coefficient covariance",
    kind: "matrix",
  },
  {
    id: "residualDegreesOfFreedom",
    label: "Residual degrees of freedom",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.coefficients, input.contrast, "coefficients");
  const n = input.coefficients.length,
    m = input.coefficientCovariance;
  count(input.residualDegreesOfFreedom, "residualDegreesOfFreedom", 1);
  if (n > 32 || m.length !== n || m.some((r) => r.length !== n))
    simpleError(
      "coefficientCovariance",
      "A matching covariance matrix of at most 32 coefficients required.",
    );
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (m[i][j] !== m[j][i])
        simpleError("coefficientCovariance", "Symmetric covariance required.");
  const l = m.map((row) => row.map(() => 0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      let value = m[i][j];
      for (let k = 0; k < j; k++) value -= l[i][k] * l[j][k];
      if (i === j) {
        if (value <= 0)
          simpleError(
            "coefficientCovariance",
            "Positive-definite fitted coefficient covariance required.",
          );
        l[i][j] = Math.sqrt(value);
      } else l[i][j] = value / l[j][j];
    }
  const contrastEstimate = input.coefficients.reduce(
      (s, v, i) => s + v * input.contrast[i],
      0,
    ),
    variance = input.contrast.reduce(
      (s, v, i) =>
        s + v * m[i].reduce((t, x, j) => t + x * input.contrast[j], 0),
      0,
    ),
    contrastStandardError = Math.sqrt(positive(variance, "contrast"));
  return {
    contrastEstimate,
    contrastStandardError,
    tStatistic: contrastEstimate / contrastStandardError,
    degreesOfFreedom: input.residualDegreesOfFreedom,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coefficients: [2, 3],
  contrast: [1, -1],
  coefficientCovariance: [
    [1, 0],
    [0, 3],
  ],
  residualDegreesOfFreedom: 10,
} satisfies Input;
export const exampleOutput = {
  contrastEstimate: -1,
  contrastStandardError: 2,
  tStatistic: -0.5,
  degreesOfFreedom: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/glm-contrast-t",
  title: "GLM t-Statistic",
  description:
    "Evaluate a GLM contrast using the full already-scaled coefficient covariance; no additional residual variance multiplier is applied.",
  inputs: inputFields,
  outputs: [
    { id: "contrastEstimate", label: "Contrast estimate", kind: "number" },
    {
      id: "contrastStandardError",
      label: "Contrast standard error",
      kind: "number",
    },
    { id: "tStatistic", label: "T statistic", kind: "number" },
    { id: "degreesOfFreedom", label: "Degrees of freedom", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      coefficients: value.coefficients as readonly number[],
      contrast: value.contrast as readonly number[],
      coefficientCovariance:
        value.coefficientCovariance as readonly (readonly number[])[],
      residualDegreesOfFreedom: value.residualDegreesOfFreedom as number,
    }),
});
export const run = tool.execute;
export default tool;
