import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly actualInnerStripeWidth: number;
  readonly callerVerifiedFimbriationWidthEachSide: number;
  readonly availablePerpendicularBandEnvelope: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInnerStripeWidth",
    label: "Actual inner stripe width",
    kind: "number",
  },
  {
    id: "callerVerifiedFimbriationWidthEachSide",
    label: "Caller verified fimbriation width each side",
    kind: "number",
  },
  {
    id: "availablePerpendicularBandEnvelope",
    label: "Available perpendicular band envelope",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualInnerStripeWidth, "actualInnerStripeWidth");
  positive(
    input.availablePerpendicularBandEnvelope,
    "availablePerpendicularBandEnvelope",
  );
  nonnegative(
    input.callerVerifiedFimbriationWidthEachSide,
    "callerVerifiedFimbriationWidthEachSide",
  );
  const total =
    input.actualInnerStripeWidth +
    2 * input.callerVerifiedFimbriationWidthEachSide;
  return {
    outerStripeWidth: total,
    signedRemainingEnvelope: input.availablePerpendicularBandEnvelope - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInnerStripeWidth: 20,
    callerVerifiedFimbriationWidthEachSide: 5,
    availablePerpendicularBandEnvelope: 40,
  },
  output: { result: { outerStripeWidth: 30, signedRemainingEnvelope: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/fimbriation-width-rule",
  title: "Fimbriation Stripe Width Rule Calculator",
  description:
    "Fimbriated flag stripe outer width from actual core and independently verified border width on each side; retain signed envelope shortfall, not a universal legal or national fimbriation rule.",
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
