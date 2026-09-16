import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  sheetWidth: number;
  panels: number;
  inset: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sheetWidth", kind: "number", label: "sheetWidth" },
  { id: "panels", kind: "integer", label: "panels" },
  { id: "inset", kind: "number", label: "inset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.sheetWidth);
  H.int(i.panels, 2, 128);
  H.check(i.inset >= 0 && i.inset < i.sheetWidth);
  const main = (i.sheetWidth + i.inset) / i.panels;
  H.check(main > i.inset);
  return H.finish({
    widths: Array.from({ length: i.panels }, (_, j) =>
      j === i.panels - 1 ? main - i.inset : main,
    ),
  });
};
export const example = {
  input: { sheetWidth: 299, panels: 3, inset: 1 },
  output: { result: { widths: [100, 100, 99] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-fold-panel-widths",
  title: "Print Fold Panel Widths",
  description:
    "Allocate an explicit sheet width to equal fold panels except one tucked final panel shortened by the supplied inset; no paper-thickness model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
