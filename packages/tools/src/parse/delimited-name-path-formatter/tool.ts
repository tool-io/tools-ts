import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ names: readonly string[]; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", kind: "stringList", label: "names" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.names.length > 0 && i.names.every((s) => s.length > 0));
  return H.finish({
    path: i.names.map((s) => H.escapeCell(s, i.delimiter)).join(i.delimiter),
  });
};
export const example = {
  input: { names: ["a", "b/c"], delimiter: "/" },
  output: { result: { path: "a/b\\/c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/delimited-name-path-formatter",
  title: "Delimited Name Path Formatter",
  description:
    "Parse or format an abstract escaped-delimited name path with nonempty components; not a filesystem path normalizer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
