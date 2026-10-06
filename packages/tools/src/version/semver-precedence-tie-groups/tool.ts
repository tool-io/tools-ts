import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ versions: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "versions", label: "versions", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = i.versions.map(H.version),
    g: number[][] = [];
  r.forEach((v, j) => {
    const p = g.find((a) => H.versionCompare(r[a[0]], v) === 0);
    if (p) p.push(j);
    else g.push([j]);
  });
  return H.finish({ groups: g });
};
export const example = {
  input: { versions: ["1.0.0+a", "1.0.0+b", "1.0.0-alpha"] },
  output: { result: { groups: [[0, 1], [2]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Precedence Tie Groups",
      "Semantic Version Precedence Tie Groups",
      "version/semantic-version-precedence-tie-groups",
      "version semantic version precedence tie groups",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-precedence-tie-groups",
  title: "SemVer Precedence Tie Groups",
  description:
    "Group all equal-precedence SemVer spellings while ignoring build metadata and retaining original indexes; no lexicographic or numeric-only substitution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          groups: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["groups"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
