import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly zRadians: number;
  readonly realNome: number;
  readonly positiveSeriesTerms: number;
}>;
export type Output = Readonly<{
  readonly jacobiTheta3Value: number;
  readonly absoluteTruncationTailBound: number;
}>;
const inputFields = [
  { id: "zRadians", label: "Z radians", kind: "number" },
  { id: "realNome", label: "Real nome", kind: "number" },
  { id: "positiveSeriesTerms", label: "Positive series terms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.realNome < 0 || input.realNome > 0.95)
    simpleError("nome", "Real theta nome q in [0,0.95] required.");
  const n = bounded(input.positiveSeriesTerms, "terms", 1, 1000),
    q = input.realNome;
  let s = 1;
  for (let k = 1; k <= n; k++)
    s += 2 * q ** (k * k) * Math.cos(2 * k * input.zRadians);
  return {
    jacobiTheta3Value: s,
    absoluteTruncationTailBound:
      q === 0 ? 0 : (2 * q ** ((n + 1) ** 2)) / (1 - q ** (2 * n + 3)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  zRadians: 0,
  realNome: 0.1,
  positiveSeriesTerms: 2,
} satisfies Input;
export const exampleOutput = {
  jacobiTheta3Value: 1.2002,
  absoluteTruncationTailBound: 2.000000200000021e-9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/theta-jacobi-approx",
  title: "Jacobi Theta Approximation",
  description:
    "Evaluate specifically real Jacobi θ3(z,q)=1+2Σ q^(n²)cos(2nz) with a geometric upper tail bound; theta index/real-nome convention explicit, not all theta functions or complex continuation.",
  inputs: inputFields,
  outputs: [
    { id: "jacobiTheta3Value", label: "Jacobi theta3 value", kind: "number" },
    {
      id: "absoluteTruncationTailBound",
      label: "Absolute truncation tail bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      zRadians: value.zRadians as number,
      realNome: value.realNome as number,
      positiveSeriesTerms: value.positiveSeriesTerms as number,
    }),
});
export const run = tool.execute;
export default tool;
