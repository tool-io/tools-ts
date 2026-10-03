import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
  zeroNormPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "numberList" },
  { id: "right", label: "Right", kind: "numberList" },
  {
    id: "zeroNormPolicy",
    label: "Zero norm policy",
    kind: "string",
    enum: ["zero", "reject"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.left.length > 0 && i.left.length === i.right.length);
  H.choice(i.zeroNormPolicy, ["zero", "reject"]);
  const an = Math.hypot(...i.left),
    bn = Math.hypot(...i.right);
  H.check(Number.isFinite(an) && Number.isFinite(bn));
  H.check(an * bn !== 0 || i.zeroNormPolicy === "zero");
  return H.finish({
    defined: an > 0 && bn > 0,
    similarity:
      an === 0 || bn === 0
        ? 0
        : i.left.reduce((s, x, j) => s + (x / an) * (i.right[j] / bn), 0),
  });
};
export const example = {
  input: { left: [0, 0], right: [1, 0], zeroNormPolicy: "zero" },
  output: { result: { defined: false, similarity: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "similarity/cosine-zero-norm-policy",
  title: "Similarity: Cosine Zero Norm Policy Tool",
  description:
    "Compute cosine similarity with an explicit reject/zero undefined-norm policy and a retained defined flag; zero is not silently treated as a measured cosine.",
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
