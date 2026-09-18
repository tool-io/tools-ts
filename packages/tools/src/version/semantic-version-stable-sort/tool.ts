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
  const r = i.versions.map(H.version);
  return H.finish({
    versions: r
      .map((v, index) => ({ v, index }))
      .sort((a, b) => H.versionCompare(a.v, b.v) || a.index - b.index)
      .map((v) => ({ version: i.versions[v.index], index: v.index })),
  });
};
export const example = {
  input: { versions: ["1.0.0+a", "1.0.0+b", "1.0.0-alpha"] },
  output: {
    result: {
      versions: [
        { version: "1.0.0-alpha", index: 2 },
        { version: "1.0.0+a", index: 0 },
        { version: "1.0.0+b", index: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-stable-sort",
  title: "Semantic Version Stable Sort",
  description:
    "Stable SemVer precedence sort using the existing comparator, retaining all build-metadata ties and original spellings/indexes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
