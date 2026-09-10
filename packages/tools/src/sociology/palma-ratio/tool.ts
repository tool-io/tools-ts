import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTopDecileIncomeTotal: number;
  readonly callerVerifiedBottomFourDecilesIncomeTotal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedTopDecileIncomeTotal",
    label: "Caller verified top decile income total",
    kind: "number",
  },
  {
    id: "callerVerifiedBottomFourDecilesIncomeTotal",
    label: "Caller verified bottom four deciles income total",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerVerifiedTopDecileIncomeTotal, "top");
  positive(input.callerVerifiedBottomFourDecilesIncomeTotal, "bottom");
  return {
    observedPalmaRatio:
      input.callerVerifiedTopDecileIncomeTotal /
      input.callerVerifiedBottomFourDecilesIncomeTotal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedTopDecileIncomeTotal: 40,
    callerVerifiedBottomFourDecilesIncomeTotal: 20,
  },
  output: { result: { observedPalmaRatio: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/palma-ratio",
  title: "Palma Ratio Calculator",
  description:
    "Palma ratio of independently enumerated richest10%/poorest40%income totals under matching sample/weight conventions. Not rank interpolation or s80/s20ratio; actual group assignment external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
