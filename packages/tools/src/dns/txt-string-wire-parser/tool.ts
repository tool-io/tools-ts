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
  H.check(i.bytes.length > 0);
  const strings: number[][] = [];
  let p = 0;
  while (p < i.bytes.length) {
    const n = i.bytes[p++];
    H.check(p + n <= i.bytes.length);
    strings.push(i.bytes.slice(p, p + n));
    p += n;
  }
  return H.finish({ strings });
};
export const example = {
  input: { bytes: [2, 1, 2, 0, 1, 3] },
  output: { result: { strings: [[1, 2], [], [3]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/txt-string-wire-parser",
  title: "DNS TXT String Wire Parser",
  description:
    "Parse a complete nonempty DNS TXT wire character-string list, retaining empty strings and rejecting incomplete trailing payload; no text encoding assumptions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
