import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ bytes: H.slip(i.bytes, false) });
};
export const example = {
  input: { bytes: [1, 192, 219] },
  output: { result: { bytes: [1, 219, 220, 219, 221] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/slip-payload-encoder",
  title: "SLIP Payload Encoder",
  description:
    "SLIP payload escaping using RFC 1055 END/ESC byte mappings, excluding boundary END bytes; input limited to 64 bytes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
