import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly requiredCheckWeights: readonly number[];
  readonly completedCheckFlags: readonly number[];
  readonly notApplicableCheckFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly applicableCheckCount: number;
  readonly applicableWeightedCompletionPercent: number;
  readonly uncompletedApplicableCheckIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "requiredCheckWeights",
    label: "Required check weights",
    kind: "numberList",
  },
  {
    id: "completedCheckFlags",
    label: "Completed check flags",
    kind: "numberList",
  },
  {
    id: "notApplicableCheckFlags",
    label: "Not applicable check flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.requiredCheckWeights.forEach((v) =>
    positive(v, "requiredCheckWeights"),
  );
  aligned(
    input.requiredCheckWeights,
    input.completedCheckFlags,
    "requiredCheckWeights",
  );
  aligned(
    input.requiredCheckWeights,
    input.notApplicableCheckFlags,
    "requiredCheckWeights",
  );
  binary(input.completedCheckFlags, "completed");
  binary(input.notApplicableCheckFlags, "notApplicable");
  const weights = input.requiredCheckWeights.map((v, i) =>
      input.notApplicableCheckFlags[i] ? 0 : v,
    ),
    den = positive(sum(weights), "applicableChecks");
  return {
    applicableCheckCount: input.notApplicableCheckFlags.filter((v) => v === 0)
      .length,
    applicableWeightedCompletionPercent:
      (100 *
        input.completedCheckFlags.reduce((s, v, i) => s + v * weights[i], 0)) /
      den,
    uncompletedApplicableCheckIndices: weights.flatMap((v, i) =>
      v && !input.completedCheckFlags[i] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredCheckWeights: [1, 2, 3],
  completedCheckFlags: [1, 0, 1],
  notApplicableCheckFlags: [0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  applicableCheckCount: 2,
  applicableWeightedCompletionPercent: 100,
  uncompletedApplicableCheckIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/preloan-condition-completion-percent",
  title: "Pre-Loan Condition Check Completion Percent Calculator",
  description:
    "Audit applicable pre-loan condition checks with explicit exclusions/weights and unresolved indices; no assertion that a completed checklist makes a loan safe.",
  inputs: inputFields,
  outputs: [
    {
      id: "applicableCheckCount",
      label: "Applicable check count",
      kind: "number",
    },
    {
      id: "applicableWeightedCompletionPercent",
      label: "Applicable weighted completion percent",
      kind: "number",
    },
    {
      id: "uncompletedApplicableCheckIndices",
      label: "Uncompleted applicable check indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredCheckWeights: value.requiredCheckWeights as readonly number[],
      completedCheckFlags: value.completedCheckFlags as readonly number[],
      notApplicableCheckFlags:
        value.notApplicableCheckFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
