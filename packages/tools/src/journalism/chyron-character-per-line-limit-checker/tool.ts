import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly lines: readonly string[];
  readonly callerMaximumCodepoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lines", label: "Lines", kind: "stringList" },
  {
    id: "callerMaximumCodepoints",
    label: "Caller maximum codepoints",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.callerMaximumCodepoints, "limit", 1, 1000000);
  const counts = i.lines.map((s) => [...s].length);
  return {
    lineCodepointCounts: counts,
    overLimitLineIndices: counts.flatMap((v, j) =>
      v > i.callerMaximumCodepoints ? [j] : [],
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { lines: ["ABC", "ABCDE"], callerMaximumCodepoints: 4 },
  output: {
    result: { lineCodepointCounts: [3, 5], overLimitLineIndices: [1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/chyron-character-per-line-limit-checker",
  title: "Chyron Character per Line Limit Checker",
  description:
    "Chyron line codepoint counts against caller limit; not glyph-width/layout or universal station template.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
