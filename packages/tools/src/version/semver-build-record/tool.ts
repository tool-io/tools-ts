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
  return H.finish({ identifiers: v.build });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2" },
  output: { result: { identifiers: ["build", "2"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Build Record Extractor",
      "Semantic Version Build Record Extractor",
      "version/semantic-version-build-record",
      "version semantic version build record",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-build-record",
  title: "SemVer Build Record Extractor",
  description:
    "Extract SemVer build identifiers as literal strings, preserving numeric-looking leading zeros without adding precedence meaning.",
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
          identifiers: { type: "array", items: { type: "string" } },
        },
        required: ["identifiers"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
