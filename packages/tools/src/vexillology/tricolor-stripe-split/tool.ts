import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bands,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly perpendicularFieldExtent: number;
  readonly callerStripeWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "perpendicularFieldExtent",
    label: "Perpendicular field extent",
    kind: "number",
  },
  {
    id: "callerStripeWeights",
    label: "Caller stripe weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.callerStripeWeights.length !== 3)
    simpleError(
      "tricolor",
      "Three explicitly ordered stripe weights in caller chosen perpendicular orientation.",
    );
  return bands(input.perpendicularFieldExtent, input.callerStripeWeights);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { perpendicularFieldExtent: 120, callerStripeWeights: [1, 2, 1] },
  output: { result: { boundaries: [0, 30, 90, 120], widths: [30, 60, 30] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/tricolor-stripe-split",
  title: "Tricolor Stripe Width Split Calculator",
  description:
    "Ordered weighted tricolor split perpendicular to stripe direction, not assumed equal thirds or automatic flag identification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
