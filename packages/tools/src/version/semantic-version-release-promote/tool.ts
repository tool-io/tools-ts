import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "version", label: "version", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.version(i.version);
  return H.finish({
    version: H.versionText({ ...v, prerelease: [], build: [] }),
  });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2" },
  output: { result: { version: "1.2.3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-release-promote",
  title: "Semantic Version Release Promotion",
  description:
    "Promote an explicit SemVer spelling to its bare release core, stripping prerelease and build without bumping numeric components.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
