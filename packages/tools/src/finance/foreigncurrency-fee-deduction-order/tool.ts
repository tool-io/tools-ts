import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  grossForeignAmount: number;
  fxRate: number;
  fixedFee: number;
  feeCurrency: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "grossForeignAmount", label: "Gross foreign amount", kind: "number" },
  { id: "fxRate", label: "Fx rate", kind: "number" },
  { id: "fixedFee", label: "Fixed fee", kind: "number" },
  {
    id: "feeCurrency",
    label: "Fee currency",
    kind: "string",
    enum: ["foreign", "domestic"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.grossForeignAmount >= 0 && i.fixedFee >= 0);
  H.positive(i.fxRate);
  H.choice(i.feeCurrency, ["foreign", "domestic"]);
  H.check(i.feeCurrency !== "foreign" || i.fixedFee <= i.grossForeignAmount);
  return H.finish({
    netDomesticAmount:
      i.feeCurrency === "foreign"
        ? (i.grossForeignAmount - i.fixedFee) * i.fxRate
        : i.grossForeignAmount * i.fxRate - i.fixedFee,
  });
};
export const example = {
  input: {
    grossForeignAmount: 100,
    fxRate: 2,
    fixedFee: 10,
    feeCurrency: "foreign",
  },
  output: { result: { netDomesticAmount: 180 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/foreigncurrency-fee-deduction-order",
  title: "Finance: Foreigncurrency Fee Deduction Order Tool",
  description:
    "Compute a single FX cash conversion with an explicitly denominated fixed fee, exposing before/after conversion ordering; no market quote or exchange recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { netDomesticAmount: { type: "number" } },
        required: ["netDomesticAmount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
