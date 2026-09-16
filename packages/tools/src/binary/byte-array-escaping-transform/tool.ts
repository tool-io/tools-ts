import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  escape: number;
  sentinel: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "escape", kind: "integer", label: "escape" },
  { id: "sentinel", kind: "integer", label: "sentinel" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ bytes: H.packEscaped(i.bytes, i.escape, i.sentinel) });
};
export const example = {
  input: { bytes: [1, 0, 27], escape: 27, sentinel: 0 },
  output: { result: { bytes: [1, 27, 32, 27, 59] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-escaping-transform",
  title: "Byte Array Escaping Transform",
  description:
    "Explicit byte-stuffing transform with escape followed by reserved byte XOR 0x20; escape and sentinel must differ.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
