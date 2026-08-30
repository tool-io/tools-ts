import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalExpenses: number;
  readonly programServiceExpenses: number;
  readonly executiveCompensation: number;
}>;
export type Output = Readonly<{
  readonly programExpensePercent: number;
  readonly executiveCompensationPercent: number;
  readonly otherExpenseAmount: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.totalExpenses <= 0)
    simpleError(
      "totalExpenses",
      "Total expenses must be positive.",
      "invalid_total",
    );
  if (
    input.programServiceExpenses + input.executiveCompensation >
    input.totalExpenses
  )
    simpleError(
      "programServiceExpenses",
      "Components cannot exceed total expenses.",
      "components_exceed_total",
    );
  return {
    programExpensePercent:
      (input.programServiceExpenses / input.totalExpenses) * 100,
    executiveCompensationPercent:
      (input.executiveCompensation / input.totalExpenses) * 100,
    otherExpenseAmount:
      input.totalExpenses -
      input.programServiceExpenses -
      input.executiveCompensation,
  };
};

export const exampleInput = {
  totalExpenses: 1000000,
  programServiceExpenses: 750000,
  executiveCompensation: 100000,
} satisfies Input;
export const exampleOutput = {
  programExpensePercent: 75,
  executiveCompensationPercent: 10,
  otherExpenseAmount: 150000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalExpenses: input.totalExpenses as number,
      programServiceExpenses: input.programServiceExpenses as number,
      executiveCompensation: input.executiveCompensation as number,
    }),
  description:
    "Calculate program-service and executive-compensation ratios from supplied nonprofit expense figures.",
  id: "journalism/nonprofit-compensation-ratios",
  inputs: [
    {
      id: "totalExpenses",
      label: "Total expenses",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "programServiceExpenses",
      label: "Program-service expenses",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "executiveCompensation",
      label: "Executive compensation",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "programExpensePercent",
      label: "Program expense ratio",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "executiveCompensationPercent",
      label: "Executive compensation ratio",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "otherExpenseAmount",
      label: "Other expenses",
      kind: "number",
      unit: "currency",
    },
  ],
  title: "Nonprofit Compensation Ratios",
});

export const run = tool.execute;
export default tool;
