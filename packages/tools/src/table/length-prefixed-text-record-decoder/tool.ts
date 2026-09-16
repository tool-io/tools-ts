import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ encoded: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "encoded", kind: "string", label: "encoded" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const records: string[] = [];
  let p = 0;
  while (p < i.encoded.length) {
    const m = /^(0|[1-9]\d*):/.exec(i.encoded.slice(p));
    H.check(m);
    const n = H.int(Number(m![1]), 0, 8192);
    p += m![0].length;
    H.check(p + n <= i.encoded.length);
    records.push(i.encoded.slice(p, p + n));
    p += n;
    H.check(records.length <= 128);
  }
  return H.finish({ records });
};
export const example = {
  input: { encoded: "3:a:b0:" },
  output: { result: { records: ["a:b", ""] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/length-prefixed-text-record-decoder",
  title: "Length Prefixed Text Record Decoder",
  description:
    "Decode complete decimal-length-prefixed UTF-16 text records; reject malformed lengths or incomplete payloads.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
