import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ path: string; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", kind: "string", label: "path" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const names = H.splitEscaped(i.path, i.delimiter);
  H.check(names.every((s) => s.length > 0));
  return H.finish({ names });
};
export const example = {
  input: { path: "a/b\\/c", delimiter: "/" },
  output: { result: { names: ["a", "b/c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/delimited-name-path",
  title: "Delimited Name Path Parser",
  description:
    "Parse or format an abstract escaped-delimited name path with nonempty components; not a filesystem path normalizer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
