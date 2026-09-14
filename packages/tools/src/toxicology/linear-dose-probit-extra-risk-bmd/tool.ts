import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, probitBenchmark } from "../shared.js";
export type Input = Readonly<{
  readonly intercept: number;
  readonly slope: number;
  readonly benchmarkExtraRisk: number;
}>;
export type Output = Readonly<{
  readonly benchmarkDose: number;
  readonly targetResponseProbability: number;
}>;
const inputFields = [
  { id: "intercept", label: "Intercept", kind: "number" },
  { id: "slope", label: "Slope", kind: "number" },
  { id: "benchmarkExtraRisk", label: "Benchmark extra risk", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const value = probitBenchmark(
    input.intercept,
    input.slope,
    input.benchmarkExtraRisk,
  );
  return {
    benchmarkDose: value.dose,
    targetResponseProbability: value.targetProbability,
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
} satisfies Input;
export const exampleOutput = {
  benchmarkDose: 0.6744897502234195,
  targetResponseProbability: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/linear-dose-probit-extra-risk-bmd",
  title: "Benchmark Dose Probit",
  description:
    "Invert p(d)=Φ(a+b·d) for a supplied extra-risk benchmark relative to p(0)=Φ(a); linear-dose probit is distinct from existing log-dose probit-5 LD50.",
  inputs: inputFields,
  outputs: [
    { id: "benchmarkDose", label: "Benchmark dose", kind: "number" },
    {
      id: "targetResponseProbability",
      label: "Target response probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intercept: value.intercept as number,
      slope: value.slope as number,
      benchmarkExtraRisk: value.benchmarkExtraRisk as number,
    }),
});
export const run = tool.execute;
export default tool;
