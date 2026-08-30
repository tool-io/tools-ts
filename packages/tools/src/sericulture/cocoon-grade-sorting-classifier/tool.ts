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
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly shellPercents: readonly number[];
  readonly defectFlags: readonly number[];
  readonly descendingMinimumShellPercents: readonly number[];
  readonly callerGradeCodes: readonly number[];
  readonly rejectGradeCode: number;
}>;
export type Output = Readonly<{
  readonly assignedGradeCodes: readonly number[];
}>;
const inputFields = [
  { id: "shellPercents", label: "Shell percents", kind: "numberList" },
  { id: "defectFlags", label: "Defect flags", kind: "numberList" },
  {
    id: "descendingMinimumShellPercents",
    label: "Descending minimum shell percents",
    kind: "numberList",
  },
  { id: "callerGradeCodes", label: "Caller grade codes", kind: "numberList" },
  { id: "rejectGradeCode", label: "Reject grade code", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.shellPercents.length * input.descendingMinimumShellPercents.length >
    1000000
  )
    simpleError(
      "grades",
      "Classification work exceeds one million comparisons.",
    );
  input.shellPercents.forEach((v) => nonnegative(v, "shellPercents"));
  input.descendingMinimumShellPercents.forEach((v) =>
    nonnegative(v, "descendingMinimumShellPercents"),
  );
  input.defectFlags.forEach((v) => count(v, "defectFlags"));
  input.callerGradeCodes.forEach((v) => count(v, "callerGradeCodes"));
  count(input.rejectGradeCode, "rejectGradeCode");
  aligned(input.shellPercents, input.defectFlags, "shellPercents");
  aligned(
    input.descendingMinimumShellPercents,
    input.callerGradeCodes,
    "descendingMinimumShellPercents",
  );
  if (
    input.descendingMinimumShellPercents.length > 128 ||
    new Set(input.callerGradeCodes).size !== input.callerGradeCodes.length ||
    input.callerGradeCodes.includes(input.rejectGradeCode) ||
    input.defectFlags.some((v) => v !== 0 && v !== 1) ||
    input.shellPercents.some((v) => v > 100) ||
    input.descendingMinimumShellPercents.some(
      (v, i) =>
        v > 100 || (i > 0 && v >= input.descendingMinimumShellPercents[i - 1]),
    )
  )
    simpleError(
      "grades",
      "At most 128 strictly descending percentage thresholds and distinct grade/reject codes required.",
    );
  return {
    assignedGradeCodes: input.shellPercents.map((v, i) => {
      if (input.defectFlags[i]) return input.rejectGradeCode;
      const k = input.descendingMinimumShellPercents.findIndex((t) => v >= t);
      return k < 0 ? input.rejectGradeCode : input.callerGradeCodes[k];
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  shellPercents: [25, 18, 10],
  defectFlags: [0, 0, 1],
  descendingMinimumShellPercents: [20, 15],
  callerGradeCodes: [1, 2],
  rejectGradeCode: 9,
} satisfies Input;
export const exampleOutput = { assignedGradeCodes: [1, 2, 9] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/cocoon-grade-sorting-classifier",
  title: "Cocoon Grade Sorting Classifier",
  description:
    "Classify observed cocoons by a caller descending shell-percent grade schedule with explicit defect/reject codes; no universal trade grade or health certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "assignedGradeCodes",
      label: "Assigned grade codes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      shellPercents: value.shellPercents as readonly number[],
      defectFlags: value.defectFlags as readonly number[],
      descendingMinimumShellPercents:
        value.descendingMinimumShellPercents as readonly number[],
      callerGradeCodes: value.callerGradeCodes as readonly number[],
      rejectGradeCode: value.rejectGradeCode as number,
    }),
});
export const run = tool.execute;
export default tool;
