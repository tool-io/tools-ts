import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly netIncome: number;
  readonly operatingCashFlow: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "netIncome", label: "Net income", kind: "number" },
  { id: "operatingCashFlow", label: "Operating cash flow", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (i.operatingCashFlow === 0)
    simpleError("cash", "Nonzero operating cash flow.");
  return {
    signedAccrualToCashRatio:
      (i.netIncome - i.operatingCashFlow) / i.operatingCashFlow,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { netIncome: 100, operatingCashFlow: 80 },
  output: { result: { signedAccrualToCashRatio: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/quality-of-earnings-accruals-to-cash-ratio",
  title: "Quality Of Earnings Accruals To Cash Ratio Calculator",
  description:
    "Signed accrual difference divided by observed operating cash flow; zero cash rejected, no universal earnings-quality judgment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedAccrualToCashRatio: { type: "number" } },
        required: ["signedAccrualToCashRatio"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
