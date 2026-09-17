import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  sync: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "sync", kind: "numberList", label: "sync" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.bytes(i.sync);
  H.check(i.sync.length > 0);
  return H.finish({
    positions: i.bytes.flatMap((_, j) =>
      i.sync.every((x, k) => i.bytes[j + k] === x) ? [j] : [],
    ),
  });
};
export const example = {
  input: { bytes: [1, 1, 1, 2], sync: [1, 1] },
  output: { result: { positions: [0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/fixed-sync-frame-boundaries",
  title: "Fixed Sync Frame Boundary Finder",
  description:
    "Find all overlapping occurrences of an explicit sync byte sequence; occurrences are candidate boundaries, not validated frames.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
