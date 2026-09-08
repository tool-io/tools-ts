import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch43-shared.js";

export type Input = Readonly<{ readonly hoist: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hoist", label: "Hoist", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.hoist, "hoist");
  return {
    stripeHeight: input.hoist / 13,
    cantonHeight: (7 * input.hoist) / 13,
    cantonHoistFraction: 7 / 13,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { hoist: 130 },
  output: {
    result: {
      stripeHeight: 10,
      cantonHeight: 70,
      cantonHoistFraction: 0.5384615384615384,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/us-canton-fraction",
  title: "US Canton Stripe Height Fraction Calculator",
  description:
    "Ideal US13equal-stripe model canton height7stripes; not complete manufacturing tolerances, star field or official fabric certification.",
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
