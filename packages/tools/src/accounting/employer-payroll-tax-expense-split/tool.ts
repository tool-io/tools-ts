import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
  aligned,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly employeeCurrentWagesMinor: readonly number[];
  readonly employeePriorYearWagesMinor: readonly number[];
  readonly callerTaxWageCapsMinor: readonly number[];
  readonly callerEmployerTaxBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly employerTaxByEmployeeMinor: readonly number[];
  readonly employerTaxByTaxMinor: readonly number[];
  readonly totalEmployerPayrollTaxMinor: number;
}>;
const inputFields = [
  {
    id: "employeeCurrentWagesMinor",
    label: "Employee current wages minor",
    kind: "numberList",
  },
  {
    id: "employeePriorYearWagesMinor",
    label: "Employee prior year wages minor",
    kind: "numberList",
  },
  {
    id: "callerTaxWageCapsMinor",
    label: "Caller tax wage caps minor",
    kind: "numberList",
  },
  {
    id: "callerEmployerTaxBasisPoints",
    label: "Caller employer tax basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.employeeCurrentWagesMinor.forEach((v) =>
    money(v, "employeeCurrentWagesMinor"),
  );
  input.employeePriorYearWagesMinor.forEach((v) =>
    money(v, "employeePriorYearWagesMinor"),
  );
  input.callerTaxWageCapsMinor.forEach((v) =>
    money(v, "callerTaxWageCapsMinor"),
  );
  aligned(
    input.employeeCurrentWagesMinor,
    input.employeePriorYearWagesMinor,
    "employeeCurrentWagesMinor",
  );
  aligned(
    input.callerTaxWageCapsMinor,
    input.callerEmployerTaxBasisPoints,
    "callerTaxWageCapsMinor",
  );
  input.callerEmployerTaxBasisPoints.forEach((v) =>
    bounded(v, "rate", 0, 10000),
  );
  const rows = input.employeeCurrentWagesMinor.map((w, i) =>
      input.callerTaxWageCapsMinor.map((cap, j) =>
        weightedMinor(
          Math.min(w, Math.max(0, cap - input.employeePriorYearWagesMinor[i])),
          input.callerEmployerTaxBasisPoints[j],
          10000,
        ),
      ),
    ),
    byEmployee = rows.map(sumMoney),
    byTax = input.callerTaxWageCapsMinor.map((_, j) =>
      sumMoney(rows.map((r) => r[j])),
    );
  return {
    employerTaxByEmployeeMinor: byEmployee,
    employerTaxByTaxMinor: byTax,
    totalEmployerPayrollTaxMinor: sumMoney(byEmployee),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  employeeCurrentWagesMinor: [1000, 2000],
  employeePriorYearWagesMinor: [9000, 0],
  callerTaxWageCapsMinor: [10000, 20000],
  callerEmployerTaxBasisPoints: [100, 200],
} satisfies Input;
export const exampleOutput = {
  employerTaxByEmployeeMinor: [30, 60],
  employerTaxByTaxMinor: [30, 60],
  totalEmployerPayrollTaxMinor: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/employer-payroll-tax-expense-split",
  title: "Employer Payroll Tax Expense Split Generator",
  description:
    "Apply caller employer-only tax basis points and annual wage caps to actual worker current/prior wages with per-worker/tax half-up rounding; no embedded jurisdiction rates, employee withholding or eligibility determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "employerTaxByEmployeeMinor",
      label: "Employer tax by employee minor",
      kind: "numberList",
    },
    {
      id: "employerTaxByTaxMinor",
      label: "Employer tax by tax minor",
      kind: "numberList",
    },
    {
      id: "totalEmployerPayrollTaxMinor",
      label: "Total employer payroll tax minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      employeeCurrentWagesMinor:
        value.employeeCurrentWagesMinor as readonly number[],
      employeePriorYearWagesMinor:
        value.employeePriorYearWagesMinor as readonly number[],
      callerTaxWageCapsMinor: value.callerTaxWageCapsMinor as readonly number[],
      callerEmployerTaxBasisPoints:
        value.callerEmployerTaxBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
