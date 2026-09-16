import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  prefixesJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "prefixesJson", kind: "string", label: "prefixesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  const r = H.arr(i.prefixesJson).map((v) => {
    H.check(Array.isArray(v) && v.length > 0);
    H.bytes(v as number[]);
    return v as number[];
  });
  const indexes = r
    .map((p, j) => (p.every((x, k) => i.bytes[k] === x) ? j : -1))
    .filter((j) => j >= 0);
  return H.finish({
    matchingIndexes: indexes,
    longestIndexes: indexes.filter(
      (j) => r[j].length === Math.max(...indexes.map((k) => r[k].length)),
    ),
  });
};
export const example = {
  input: { bytes: [1, 2, 3], prefixesJson: "[[1],[1,2],[2]]" },
  output: { result: { matchingIndexes: [0, 1], longestIndexes: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-prefix-dispatch",
  title: "Byte Array Prefix Dispatch",
  description:
    "Match caller-supplied byte prefixes and expose all longest ties; no protocol-identification guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
