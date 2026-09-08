import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, rateMinor } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly priorSubjectWagesMinor: number;
  readonly currentSubjectWagesMinor: number;
  readonly callerApplicableWageBaseMinor: number;
  readonly callerSsPayrollBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly currentCappedSubjectWagesMinor: number;
  readonly conditionalCurrentPayrollMinor: number;
}>;
const inputFields = [
  {
    id: "priorSubjectWagesMinor",
    label: "Prior subject wages minor",
    kind: "number",
  },
  {
    id: "currentSubjectWagesMinor",
    label: "Current subject wages minor",
    kind: "number",
  },
  {
    id: "callerApplicableWageBaseMinor",
    label: "Caller applicable wage base minor",
    kind: "number",
  },
  {
    id: "callerSsPayrollBasisPoints",
    label: "Caller ss payroll basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.priorSubjectWagesMinor, "priorSubjectWagesMinor");
  money(input.currentSubjectWagesMinor, "currentSubjectWagesMinor");
  money(input.callerApplicableWageBaseMinor, "callerApplicableWageBaseMinor");
  const s = Math.min(
    input.currentSubjectWagesMinor,
    Math.max(
      0,
      input.callerApplicableWageBaseMinor - input.priorSubjectWagesMinor,
    ),
  );
  return {
    currentCappedSubjectWagesMinor: s,
    conditionalCurrentPayrollMinor: rateMinor(
      s,
      input.callerSsPayrollBasisPoints,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  priorSubjectWagesMinor: 80,
  currentSubjectWagesMinor: 100,
  callerApplicableWageBaseMinor: 150,
  callerSsPayrollBasisPoints: 620,
} satisfies Input;
export const exampleOutput = {
  currentCappedSubjectWagesMinor: 70,
  conditionalCurrentPayrollMinor: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/payroll-social-security-wage-base-cap",
  title: "Payroll Social Security Wage Base Cap Tool",
  description:
    "Sequential payroll SS wage-cap allocation using prior subject wages, distinct from SE earnings shared-wage base and Medicare. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "currentCappedSubjectWagesMinor",
      label: "Current capped subject wages minor",
      kind: "number",
    },
    {
      id: "conditionalCurrentPayrollMinor",
      label: "Conditional current payroll minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorSubjectWagesMinor: value.priorSubjectWagesMinor as number,
      currentSubjectWagesMinor: value.currentSubjectWagesMinor as number,
      callerApplicableWageBaseMinor:
        value.callerApplicableWageBaseMinor as number,
      callerSsPayrollBasisPoints: value.callerSsPayrollBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
