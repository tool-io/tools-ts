import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  length: number;
  unicodeCodePointLengths: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", kind: "integer", label: "length" },
  {
    id: "unicodeCodePointLengths",
    kind: "numberList",
    label: "unicodeCodePointLengths",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 8192);
  H.check(
    i.unicodeCodePointLengths.every((x) => x === 1 || x === 2) &&
      i.unicodeCodePointLengths.reduce((s, x) => s + x, 0) === i.length,
  );
  return H.finish({
    codeUnitPositions: i.length + 1,
    unicodePositions: i.unicodeCodePointLengths.length + 1,
  });
};
export const example = {
  input: { length: 3, unicodeCodePointLengths: [1, 2] },
  output: { result: { codeUnitPositions: 4, unicodePositions: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-zero-width-match-budget",
  title: "Regex Zero Width Match Budget",
  description:
    "Budget possible zero-width progression positions from explicit UTF-16 length and code-point widths; not an actual pattern match count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
