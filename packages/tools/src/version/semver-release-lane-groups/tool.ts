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
  discovery: {
    aliases: [
      "SemVer Release Lane Groups",
      "Semantic Version Release Lane Groups",
      "version/semantic-version-release-lane-groups",
      "version semantic version release lane groups",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-release-lane-groups",
  title: "SemVer Release Lane Groups",
  description:
    "Group explicit versions into major.minor release lanes with source indexes; a caller-defined grouping, not stability or API compatibility certification.",
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
          lanes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                lane: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["lane", "indexes"],
            },
          },
        },
        required: ["lanes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
