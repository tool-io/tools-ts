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
  i.clusters.forEach((x) => H.int(x, 0, i.sourceLength));
  const sorted = H.unique(i.clusters).sort((a, b) => a - b);
  return H.finish({
    spans: i.clusters.map((start) => ({
      start,
      end: sorted.find((x) => x > start) ?? i.sourceLength,
    })),
  });
};
export const example = {
  input: { clusters: [2, 0, 2], sourceLength: 4 },
  output: {
    result: {
      spans: [
        { start: 2, end: 4 },
        { start: 0, end: 2 },
        { start: 2, end: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph Cluster Source Span Table", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-cluster-source-span-table",
  title: "Glyph Cluster Source Span Table",
  description:
    "Derive cluster source spans from the next greater distinct supplied UTF-16 cluster index, supporting repeated and reverse-ordered glyph clusters; does not infer graphemes.",
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
          spans: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["start", "end"],
            },
          },
        },
        required: ["spans"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
