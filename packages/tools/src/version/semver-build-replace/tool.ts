import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string; build: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "version", label: "version", kind: "string" },
  { id: "build", label: "build", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const v = H.version(i.version);
  return H.finish({ version: H.versionText({ ...v, build: i.build }) });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2", build: ["new", "01"] },
  output: { result: { version: "1.2.3-alpha.1+new.01" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Build Metadata Editor",
      "Semantic Version Build Metadata Replacement",
      "version/semantic-version-build-replace",
      "version semantic version build replace",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-build-replace",
  title: "SemVer Build Metadata Editor",
  description:
    "Replace SemVer build identifiers while preserving strict core/prerelease fields; new metadata is validated but has no precedence effect.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { version: { type: "string" } },
        required: ["version"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
