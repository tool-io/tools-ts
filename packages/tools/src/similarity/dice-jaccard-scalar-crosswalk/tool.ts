import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ score: number; source: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "score", label: "Score", kind: "number" },
  { id: "source", label: "Source", kind: "string", enum: ["jaccard", "dice"] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.score, 0, 1);
  H.choice(i.source, ["jaccard", "dice"]);
  return H.finish({
    converted:
      i.source === "jaccard"
        ? (2 * i.score) / (1 + i.score)
        : i.score / (2 - i.score),
    target: i.source === "jaccard" ? "dice" : "jaccard",
  });
};
export const example = {
  input: { score: 0.5, source: "jaccard" },
  output: { result: { converted: 0.6666666666666666, target: "dice" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "similarity/dice-jaccard-scalar-crosswalk",
  title: "Similarity: Dice Jaccard Scalar Crosswalk Tool",
  description:
    "Crosswalk compatible set Dice and Jaccard scalar scores using their exact algebraic relation, preserving which score is the target.",
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
          converted: { type: "number" },
          target: { type: "string" },
        },
        required: ["converted", "target"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
