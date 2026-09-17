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
  H.bytes(i.bytes);
  const colon = i.bytes.indexOf(58);
  H.check(colon > 0);
  const text = String.fromCharCode(...i.bytes.slice(0, colon));
  H.check(/^(0|[1-9]\d*)(?![\s\S])/.test(text));
  const length = H.int(Number(text), 0, 128);
  H.check(i.bytes.length === colon + length + 2 && i.bytes.at(-1) === 44);
  return H.finish({ payload: i.bytes.slice(colon + 1, -1) });
};
export const example = {
  input: { bytes: [50, 58, 0, 255, 44] },
  output: { result: { payload: [0, 255] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/netstring-byte-record-decoder",
  title: "Netstring Byte Record Decoder",
  description:
    "Decode exactly one complete binary netstring with canonical ASCII decimal length and terminal comma; no concatenated records or leading-zero lengths.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
