import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  strictlyIncreasing,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly projectedStripeEdgePositions: readonly number[];
  readonly projectedFieldExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "projectedStripeEdgePositions",
    label: "Projected stripe edge positions",
    kind: "numberList",
  },
  {
    id: "projectedFieldExtent",
    label: "Projected field extent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.projectedFieldExtent, "projectedFieldExtent");
  input.projectedStripeEdgePositions.forEach((v) =>
    nonnegative(v, "projectedStripeEdgePositions"),
  );
  strictlyIncreasing(input.projectedStripeEdgePositions, "edges", 2);
  if (input.projectedStripeEdgePositions.at(-1)! > input.projectedFieldExtent)
    simpleError("extent", "Edges within projected field.");
  return {
    observedStripeIntervals: input.projectedStripeEdgePositions.length - 1,
    trailingProjectedGap:
      input.projectedFieldExtent - input.projectedStripeEdgePositions.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    projectedStripeEdgePositions: [0, 20, 40],
    projectedFieldExtent: 50,
  },
  output: { result: { observedStripeIntervals: 2, trailingProjectedGap: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/bendy-sinister-counter",
  title: "Bendy Sinister Diagonal Stripe Counter",
  description:
    "Count observed diagonal stripe intervals along caller perpendicular projection; no vertical-width substitution.",
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
