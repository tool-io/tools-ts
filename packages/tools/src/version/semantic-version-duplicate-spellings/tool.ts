import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ versions: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "versions", label: "versions", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.versions.forEach(H.version);
  return H.finish({ duplicates: H.duplicates(i.versions, (x) => x) });
};
export const example = {
  input: { versions: ["1.0.0+a", "1.0.0+a", "1.0.0+b"] },
  output: { result: { duplicates: [{ key: "1.0.0+a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-duplicate-spellings",
  title: "Semantic Version Duplicate Spelling Audit",
  description:
    "Audit repeated strict SemVer spellings exactly, distinct from equal-precedence build-metadata alternatives.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
