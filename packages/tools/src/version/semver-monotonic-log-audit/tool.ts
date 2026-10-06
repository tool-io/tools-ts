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
    violations: r
      .slice(1)
      .flatMap((v, j) => (H.versionCompare(r[j], v) > 0 ? [[j, j + 1]] : [])),
  });
};
export const example = {
  input: { versions: ["1.0.1", "1.0.0", "1.0.0+b"] },
  output: { result: { violations: [[0, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Monotonic Log Audit",
      "Semantic Version Monotonic Log Audit",
      "version/semantic-version-monotonic-log-audit",
      "version semantic version monotonic log audit",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-monotonic-log-audit",
  title: "SemVer Monotonic Log Audit",
  description:
    "Audit a supplied version observation log for descending adjacent SemVer precedence; build-only changes are ties and caller order is retained.",
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
          violations: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
