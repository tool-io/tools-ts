import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ probability: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "probability", label: "Probability", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.probability, 0, 1);
  return H.finish({
    finite: i.probability < 1,
    odds: i.probability === 1 ? 0 : i.probability / (1 - i.probability),
    boundary:
      i.probability === 0
        ? "zero"
        : i.probability === 1
          ? "infinite-odds"
          : "interior",
  });
};
export const example = {
  input: { probability: 1 },
  output: { result: { finite: false, odds: 0, boundary: "infinite-odds" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/probability-odds-boundary-policy",
  title: "Probability: Probability Odds Boundary Policy Tool",
  description:
    "Report exact probability-to-odds endpoint status without non-JSON infinity; odds zero is unused when finite=false, unlike a clipped probability.",
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
          boundary: { type: "string" },
          finite: { type: "boolean" },
          odds: { type: "number" },
        },
        required: ["boundary", "finite", "odds"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
