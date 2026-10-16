import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  leftEdges: readonly number[];
  rightEdges: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "leftEdges", label: "leftEdges", kind: "numberList" },
  { id: "rightEdges", label: "rightEdges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.histogramEdges(i.leftEdges);
  H.histogramEdges(i.rightEdges);
  H.check(
    i.leftEdges[0] === i.rightEdges[0] &&
      i.leftEdges.at(-1) === i.rightEdges.at(-1),
  );
  return H.finish({
    edges: i.leftEdges.filter((x) => i.rightEdges.includes(x)),
    leftIndexes: i.leftEdges.flatMap((x, j) =>
      i.rightEdges.includes(x) ? [j] : [],
    ),
    rightIndexes: i.rightEdges.flatMap((x, j) =>
      i.leftEdges.includes(x) ? [j] : [],
    ),
  });
};
export const example = {
  input: { leftEdges: [0, 1, 2, 4], rightEdges: [0, 2, 3, 4] },
  output: {
    result: {
      edges: [0, 2, 4],
      leftIndexes: [0, 2, 3],
      rightIndexes: [0, 1, 3],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Histogram Common Edge Coarsening", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/bin-common-edge-coarsening",
  title: "Histogram Common Edge Coarsening",
  description:
    "Find exact common histogram boundaries for whole-bin coarsening, requiring identical outer domain endpoints; no approximate matching or invented split masses.",
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
          edges: { type: "array", items: { type: "number" } },
          leftIndexes: { type: "array", items: { type: "number" } },
          rightIndexes: { type: "array", items: { type: "number" } },
        },
        required: ["edges", "leftIndexes", "rightIndexes"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
