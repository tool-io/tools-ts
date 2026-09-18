import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ version: string; label: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "version", label: "version", kind: "string" },
  { id: "label", label: "label", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
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
  id: "version/semantic-version-prerelease-counter-bump",
  title: "Semantic Version Prerelease Counter Bump",
  description:
    "Bump the final numeric identifier in a matching SemVer prerelease lane or start the supplied label at zero; changing labels resets the lane and build metadata is removed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
