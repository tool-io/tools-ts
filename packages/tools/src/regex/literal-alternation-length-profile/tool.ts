import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ literals: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "literals", kind: "stringList", label: "literals" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    lengths: i.literals.map((s) => s.length),
    minimum: i.literals.length
      ? Math.min(...i.literals.map((s) => s.length))
      : null,
    maximum: i.literals.length
      ? Math.max(...i.literals.map((s) => s.length))
      : null,
    emptyIndexes: i.literals.flatMap((s, j) => (s.length === 0 ? [j] : [])),
  });
};
export const example = {
  input: { literals: ["a", "xyz", ""] },
  output: {
    result: { lengths: [1, 3, 0], minimum: 0, maximum: 3, emptyIndexes: [2] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/literal-alternation-length-profile",
  title: "Literal Alternation Length Profile",
  description:
    "Profile UTF-16 lengths of a literal regex alternative bank, retaining empty alternatives and null extrema for no alternatives.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
