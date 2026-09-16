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
  const padded = Math.ceil(i.pages / 4) * 4;
  return H.finish({ blankPages: padded - i.pages, paddedPages: padded });
};
export const example = {
  input: { pages: 9 },
  output: { result: { blankPages: 3, paddedPages: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-booklet-blank-page-budget",
  title: "Print Booklet Blank Page Budget",
  description:
    "Budget blank pages to the next multiple of four for a simple saddle-stitched booklet; no signature layout or binding thickness.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
