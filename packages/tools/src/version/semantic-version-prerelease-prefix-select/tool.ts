import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  versions: readonly string[];
  prefix: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "versions", label: "versions", kind: "stringList" },
  { id: "prefix", label: "prefix", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = i.versions.map(H.version);
  return H.finish({
    versions: r.flatMap((v, index) =>
      i.prefix.every((x, j) => String(v.prerelease[j]) === x) &&
      v.prerelease.length >= i.prefix.length
        ? [{ index, version: i.versions[index] }]
        : [],
    ),
  });
};
export const example = {
  input: { versions: ["1.0.0-alpha.1", "1.0.0-beta.1"], prefix: ["alpha"] },
  output: { result: { versions: [{ index: 0, version: "1.0.0-alpha.1" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-prerelease-prefix-select",
  title: "Semantic Version Prerelease Prefix Selector",
  description:
    "Select strict SemVer prerelease identifier prefix matches by complete literal identifiers, not substring regex or build metadata.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
