import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  rateMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly ownerAvailableCashMinor: number;
  readonly callerIndependentReasonableSalaryMinor: number;
  readonly callerEmployerPayrollBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly employerPayrollMinor: number;
  readonly remainingDistributionCashMinor: number;
}>;
const inputFields = [
  {
    id: "ownerAvailableCashMinor",
    label: "Owner available cash minor",
    kind: "number",
  },
  {
    id: "callerIndependentReasonableSalaryMinor",
    label: "Caller independent reasonable salary minor",
    kind: "number",
  },
  {
    id: "callerEmployerPayrollBasisPoints",
    label: "Caller employer payroll basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.ownerAvailableCashMinor, "ownerAvailableCashMinor");
  money(
    input.callerIndependentReasonableSalaryMinor,
    "callerIndependentReasonableSalaryMinor",
  );
  const p = rateMinor(
      input.callerIndependentReasonableSalaryMinor,
      input.callerEmployerPayrollBasisPoints,
    ),
    used = sumMoney([input.callerIndependentReasonableSalaryMinor, p]);
  if (used > input.ownerAvailableCashMinor)
    simpleError("cash", "Salary plus employer payroll exceeds available cash.");
  return {
    employerPayrollMinor: p,
    remainingDistributionCashMinor: input.ownerAvailableCashMinor - used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ownerAvailableCashMinor: 100,
  callerIndependentReasonableSalaryMinor: 60,
  callerEmployerPayrollBasisPoints: 1000,
} satisfies Input;
export const exampleOutput = {
  employerPayrollMinor: 6,
  remainingDistributionCashMinor: 34,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/s-corp-salary-vs-distribution-split-model",
  title: "S Corp Salary vs Distribution Split Model Tool",
  description:
    "S-corp salary/payroll/distribution cash allocation using independently reasonable salary, not salary-minimization optimization or tax compliance. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "employerPayrollMinor",
      label: "Employer payroll minor",
      kind: "number",
    },
    {
      id: "remainingDistributionCashMinor",
      label: "Remaining distribution cash minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ownerAvailableCashMinor: value.ownerAvailableCashMinor as number,
      callerIndependentReasonableSalaryMinor:
        value.callerIndependentReasonableSalaryMinor as number,
      callerEmployerPayrollBasisPoints:
        value.callerEmployerPayrollBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
