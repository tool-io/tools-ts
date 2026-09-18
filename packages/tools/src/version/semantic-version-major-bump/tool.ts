import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "version", label: "version", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.version(i.version);
  return H.finish({
    version: H.versionText({
      ...v,
      major: v.major + 1,
      minor: 0,
      patch: 0,
      prerelease: [],
      build: [],
    }),
  });
};
export const example = {
  input: { version: "1.2.3-alpha.1+build.2" },
  output: { result: { version: "2.0.0" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-major-bump",
  title: "Semantic Version Major Bump",
  description:
    "Bump one SemVer major component, reset lower core components and remove prerelease/build metadata; rejects overflow, no release policy inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
