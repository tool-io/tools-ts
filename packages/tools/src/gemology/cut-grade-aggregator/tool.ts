import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly callerComponentScores: readonly number[];
  readonly callerComponentWeights: readonly number[];
  readonly callerMandatoryComponentMinimums: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedCutAssessmentScore: number;
  readonly mandatoryComponentShortfallFlags: readonly number[];
  readonly allCallerMandatoryCriteriaMet: boolean;
}>;
const inputFields = [
  {
    id: "callerComponentScores",
    label: "Caller component scores",
    kind: "numberList",
  },
  {
    id: "callerComponentWeights",
    label: "Caller component weights",
    kind: "numberList",
  },
  {
    id: "callerMandatoryComponentMinimums",
    label: "Caller mandatory component minimums",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerComponentWeights.forEach((v) =>
    positive(v, "callerComponentWeights"),
  );
  input.callerComponentScores.forEach((v) =>
    fraction(v, "callerComponentScores"),
  );
  input.callerMandatoryComponentMinimums.forEach((v) =>
    fraction(v, "callerMandatoryComponentMinimums"),
  );
  aligned(
    input.callerComponentScores,
    input.callerComponentWeights,
    "callerComponentScores",
  );
  aligned(
    input.callerComponentScores,
    input.callerMandatoryComponentMinimums,
    "callerComponentScores",
  );
  const total = input.callerComponentWeights.reduce((a, b) => a + b, 0),
    mandatoryComponentShortfallFlags = input.callerComponentScores.map(
      (v, i) => (v < input.callerMandatoryComponentMinimums[i] ? 1 : 0),
    );
  return {
    weightedCutAssessmentScore: input.callerComponentScores.reduce(
      (s, v, i) => s + (v * input.callerComponentWeights[i]) / total,
      0,
    ),
    mandatoryComponentShortfallFlags,
    allCallerMandatoryCriteriaMet: mandatoryComponentShortfallFlags.every(
      (v) => v === 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerComponentScores: [0.8, 0.6],
  callerComponentWeights: [1, 3],
  callerMandatoryComponentMinimums: [0.5, 0.7],
} satisfies Input;
export const exampleOutput = {
  weightedCutAssessmentScore: 0.65,
  mandatoryComponentShortfallFlags: [0, 1],
  allCallerMandatoryCriteriaMet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/cut-grade-aggregator",
  title: "Cut Grade Point Aggregator",
  description:
    "Aggregate caller calibrated cut component assessments while separately retaining mandatory-component vetoes; high weighted score does not override failed local criteria or create a laboratory cut grade.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedCutAssessmentScore",
      label: "Weighted cut assessment score",
      kind: "number",
    },
    {
      id: "mandatoryComponentShortfallFlags",
      label: "Mandatory component shortfall flags",
      kind: "numberList",
    },
    {
      id: "allCallerMandatoryCriteriaMet",
      label: "All caller mandatory criteria met",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerComponentScores: value.callerComponentScores as readonly number[],
      callerComponentWeights: value.callerComponentWeights as readonly number[],
      callerMandatoryComponentMinimums:
        value.callerMandatoryComponentMinimums as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
