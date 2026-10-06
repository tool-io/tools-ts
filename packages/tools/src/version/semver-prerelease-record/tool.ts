import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "version", label: "version", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const v = H.version(i.version);
  return H.finish({
    identifiers: v.prerelease,
    numeric: v.prerelease.map((x) => typeof x === "number"),
  });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2" },
  output: { result: { identifiers: ["alpha", 1], numeric: [false, true] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Prerelease Record Extractor",
      "Semantic Version Prerelease Record Extractor",
      "version/semantic-version-prerelease-record",
      "version semantic version prerelease record",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-prerelease-record",
  title: "SemVer Prerelease Record Extractor",
  description:
    "Extract strict SemVer prerelease identifiers with numeric versus textual evidence using the existing parser; no build precedence.",
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
          identifiers: {
            type: "array",
            items: { anyOf: [{ type: "string" }, { type: "number" }] },
          },
          numeric: { type: "array", items: { type: "boolean" } },
        },
        required: ["identifiers", "numeric"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
