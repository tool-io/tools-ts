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
  return H.finish({
    records: i.versions.map((version) => {
      const v = H.version(version);
      return {
        original: version,
        core: [v.major, v.minor, v.patch].join("."),
        prerelease: v.prerelease,
        build: v.build,
      };
    }),
  });
};
export const example = {
  input: { versions: ["1.2.3-alpha+build"] },
  output: {
    result: {
      records: [
        {
          original: "1.2.3-alpha+build",
          core: "1.2.3",
          prerelease: ["alpha"],
          build: ["build"],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Suffix Strip Map",
      "Semantic Version Suffix Strip Map",
      "version/semantic-version-suffix-strip-map",
      "version semantic version suffix strip map",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-suffix-strip-map",
  title: "SemVer Suffix Strip Map",
  description:
    "Map original SemVer spellings to stripped bare-core spellings with removed suffix provenance; no numeric bump or release promotion claim.",
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
          records: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                original: { type: "string" },
                core: { type: "string" },
                prerelease: {
                  type: "array",
                  items: { anyOf: [{ type: "string" }, { type: "number" }] },
                },
                build: { type: "array", items: { type: "string" } },
              },
              required: ["original", "core", "prerelease", "build"],
            },
          },
        },
        required: ["records"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
