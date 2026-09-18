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
  return H.finish({
    records: i.versions.map((version) => {
      const v = H.version(version);
      return {
        original: version,
        core: [v.major, v.minor, v.patch].join("."),
        prerelease: v.prerelease,
        build: v.build,
      };
    }),
  });
};
export const example = {
  input: { versions: ["1.2.3-alpha+build"] },
  output: {
    result: {
      records: [
        {
          original: "1.2.3-alpha+build",
          core: "1.2.3",
          prerelease: ["alpha"],
          build: ["build"],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "version/semantic-version-suffix-strip-map",
  title: "Semantic Version Suffix Strip Map",
  description:
    "Map original SemVer spellings to stripped bare-core spellings with removed suffix provenance; no numeric bump or release promotion claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
