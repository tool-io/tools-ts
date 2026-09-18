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
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "major", label: "major", kind: "integer" },
  { id: "minor", label: "minor", kind: "integer" },
  { id: "patch", label: "patch", kind: "integer" },
  { id: "prerelease", label: "prerelease", kind: "stringList" },
  { id: "build", label: "build", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
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
  id: "version/semantic-version-record-formatter",
  title: "Semantic Version Record Formatter",
  description:
    "Format an explicit strict SemVer record and validate through the existing parser; core/prerelease numeric components must stay safe and prerelease numeric zeros cannot be padded.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
