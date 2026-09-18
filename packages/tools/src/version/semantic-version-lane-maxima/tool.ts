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
    lanes: H.groups(r, (v) => v.major + "." + v.minor).map((g) => {
      let best = r[g.indexes[0]];
      g.indexes.forEach((j) => {
        if (H.versionCompare(r[j], best) > 0) best = r[j];
      });
      return {
        lane: g.key,
        indexes: g.indexes.filter((j) => H.versionCompare(r[j], best) === 0),
      };
    }),
  });
};
export const example = {
  input: { versions: ["1.0.0", "1.0.1+a", "1.0.1+b"] },
  output: { result: { lanes: [{ lane: "1.0", indexes: [1, 2] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-lane-maxima",
  title: "Semantic Version Lane Maxima",
  description:
    "Return all equal-precedence maxima in each explicit major.minor SemVer lane, preserving build ties instead of arbitrarily choosing a release.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
