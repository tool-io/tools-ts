import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  declaredLengths: readonly number[];
  actualLengths: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "declaredLengths", label: "declaredLengths", kind: "numberList" },
  { id: "actualLengths", label: "actualLengths", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.declaredLengths.length === i.actualLengths.length);
  [...i.declaredLengths, ...i.actualLengths].forEach((x) => H.int(x));
  return H.finish({
    differences: i.actualLengths.map((x, j) => x - i.declaredLengths[j]),
    matches: i.actualLengths.map((x, j) => x === i.declaredLengths[j]),
  });
};
export const example = {
  input: { declaredLengths: [3, 4], actualLengths: [3, 2] },
  output: { result: { differences: [0, -2], matches: [true, false] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/multipart-part-length-consistency",
  title: "Multipart Part Length Consistency Audit",
  description:
    "Compare explicit declared and observed part byte counts with signed discrepancies; does not parse Content-Length headers, bodies or transfer encodings.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
