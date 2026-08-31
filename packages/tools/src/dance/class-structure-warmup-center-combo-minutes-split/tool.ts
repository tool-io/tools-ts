import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
  weights,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerClassSectionIds: readonly string[];
  readonly callerSectionAllocationWeights: readonly number[];
  readonly availableClassMinutes: number;
  readonly plannedTransitionMinutes: number;
}>;
export type Output = Readonly<{
  readonly plannedSectionMinutes: readonly number[];
  readonly plannedActiveClassMinutes: number;
  readonly totalClassMinutesIncludingTransitions: number;
}>;
const inputFields = [
  {
    id: "callerClassSectionIds",
    label: "Caller class section ids",
    kind: "stringList",
  },
  {
    id: "callerSectionAllocationWeights",
    label: "Caller section allocation weights",
    kind: "numberList",
  },
  {
    id: "availableClassMinutes",
    label: "Available class minutes",
    kind: "number",
  },
  {
    id: "plannedTransitionMinutes",
    label: "Planned transition minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSectionAllocationWeights.forEach((v) =>
    nonnegative(v, "callerSectionAllocationWeights"),
  );
  nonnegative(input.availableClassMinutes, "availableClassMinutes");
  nonnegative(input.plannedTransitionMinutes, "plannedTransitionMinutes");
  aligned(
    input.callerClassSectionIds,
    input.callerSectionAllocationWeights,
    "callerClassSectionIds",
  );
  unique(input.callerClassSectionIds, "sections");
  if (input.plannedTransitionMinutes > input.availableClassMinutes)
    simpleError("minutes", "Transitions exceed available class time.");
  const active = input.availableClassMinutes - input.plannedTransitionMinutes,
    w = weights(input.callerSectionAllocationWeights);
  return {
    plannedSectionMinutes: w.map((v) => v * active),
    plannedActiveClassMinutes: active,
    totalClassMinutesIncludingTransitions: input.availableClassMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerClassSectionIds: ["warmup", "center", "combo"],
  callerSectionAllocationWeights: [1, 2, 3],
  availableClassMinutes: 60,
  plannedTransitionMinutes: 6,
} satisfies Input;
export const exampleOutput = {
  plannedSectionMinutes: [9, 18, 27],
  plannedActiveClassMinutes: 54,
  totalClassMinutesIncludingTransitions: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/class-structure-warmup-center-combo-minutes-split",
  title: "Class Structure Warmup Center Combo Minutes Split",
  description:
    "Allocate actual caller class-section weights after separately budgeted transitions; no universal warmup percentage, exercise prescription or physiological readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedSectionMinutes",
      label: "Planned section minutes",
      kind: "numberList",
    },
    {
      id: "plannedActiveClassMinutes",
      label: "Planned active class minutes",
      kind: "number",
    },
    {
      id: "totalClassMinutesIncludingTransitions",
      label: "Total class minutes including transitions",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerClassSectionIds: value.callerClassSectionIds as readonly string[],
      callerSectionAllocationWeights:
        value.callerSectionAllocationWeights as readonly number[],
      availableClassMinutes: value.availableClassMinutes as number,
      plannedTransitionMinutes: value.plannedTransitionMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
