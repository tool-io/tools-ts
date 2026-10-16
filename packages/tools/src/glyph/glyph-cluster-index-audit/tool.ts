import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  clusters: readonly number[];
  sourceLength: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "clusters", label: "clusters", kind: "numberList" },
  { id: "sourceLength", label: "sourceLength", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.sourceLength, 0, 8192);
  i.clusters.forEach((x) => H.int(x, -1e6, 1e6));
  return H.finish({
    outOfBounds: i.clusters.flatMap((x, j) =>
      x < 0 || x > i.sourceLength ? [j] : [],
    ),
    decreasing: i.clusters.flatMap((x, j) =>
      j && x < i.clusters[j - 1] ? [j] : [],
    ),
  });
};
export const example = {
  input: { clusters: [0, 2, 1, 5], sourceLength: 4 },
  output: { result: { outOfBounds: [3], decreasing: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph Cluster Index Audit", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-cluster-index-audit",
  title: "Glyph Cluster Index Audit",
  description:
    "Audit supplied integer UTF-16 glyph cluster positions for bounds and decreasing order separately; decreasing clusters may be valid RTL shaping, not automatically corruption.",
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
          outOfBounds: { type: "array", items: { type: "number" } },
          decreasing: { type: "array", items: { type: "number" } },
        },
        required: ["outOfBounds", "decreasing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
