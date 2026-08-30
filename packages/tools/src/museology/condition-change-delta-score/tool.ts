import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly previousAlignedConditionScores: readonly number[];
  readonly currentAlignedConditionScores: readonly number[];
  readonly callerHigherScoresMeanWorse: boolean;
  readonly callerMaterialChangeThreshold: number;
}>;
export type Output = Readonly<{
  readonly signedConditionChanges: readonly number[];
  readonly worseningCriterionFlags: readonly number[];
  readonly improvingCriterionFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "previousAlignedConditionScores",
    label: "Previous aligned condition scores",
    kind: "numberList",
  },
  {
    id: "currentAlignedConditionScores",
    label: "Current aligned condition scores",
    kind: "numberList",
  },
  {
    id: "callerHigherScoresMeanWorse",
    label: "Caller higher scores mean worse",
    kind: "boolean",
  },
  {
    id: "callerMaterialChangeThreshold",
    label: "Caller material change threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaterialChangeThreshold,
    "callerMaterialChangeThreshold",
  );
  aligned(
    input.previousAlignedConditionScores,
    input.currentAlignedConditionScores,
    "previousAlignedConditionScores",
  );
  const d = input.currentAlignedConditionScores.map(
      (v, i) => v - input.previousAlignedConditionScores[i],
    ),
    s = input.callerHigherScoresMeanWorse ? 1 : -1;
  return {
    signedConditionChanges: d,
    worseningCriterionFlags: d.map((v) =>
      s * v > input.callerMaterialChangeThreshold ? 1 : 0,
    ),
    improvingCriterionFlags: d.map((v) =>
      s * v < -input.callerMaterialChangeThreshold ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  previousAlignedConditionScores: [1, 3, 2],
  currentAlignedConditionScores: [2, 3, 1],
  callerHigherScoresMeanWorse: true,
  callerMaterialChangeThreshold: 0,
} satisfies Input;
export const exampleOutput = {
  signedConditionChanges: [1, 0, -1],
  worseningCriterionFlags: [1, 0, 0],
  improvingCriterionFlags: [0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/condition-change-delta-score",
  title: "Condition Change Delta Score Between Reports Calculator",
  description:
    "Compare matched caller condition rubric components with explicit score direction, retaining offsetting improvements/deterioration; no objective damage scale or automatic diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedConditionChanges",
      label: "Signed condition changes",
      kind: "numberList",
    },
    {
      id: "worseningCriterionFlags",
      label: "Worsening criterion flags",
      kind: "numberList",
    },
    {
      id: "improvingCriterionFlags",
      label: "Improving criterion flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      previousAlignedConditionScores:
        value.previousAlignedConditionScores as readonly number[],
      currentAlignedConditionScores:
        value.currentAlignedConditionScores as readonly number[],
      callerHigherScoresMeanWorse: value.callerHigherScoresMeanWorse as boolean,
      callerMaterialChangeThreshold:
        value.callerMaterialChangeThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
