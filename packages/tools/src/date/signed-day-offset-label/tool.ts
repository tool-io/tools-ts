import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ days: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "days", label: "Days", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.days, -1000000, 1000000);
  return H.finish({
    label: i.days === 0 ? "same-day" : i.days > 0 ? "after" : "before",
    magnitudeDays: Math.abs(i.days),
  });
};
export const example = {
  input: { days: -2 },
  output: { result: { label: "before", magnitudeDays: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/signed-day-offset-label",
  title: "Date: Signed Day Offset Label Tool",
  description:
    "Label a resolved signed calendar-day offset and retain its magnitude without implying business-day or timezone rules.",
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
          label: { type: "string" },
          magnitudeDays: { type: "number" },
        },
        required: ["label", "magnitudeDays"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
