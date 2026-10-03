import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  editDistance: number;
  leftLength: number;
  rightLength: number;
  denominatorPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "editDistance", label: "Edit distance", kind: "integer" },
  { id: "leftLength", label: "Left length", kind: "integer" },
  { id: "rightLength", label: "Right length", kind: "integer" },
  {
    id: "denominatorPolicy",
    label: "Denominator policy",
    kind: "string",
    enum: ["max", "sum", "mean"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.editDistance, i.leftLength, i.rightLength].forEach((x) =>
    H.int(x, 0, 1000000000),
  );
  H.choice(i.denominatorPolicy, ["max", "sum", "mean"]);
  const denominator =
    i.denominatorPolicy === "max"
      ? Math.max(i.leftLength, i.rightLength)
      : (i.leftLength + i.rightLength) /
        (i.denominatorPolicy === "mean" ? 2 : 1);
  return H.finish({
    denominator,
    defined: denominator > 0,
    normalizedDistance: denominator > 0 ? i.editDistance / denominator : 0,
  });
};
export const example = {
  input: {
    editDistance: 2,
    leftLength: 3,
    rightLength: 5,
    denominatorPolicy: "max",
  },
  output: {
    result: { denominator: 5, defined: true, normalizedDistance: 0.4 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "similarity/edit-score-length-normalizer-choice",
  title: "Similarity: Edit Score Length Normalizer Choice Tool",
  description:
    "Normalize a supplied edit count by explicitly selected max/sum/mean string length, retaining undefined status for empty pairs without claiming a bounded similarity.",
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
          denominator: { type: "number" },
          normalizedDistance: { type: "number" },
        },
        required: ["defined", "denominator", "normalizedDistance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
