import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  inLeft: boolean;
  inRight: boolean;
  alpha: number;
  beta: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "inLeft", label: "In left", kind: "boolean" },
  { id: "inRight", label: "In right", kind: "boolean" },
  { id: "alpha", label: "Alpha", kind: "number" },
  { id: "beta", label: "Beta", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.alpha >= 0 && i.beta >= 0);
  return H.finish({
    numeratorContribution: i.inLeft && i.inRight ? 1 : 0,
    denominatorContribution:
      i.inLeft && i.inRight ? 1 : i.inLeft ? i.alpha : i.inRight ? i.beta : 0,
  });
};
export const example = {
  input: { inLeft: true, inRight: false, alpha: 0.3, beta: 0.7 },
  output: {
    result: { numeratorContribution: 0, denominatorContribution: 0.3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "similarity/tversky-single-feature-contribution",
  title: "Similarity: Tversky Single Feature Contribution Tool",
  description:
    "Return the numerator and denominator contribution of one binary feature to a Tversky score under supplied nonnegative asymmetry weights.",
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
          denominatorContribution: { type: "number" },
          numeratorContribution: { type: "number" },
        },
        required: ["denominatorContribution", "numeratorContribution"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
