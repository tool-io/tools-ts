import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string; build: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "version", label: "version", kind: "string" },
  { id: "build", label: "build", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.version(i.version);
  return H.finish({ version: H.versionText({ ...v, build: i.build }) });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2", build: ["new", "01"] },
  output: { result: { version: "1.2.3-alpha.1+new.01" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-build-replace",
  title: "Semantic Version Build Metadata Replacement",
  description:
    "Replace SemVer build identifiers while preserving strict core/prerelease fields; new metadata is validated but has no precedence effect.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
