import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  delimiter: number;
  declaredPositions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "delimiter", kind: "integer", label: "delimiter" },
  { id: "declaredPositions", kind: "numberList", label: "declaredPositions" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.delimiter, 0, 255);
  i.declaredPositions.forEach((x) => H.int(x, 0, i.bytes.length - 1));
  H.check(H.unique(i.declaredPositions).length === i.declaredPositions.length);
  const actual = i.bytes.flatMap((x, j) => (x === i.delimiter ? [j] : []));
  return H.finish({
    undeclared: actual.filter((j) => !i.declaredPositions.includes(j)),
    falseDeclarations: i.declaredPositions.filter((j) => !actual.includes(j)),
  });
};
export const example = {
  input: { bytes: [0, 1, 0], delimiter: 0, declaredPositions: [0, 1] },
  output: { result: { undeclared: [2], falseDeclarations: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-delimiter-coverage",
  title: "Byte Frame Delimiter Coverage Check",
  description:
    "Compare explicit byte delimiter observations against caller-declared boundary positions, retaining both undeclared delimiters and false boundary claims.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
