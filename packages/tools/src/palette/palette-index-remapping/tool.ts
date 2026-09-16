import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  indexes: readonly number[];
  mapping: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "indexes", kind: "numberList", label: "indexes" },
  { id: "mapping", kind: "numberList", label: "mapping" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.mapping.forEach((x) => H.int(x, 0, 127));
  i.indexes.forEach((x) => H.int(x, 0, i.mapping.length - 1));
  return H.finish({ indexes: i.indexes.map((x) => i.mapping[x]) });
};
export const example = {
  input: { indexes: [0, 1, 0], mapping: [2, 0] },
  output: { result: { indexes: [2, 0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-index-remapping",
  title: "Palette Index Remapping Tool",
  description:
    "Remap indexed palette data through an explicit old-to-new index table; many-to-one mappings are allowed and destinations are caller-defined.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
