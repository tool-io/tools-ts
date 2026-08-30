import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly backgroundMean: number;
  readonly exponentialRatePerDose: number;
  readonly benchmarkRelativeChange: number;
}>;
export type Output = Readonly<{
  readonly benchmarkDose: number;
  readonly targetMeanResponse: number;
}>;
const inputFields = [
  { id: "backgroundMean", label: "Background mean", kind: "number" },
  {
    id: "exponentialRatePerDose",
    label: "Exponential rate per dose",
    kind: "number",
  },
  {
    id: "benchmarkRelativeChange",
    label: "Benchmark relative change",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.backgroundMean, "backgroundMean");
  positive(input.exponentialRatePerDose, "exponentialRatePerDose");
  positive(input.benchmarkRelativeChange, "benchmarkRelativeChange");
  return {
    benchmarkDose:
      Math.log1p(input.benchmarkRelativeChange) / input.exponentialRatePerDose,
    targetMeanResponse:
      input.backgroundMean * (1 + input.benchmarkRelativeChange),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  backgroundMean: 10,
  exponentialRatePerDose: 0.1,
  benchmarkRelativeChange: 0.2,
} satisfies Input;
export const exampleOutput = {
  benchmarkDose: 1.8232155679395459,
  targetMeanResponse: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/continuous-exponential-response-bmd",
  title: "Continuous BMD",
  description:
    "Invert a supplied continuous mean model μ(d)=μ0·exp(kd) at a positive relative mean-response change; no dichotomization, parameter fitting or lower confidence bound is invented.",
  inputs: inputFields,
  outputs: [
    { id: "benchmarkDose", label: "Benchmark dose", kind: "number" },
    { id: "targetMeanResponse", label: "Target mean response", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      backgroundMean: value.backgroundMean as number,
      exponentialRatePerDose: value.exponentialRatePerDose as number,
      benchmarkRelativeChange: value.benchmarkRelativeChange as number,
    }),
});
export const run = tool.execute;
export default tool;
