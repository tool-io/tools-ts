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
  discovery: {
    aliases: [
      "SemVer Stable Sort",
      "Semantic Version Stable Sort",
      "version/semantic-version-stable-sort",
      "version semantic version stable sort",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-stable-sort",
  title: "SemVer Stable Sort",
  description:
    "Stable SemVer precedence sort using the existing comparator, retaining all build-metadata ties and original spellings/indexes.",
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
          versions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                version: { type: "string" },
                index: { type: "number" },
              },
              required: ["version", "index"],
            },
          },
        },
        required: ["versions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
