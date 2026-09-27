import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ exactInterest: number; priorCarry: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "exactInterest", label: "Exact interest", kind: "number" },
  { id: "priorCarry", label: "Prior carry", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const exact = i.exactInterest + i.priorCarry;
  H.check(exact >= 0 && exact <= 1e9);
  const charged = Math.floor(exact * 100 + 0.5) / 100;
  return H.finish({ chargedInterest: charged, carry: exact - charged });
};
export const example = {
  input: { exactInterest: 1.234, priorCarry: 0.002 },
  output: { result: { chargedInterest: 1.24, carry: -0.004 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/loan-rounding-interest-carry-cent",
  title: "Finance: Loan Rounding Interest Carry Cent Tool",
  description:
    "Carry sub-cent rounding residual between explicit interest amounts with half-up rounding to cents for nonnegative totals; no amortization schedule or bank policy inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          carry: { type: "number" },
          chargedInterest: { type: "number" },
        },
        required: ["carry", "chargedInterest"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
