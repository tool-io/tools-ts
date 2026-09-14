import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  probitBenchmark,
  covariance2,
} from "../shared.js";
export type Input = Readonly<{
  readonly intercept: number;
  readonly slope: number;
  readonly benchmarkExtraRisk: number;
  readonly parameterCovariance: readonly (readonly number[])[];
  readonly oneSidedCriticalZ: number;
}>;
export type Output = Readonly<{
  readonly estimatedBenchmarkDose: number;
  readonly doseStandardError: number;
  readonly approximateLowerBenchmarkDose: number;
}>;
const inputFields = [
  { id: "intercept", label: "Intercept", kind: "number" },
  { id: "slope", label: "Slope", kind: "number" },
  { id: "benchmarkExtraRisk", label: "Benchmark extra risk", kind: "number" },
  { id: "parameterCovariance", label: "Parameter covariance", kind: "matrix" },
  { id: "oneSidedCriticalZ", label: "One sided critical z", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  covariance2(input.parameterCovariance);
  positive(input.oneSidedCriticalZ, "oneSidedCriticalZ");
  const estimate = probitBenchmark(
      input.intercept,
      input.slope,
      input.benchmarkExtraRisk,
    ),
    g = estimate.gradient,
    m = input.parameterCovariance,
    v = g[0] ** 2 * m[0][0] + 2 * g[0] * g[1] * m[0][1] + g[1] ** 2 * m[1][1],
    doseStandardError = Math.sqrt(nonnegative(v, "parameterCovariance"));
  return {
    estimatedBenchmarkDose: estimate.dose,
    doseStandardError,
    approximateLowerBenchmarkDose:
      estimate.dose *
      Math.exp((-input.oneSidedCriticalZ * doseStandardError) / estimate.dose),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intercept: 0,
  slope: 1,
  benchmarkExtraRisk: 0.5,
  parameterCovariance: [
    [0.01, 0],
    [0, 0.01],
  ],
  oneSidedCriticalZ: 1.645,
} satisfies Input;
export const exampleOutput = {
  estimatedBenchmarkDose: 0.6744897502234195,
  doseStandardError: 0.07704136462325434,
  approximateLowerBenchmarkDose: 0.5589509850534436,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/delta-log-probit-bmd-lower-bound",
  title: "BMDL",
  description:
    "Propagate supplied linear-dose probit parameter covariance through extra-risk BMD and a log-delta lower bound; approximate, not a likelihood-profile BMDL or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedBenchmarkDose",
      label: "Estimated benchmark dose",
      kind: "number",
    },
    { id: "doseStandardError", label: "Dose standard error", kind: "number" },
    {
      id: "approximateLowerBenchmarkDose",
      label: "Approximate lower benchmark dose",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intercept: value.intercept as number,
      slope: value.slope as number,
      benchmarkExtraRisk: value.benchmarkExtraRisk as number,
      parameterCovariance:
        value.parameterCovariance as readonly (readonly number[])[],
      oneSidedCriticalZ: value.oneSidedCriticalZ as number,
    }),
});
export const run = tool.execute;
export default tool;
