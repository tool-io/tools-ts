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
  i.versions.forEach(H.version);
  return H.finish({ duplicates: H.duplicates(i.versions, (x) => x) });
};
export const example = {
  input: { versions: ["1.0.0+a", "1.0.0+a", "1.0.0+b"] },
  output: { result: { duplicates: [{ key: "1.0.0+a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Duplicate Spelling Audit",
      "Semantic Version Duplicate Spelling Audit",
      "version/semantic-version-duplicate-spellings",
      "version semantic version duplicate spellings",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-duplicate-spellings",
  title: "SemVer Duplicate Spelling Audit",
  description:
    "Audit repeated strict SemVer spellings exactly, distinct from equal-precedence build-metadata alternatives.",
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
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["duplicates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
