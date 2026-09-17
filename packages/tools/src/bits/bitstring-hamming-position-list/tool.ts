import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.left);
  H.bits(i.right);
  H.check(i.left.length === i.right.length);
  return H.finish({
    positions: i.left
      .split("")
      .flatMap((x, j) => (x !== i.right[j] ? [j] : [])),
  });
};
export const example = {
  input: { left: "101", right: "001" },
  output: { result: { positions: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-hamming-position-list",
  title: "Bit String Hamming Position List",
  description:
    "Return every differing position between equal-width bit strings, preserving Hamming witnesses rather than just a count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
