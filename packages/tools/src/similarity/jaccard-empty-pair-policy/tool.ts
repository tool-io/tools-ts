import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  intersectionCount: number;
  unionCount: number;
  emptyPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "intersectionCount", label: "Intersection count", kind: "integer" },
  { id: "unionCount", label: "Union count", kind: "integer" },
  {
    id: "emptyPolicy",
    label: "Empty policy",
    kind: "string",
    enum: ["zero", "one"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.unionCount, 0, 1000000000);
  H.int(i.intersectionCount, 0, i.unionCount);
  H.choice(i.emptyPolicy, ["zero", "one"]);
  return H.finish({
    defined: i.unionCount !== 0,
    similarity:
      i.unionCount !== 0
        ? i.intersectionCount / i.unionCount
        : i.emptyPolicy === "one"
          ? 1
          : 0,
  });
};
export const example = {
  input: { intersectionCount: 0, unionCount: 0, emptyPolicy: "one" },
  output: { result: { defined: false, similarity: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "similarity/jaccard-empty-pair-policy",
  title: "Similarity: Jaccard Empty Pair Policy Tool",
  description:
    "Compute cardinality-based Jaccard similarity with explicit zero/one empty-union convention and a retained defined flag.",
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
          defined: { type: "boolean" },
          similarity: { type: "number" },
        },
        required: ["defined", "similarity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
