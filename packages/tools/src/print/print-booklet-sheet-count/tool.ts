import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ pages: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pages", kind: "integer", label: "pages" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.pages);
  return H.finish({
    sheets: Math.ceil(i.pages / 4),
    pageSlots: Math.ceil(i.pages / 4) * 4,
  });
};
export const example = {
  input: { pages: 9 },
  output: { result: { sheets: 3, pageSlots: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-booklet-sheet-count",
  title: "Print Booklet Sheet Count",
  description:
    "Count simple four-page folded booklet sheets and resulting slots; assumes one folio per sheet, no press imposition.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
