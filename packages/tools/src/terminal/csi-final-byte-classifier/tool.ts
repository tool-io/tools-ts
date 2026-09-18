import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ byte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byte", label: "byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byte, 0, 255);
  return H.finish({ isFinal: i.byte >= 64 && i.byte <= 126 });
};
export const example = {
  input: { byte: 109 },
  output: { result: { isFinal: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/csi-final-byte-classifier",
  title: "Terminal CSI Final Byte Classifier",
  description:
    "Classify one raw byte under the ECMA CSI final-byte range 0x40\u20130x7e; does not imply a valid or supported escape sequence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
