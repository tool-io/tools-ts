import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ invoiceDate: string; discountDays: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "invoiceDate", label: "Invoice date", kind: "string" },
  { id: "discountDays", label: "Discount days", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.discountDays, 0, 3650);
  return H.finish({
    discountDeadline: H.addDays(i.invoiceDate, i.discountDays),
  });
};
export const example = {
  input: { invoiceDate: "2024-02-28", discountDays: 2 },
  output: { result: { discountDeadline: "2024-03-01" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/cash-discount-deadline-date-offset",
  title: "Finance: Cash Discount Deadline Date Offset Tool",
  description:
    "Resolve a calendar-day cash-discount deadline excluding the invoice day, without business-day adjustment or legal payment advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { discountDeadline: { type: "string" } },
        required: ["discountDeadline"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
