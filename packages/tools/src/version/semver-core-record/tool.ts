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
  return H.finish({ major: v.major, minor: v.minor, patch: v.patch });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2" },
  output: { result: { major: 1, minor: 2, patch: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Core Record Extractor",
      "Semantic Version Core Record Extractor",
      "version/semantic-version-core-record",
      "version semantic version core record",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-core-record",
  title: "SemVer Core Record Extractor",
  description:
    "Extract strict SemVer core fields through the existing parser, bounded to safe integer components; no coercion of prefixes, whitespace or leading zeros.",
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
          major: { type: "number" },
          minor: { type: "number" },
          patch: { type: "number" },
        },
        required: ["major", "minor", "patch"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
