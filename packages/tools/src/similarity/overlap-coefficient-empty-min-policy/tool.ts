import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  leftSize: number;
  rightSize: number;
  intersectionSize: number;
  emptyPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftSize", label: "Left size", kind: "integer" },
  { id: "rightSize", label: "Right size", kind: "integer" },
  { id: "intersectionSize", label: "Intersection size", kind: "integer" },
  {
    id: "emptyPolicy",
    label: "Empty policy",
    kind: "string",
    enum: ["zero", "one"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.leftSize, i.rightSize].forEach((x) => H.int(x, 0, 1000000000));
  const den = Math.min(i.leftSize, i.rightSize);
  H.int(i.intersectionSize, 0, den);
  H.choice(i.emptyPolicy, ["zero", "one"]);
  return H.finish({
    defined: den !== 0,
    similarity:
      den !== 0 ? i.intersectionSize / den : i.emptyPolicy === "one" ? 1 : 0,
  });
};
export const example = {
  input: {
    leftSize: 0,
    rightSize: 2,
    intersectionSize: 0,
    emptyPolicy: "zero",
  },
  output: { result: { defined: false, similarity: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "similarity/overlap-coefficient-empty-min-policy",
  title: "Similarity: Overlap Coefficient Empty Min Policy Tool",
  description:
    "Compute overlap coefficient from consistent finite-set cardinalities with an explicit empty-minimum convention and retained defined status.",
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
