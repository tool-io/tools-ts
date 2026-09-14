import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualHorizontalStripeCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHorizontalStripeCount",
    label: "Actual horizontal stripe count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualHorizontalStripeCount, "stripes", 1, 1000);
  return {
    stripeCountParity: input.actualHorizontalStripeCount % 2 ? "odd" : "even",
    twoColorAlternatingEndColorsSame:
      input.actualHorizontalStripeCount % 2 === 1,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualHorizontalStripeCount: 13 },
  output: {
    result: {
      stripeCountParity: "odd",
      twoColorAlternatingEndColorsSame: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/stripe-parity-checker",
  title: "Number-of-Stripes Parity Checker",
  description:
    "Stripeparityandtwo-coloralternating first/lastcolorrelationship,not genericnumberparityaloneor countryflagidentity. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
