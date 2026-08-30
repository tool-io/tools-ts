import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly realCoilSensitivities: readonly (readonly number[])[];
  readonly noiseCovariance: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly sensitivityGramDeterminant: number;
  readonly diagonalGramValues: readonly number[];
  readonly localGeometryFactors: readonly number[];
}>;
const inputFields = [
  {
    id: "realCoilSensitivities",
    label: "Real coil sensitivities",
    kind: "matrix",
  },
  { id: "noiseCovariance", label: "Noise covariance", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const s = input.realCoilSensitivities,
    c = input.noiseCovariance;
  if (
    s.length !== 2 ||
    s.some((row) => row.length !== 2) ||
    c.length !== 2 ||
    c.some((row) => row.length !== 2) ||
    c[0][1] !== c[1][0] ||
    c[0][0] <= 0 ||
    c[1][1] <= 0
  )
    simpleError(
      "noiseCovariance",
      "Two real coils/two aliases and symmetric positive-definite 2×2 noise covariance required.",
    );
  const det = c[0][0] * c[1][1] - c[0][1] ** 2;
  positive(det, "noiseCovariance");
  const inv = [
      [c[1][1] / det, -c[0][1] / det],
      [-c[1][0] / det, c[0][0] / det],
    ],
    g = [
      [0, 0],
      [0, 0],
    ];
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++)
      for (let a = 0; a < 2; a++)
        for (let b = 0; b < 2; b++) g[i][j] += s[a][i] * inv[a][b] * s[b][j];
  const sensitivityGramDeterminant = positive(
    g[0][0] * g[1][1] - g[0][1] * g[1][0],
    "realCoilSensitivities",
  );
  return {
    sensitivityGramDeterminant,
    diagonalGramValues: [g[0][0], g[1][1]],
    localGeometryFactors: [
      Math.sqrt((g[0][0] * g[1][1]) / sensitivityGramDeterminant),
      Math.sqrt((g[0][0] * g[1][1]) / sensitivityGramDeterminant),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realCoilSensitivities: [
    [1, 0],
    [0, 1],
  ],
  noiseCovariance: [
    [1, 0],
    [0, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  sensitivityGramDeterminant: 1,
  diagonalGramValues: [1, 1],
  localGeometryFactors: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/sense-alias-coil-conditioning",
  title: "SENSE Acceleration",
  description:
    "Assess real-valued two-coil/two-alias SENSE conditioning through SᵀΨ⁻¹S and geometry factors; this is not general complex-coil image reconstruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "sensitivityGramDeterminant",
      label: "Sensitivity gram determinant",
      kind: "number",
    },
    {
      id: "diagonalGramValues",
      label: "Diagonal gram values",
      kind: "numberList",
    },
    {
      id: "localGeometryFactors",
      label: "Local geometry factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      realCoilSensitivities:
        value.realCoilSensitivities as readonly (readonly number[])[],
      noiseCovariance: value.noiseCovariance as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
