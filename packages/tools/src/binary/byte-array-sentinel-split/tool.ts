import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[]; sentinel: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "sentinel", kind: "integer", label: "sentinel" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.sentinel, 0, 255);
  const records: number[][] = [[]];
  i.bytes.forEach((x) =>
    x === i.sentinel ? records.push([]) : records.at(-1)!.push(x),
  );
  return H.finish({ records });
};
export const example = {
  input: { bytes: [1, 0, 0, 2, 0], sentinel: 0 },
  output: { result: { records: [[1], [], [2], []] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-sentinel-split",
  title: "Byte Array Sentinel Splitter",
  description:
    "Split at a literal single-byte sentinel, preserving leading, repeated and trailing empty records; no escaping.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
