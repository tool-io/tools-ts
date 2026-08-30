import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly classCodes: readonly string[];
  readonly classPayrolls: readonly number[];
  readonly minimumPayrollDifference: number;
}>;
export type Output = Readonly<{
  readonly governingClassCode: string;
  readonly governingClassPayroll: number;
  readonly secondHighestPayroll: number;
  readonly payrollMargin: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.classCodes.length;
  if (
    n === 0 ||
    input.classPayrolls.length !== n ||
    input.classPayrolls.some((value) => value < 0)
  )
    simpleError(
      "classCodes",
      "Aligned class codes and nonnegative payrolls are required.",
      "invalid_classes",
    );
  const order = input.classPayrolls
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value),
    top = order[0],
    secondHighestPayroll = order[1]?.value ?? 0,
    payrollMargin = top.value - secondHighestPayroll;
  if (payrollMargin < input.minimumPayrollDifference)
    simpleError(
      "minimumPayrollDifference",
      "Top class does not exceed the runner-up by the required margin.",
      "ambiguous_governing_class",
    );
  return {
    governingClassCode: input.classCodes[top.index],
    governingClassPayroll: top.value,
    secondHighestPayroll,
    payrollMargin,
  };
};

export const exampleInput = {
  classCodes: ["A", "B", "C"],
  classPayrolls: [100, 300, 150],
  minimumPayrollDifference: 50,
} satisfies Input;
export const exampleOutput = {
  governingClassCode: "B",
  governingClassPayroll: 300,
  secondHighestPayroll: 150,
  payrollMargin: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      classCodes: input.classCodes as readonly string[],
      classPayrolls: input.classPayrolls as readonly number[],
      minimumPayrollDifference: input.minimumPayrollDifference as number,
    }),
  description:
    "Select a governing workers compensation class from payroll totals.",
  id: "insurance/governing-payroll-class",
  inputs: [
    {
      id: "classCodes",
      label: "Workers compensation class codes",
      kind: "stringList",
    },
    { id: "classPayrolls", label: "Payroll by class", kind: "numberList" },
    {
      id: "minimumPayrollDifference",
      label: "Minimum governing-class difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "governingClassCode", label: "Governing class code", kind: "string" },
    {
      id: "governingClassPayroll",
      label: "Governing class payroll",
      kind: "number",
      minimum: 0,
    },
    {
      id: "secondHighestPayroll",
      label: "Second-highest payroll",
      kind: "number",
      minimum: 0,
    },
    {
      id: "payrollMargin",
      label: "Governing payroll margin",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Governing Payroll Class",
});

export const run = tool.execute;
export default tool;
