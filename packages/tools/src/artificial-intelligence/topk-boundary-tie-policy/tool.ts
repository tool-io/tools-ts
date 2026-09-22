import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  scores: readonly number[];
  k: number;
  tiePolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "scores", label: "Scores", kind: "numberList" },
  { id: "k", label: "K", kind: "integer" },
  {
    id: "tiePolicy",
    label: "Tie policy",
    kind: "string",
    enum: ["stable-index", "include-all"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.scores.length > 0);
  H.int(i.k, 1, i.scores.length);
  H.choice(i.tiePolicy, ["stable-index", "include-all"]);
  const order = i.scores
      .map((_, j) => j)
      .sort((a, b) => i.scores[b] - i.scores[a] || a - b),
    boundary = i.scores[order[i.k - 1]],
    indices =
      i.tiePolicy === "include-all"
        ? order.filter((j) => i.scores[j] >= boundary)
        : order.slice(0, i.k);
  return H.finish({
    selectedIndices: indices,
    boundaryScore: boundary,
    tiedBoundaryIndices: order.filter((j) => i.scores[j] === boundary),
  });
};
export const example = {
  input: { scores: [4, 3, 3, 1], k: 2, tiePolicy: "include-all" },
  output: {
    result: {
      selectedIndices: [0, 1, 2],
      boundaryScore: 3,
      tiedBoundaryIndices: [1, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "artificial-intelligence/topk-boundary-tie-policy",
  title: "Artificial Intelligence: Topk Boundary Tie Policy Tool",
  description:
    "Select a bounded top-k score set with explicit stable-index or include-all-boundary-ties policy; no sampling or probabilistic interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          boundaryScore: { type: "number" },
          selectedIndices: { type: "array", items: { type: "number" } },
          tiedBoundaryIndices: { type: "array", items: { type: "number" } },
        },
        required: ["boundaryScore", "selectedIndices", "tiedBoundaryIndices"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
