import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly baseCallerGrade: number;
  readonly independentlyAssessedDeductions: readonly number[];
  readonly callerFloor: number;
}>;
export type Output = Readonly<{
  readonly adjustedCallerGrade: number;
  readonly unclippedCallerGrade: number;
}>;
const inputFields = [
  { id: "baseCallerGrade", label: "Base caller grade", kind: "number" },
  {
    id: "independentlyAssessedDeductions",
    label: "Independently assessed deductions",
    kind: "numberList",
  },
  { id: "callerFloor", label: "Caller floor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.baseCallerGrade, "baseCallerGrade");
  input.independentlyAssessedDeductions.forEach((v) =>
    nonnegative(v, "independentlyAssessedDeductions"),
  );
  nonnegative(input.callerFloor, "callerFloor");
  if (input.callerFloor > input.baseCallerGrade)
    simpleError("floor", "Floor cannot exceed initial grade.");
  return {
    adjustedCallerGrade: Math.max(
      input.callerFloor,
      input.baseCallerGrade - sum(input.independentlyAssessedDeductions),
    ),
    unclippedCallerGrade:
      input.baseCallerGrade - sum(input.independentlyAssessedDeductions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseCallerGrade: 90,
  independentlyAssessedDeductions: [3, 5],
  callerFloor: 10,
} satisfies Input;
export const exampleOutput = {
  adjustedCallerGrade: 82,
  unclippedCallerGrade: 82,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/fault-composite-grade-adjuster",
  title: "Face-Free Fault Composite Grade Adjuster",
  description:
    "Subtract explicit independently non-overlapping fault deductions, retaining unclipped grade and caller floor. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjustedCallerGrade",
      label: "Adjusted caller grade",
      kind: "number",
    },
    {
      id: "unclippedCallerGrade",
      label: "Unclipped caller grade",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      baseCallerGrade: value.baseCallerGrade as number,
      independentlyAssessedDeductions:
        value.independentlyAssessedDeductions as readonly number[],
      callerFloor: value.callerFloor as number,
    }),
});
export const run = tool.execute;
export default tool;
