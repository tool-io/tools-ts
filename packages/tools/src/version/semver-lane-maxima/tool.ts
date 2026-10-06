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
    lanes: H.groups(r, (v) => v.major + "." + v.minor).map((g) => {
      let best = r[g.indexes[0]];
      g.indexes.forEach((j) => {
        if (H.versionCompare(r[j], best) > 0) best = r[j];
      });
      return {
        lane: g.key,
        indexes: g.indexes.filter((j) => H.versionCompare(r[j], best) === 0),
      };
    }),
  });
};
export const example = {
  input: { versions: ["1.0.0", "1.0.1+a", "1.0.1+b"] },
  output: { result: { lanes: [{ lane: "1.0", indexes: [1, 2] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Lane Maxima",
      "Semantic Version Lane Maxima",
      "version/semantic-version-lane-maxima",
      "version semantic version lane maxima",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-lane-maxima",
  title: "SemVer Lane Maxima",
  description:
    "Return all equal-precedence maxima in each explicit major.minor SemVer lane, preserving build ties instead of arbitrarily choosing a release.",
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
