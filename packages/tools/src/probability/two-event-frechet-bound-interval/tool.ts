import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ pA: number; pB: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pA", label: "P a", kind: "number" },
  { id: "pB", label: "P b", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.pA, 0, 1);
  H.bounded(i.pB, 0, 1);
  return H.finish({
    lower: Math.max(0, i.pA + i.pB - 1),
    upper: Math.min(i.pA, i.pB),
  });
};
export const example = {
  input: { pA: 0.8, pB: 0.6 },
  output: { result: { lower: 0.4, upper: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/two-event-frechet-bound-interval",
  title: "Probability: Two Event Frechet Bound Interval Tool",
  description:
    "Return the sharp Frechet bounds on a two-event intersection from its marginals, with no independence assumption.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { lower: { type: "number" }, upper: { type: "number" } },
        required: ["lower", "upper"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
