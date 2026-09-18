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
    lanes: H.groups(r, (v) => [v.major, v.minor].join(".")).map((g) => ({
      lane: g.key,
      indexes: g.indexes,
    })),
  });
};
export const example = {
  input: { versions: ["1.0.0", "1.0.1", "1.1.0"] },
  output: {
    result: {
      lanes: [
        { lane: "1.0", indexes: [0, 1] },
        { lane: "1.1", indexes: [2] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-release-lane-groups",
  title: "Semantic Version Release Lane Groups",
  description:
    "Group explicit versions into major.minor release lanes with source indexes; a caller-defined grouping, not stability or API compatibility certification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
