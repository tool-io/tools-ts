import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string; label: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "version", label: "version", kind: "string" },
  { id: "label", label: "label", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const v = H.version(i.version);
  H.check(/^[A-Za-z-][A-Za-z0-9-]*(?![\s\S])/.test(i.label));
  const pre = [...v.prerelease];
  if (!pre.length || pre[0] !== i.label) pre.splice(0, pre.length, i.label, 0);
  else if (typeof pre.at(-1) === "number")
    pre[pre.length - 1] = Number(pre.at(-1)) + 1;
  else pre.push(0);
  return H.finish({
    version: H.versionText({ ...v, prerelease: pre, build: [] }),
  });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2", label: "alpha" },
  output: { result: { version: "1.2.3-alpha.2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Prerelease Counter Bump",
      "Semantic Version Prerelease Counter Bump",
      "version/semantic-version-prerelease-counter-bump",
      "version semantic version prerelease counter bump",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-prerelease-counter-bump",
  title: "SemVer Prerelease Counter Bump",
  description:
    "Bump the final numeric identifier in a matching SemVer prerelease lane or start the supplied label at zero; changing labels resets the lane and build metadata is removed.",
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
