import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ leaf: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leaf", kind: "integer", label: "leaf" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.leaf, 1);
  return H.finish({ frontPage: 2 * i.leaf - 1, backPage: 2 * i.leaf });
};
export const example = {
  input: { leaf: 3 },
  output: { result: { frontPage: 5, backPage: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-duplex-leaf-page-mapping",
  title: "Print Duplex Leaf Page Mapping",
  description:
    "Map a positive one-based duplex leaf to sequential recto and verso page numbers, not booklet imposition order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
