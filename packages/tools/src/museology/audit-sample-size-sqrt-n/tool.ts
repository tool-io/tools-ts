import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, safeCeil } from "../shared.js";
export type Input = Readonly<{
  readonly populationRecordCount: number;
  readonly callerSqrtSamplingMultiplier: number;
  readonly callerMinimumSampleCount: number;
}>;
export type Output = Readonly<{
  readonly sqrtHeuristicSampleCount: number;
  readonly boundedCallerSampleCount: number;
  readonly samplingFraction: number;
}>;
const inputFields = [
  {
    id: "populationRecordCount",
    label: "Population record count",
    kind: "integer",
  },
  {
    id: "callerSqrtSamplingMultiplier",
    label: "Caller sqrt sampling multiplier",
    kind: "number",
  },
  {
    id: "callerMinimumSampleCount",
    label: "Caller minimum sample count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.populationRecordCount, "populationRecordCount");
  positive(input.callerSqrtSamplingMultiplier, "callerSqrtSamplingMultiplier");
  count(input.populationRecordCount, "populationRecordCount");
  count(input.callerMinimumSampleCount, "callerMinimumSampleCount");
  const raw = safeCeil(
      Math.sqrt(input.populationRecordCount) *
        input.callerSqrtSamplingMultiplier,
      "sample",
    ),
    n = Math.min(
      input.populationRecordCount,
      Math.max(raw, input.callerMinimumSampleCount),
    );
  return {
    sqrtHeuristicSampleCount: raw,
    boundedCallerSampleCount: n,
    samplingFraction: n / input.populationRecordCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  populationRecordCount: 100,
  callerSqrtSamplingMultiplier: 1,
  callerMinimumSampleCount: 20,
} satisfies Input;
export const exampleOutput = {
  sqrtHeuristicSampleCount: 10,
  boundedCallerSampleCount: 20,
  samplingFraction: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/audit-sample-size-sqrt-n",
  title: "Audit Sampling Square Root N Sample Size Calculator",
  description:
    "Expose caller square-root audit heuristic plus minimum/population cap; no statistical confidence, representativeness or error-detection assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "sqrtHeuristicSampleCount",
      label: "Sqrt heuristic sample count",
      kind: "number",
    },
    {
      id: "boundedCallerSampleCount",
      label: "Bounded caller sample count",
      kind: "number",
    },
    { id: "samplingFraction", label: "Sampling fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      populationRecordCount: value.populationRecordCount as number,
      callerSqrtSamplingMultiplier:
        value.callerSqrtSamplingMultiplier as number,
      callerMinimumSampleCount: value.callerMinimumSampleCount as number,
    }),
});
export const run = tool.execute;
export default tool;
