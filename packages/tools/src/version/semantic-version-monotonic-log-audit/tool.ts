import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ versions: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "versions", label: "versions", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
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
  id: "version/semantic-version-monotonic-log-audit",
  title: "Semantic Version Monotonic Log Audit",
  description:
    "Audit a supplied version observation log for descending adjacent SemVer precedence; build-only changes are ties and caller order is retained.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
