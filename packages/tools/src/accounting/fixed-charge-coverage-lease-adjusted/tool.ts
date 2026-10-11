import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly ebit: number;
  readonly leaseExpense: number;
  readonly interestExpense: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ebit", label: "Ebit", kind: "number" },
  { id: "leaseExpense", label: "Lease expense", kind: "number" },
  { id: "interestExpense", label: "Interest expense", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.leaseExpense, "lease");
  nonnegative(i.interestExpense, "interest");
  positive(i.interestExpense + i.leaseExpense, "charges");
  return {
    coverageRatio:
      (i.ebit + i.leaseExpense) / (i.interestExpense + i.leaseExpense),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { ebit: 100, leaseExpense: 20, interestExpense: 10 },
  output: { result: { coverageRatio: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/fixed-charge-coverage-lease-adjusted",
  title: "Fixed Charge Coverage Lease Adjusted Calculator",
  description:
    "One explicit fixed-charge coverage convention (EBIT+lease expense)/(interest+lease expense); covenant definitions may differ.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { coverageRatio: { type: "number" } },
        required: ["coverageRatio"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
