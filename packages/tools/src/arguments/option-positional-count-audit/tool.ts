import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  positionals: readonly string[];
  minimum: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "positionals", label: "positionals", kind: "stringList" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.minimum, 0, 128);
  H.int(i.maximum, i.minimum, 128);
  return H.finish({
    count: i.positionals.length,
    valid:
      i.positionals.length >= i.minimum && i.positionals.length <= i.maximum,
  });
};
export const example = {
  input: { positionals: ["a", "b"], minimum: 1, maximum: 1 },
  output: { result: { count: 2, valid: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-positional-count-audit",
  title: "Option Positional Count Audit",
  description:
    "Audit the already-partitioned positional argv count against explicit inclusive arity bounds; no option parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
