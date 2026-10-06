import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  major: number;
  minor: number;
  patch: number;
  prerelease: readonly string[];
  build: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "major", label: "major", kind: "integer" },
  { id: "minor", label: "minor", kind: "integer" },
  { id: "patch", label: "patch", kind: "integer" },
  { id: "prerelease", label: "prerelease", kind: "stringList" },
  { id: "build", label: "build", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  [i.major, i.minor, i.patch].forEach((x) =>
    H.int(x, 0, Number.MAX_SAFE_INTEGER),
  );
  return H.finish({
    version: H.versionText({
      major: i.major,
      minor: i.minor,
      patch: i.patch,
      prerelease: i.prerelease,
      build: i.build,
    }),
  });
};
export const example = {
  input: {
    major: 1,
    minor: 2,
    patch: 3,
    prerelease: ["alpha", "1"],
    build: ["b"],
  },
  output: { result: { version: "1.2.3-alpha.1+b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Record Formatter",
      "Semantic Version Record Formatter",
      "version/semantic-version-record-formatter",
      "version semantic version record formatter",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-record-formatter",
  title: "SemVer Record Formatter",
  description:
    "Format an explicit strict SemVer record and validate through the existing parser; core/prerelease numeric components must stay safe and prerelease numeric zeros cannot be padded.",
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
