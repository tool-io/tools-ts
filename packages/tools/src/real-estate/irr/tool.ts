import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, irrScope } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualConventionalPeriodicCashFlows: readonly number[];
  readonly actualCallerBracketLowerRate: number;
  readonly actualCallerBracketUpperRate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualConventionalPeriodicCashFlows",
    label: "Actual conventional periodic cash flows",
    kind: "numberList",
  },
  {
    id: "actualCallerBracketLowerRate",
    label: "Actual caller bracket lower rate",
    kind: "number",
  },
  {
    id: "actualCallerBracketUpperRate",
    label: "Actual caller bracket upper rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    conditionalPeriodicIrr: irrScope(
      input.actualConventionalPeriodicCashFlows,
      input.actualCallerBracketLowerRate,
      input.actualCallerBracketUpperRate,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualConventionalPeriodicCashFlows: [-100, 110],
    actualCallerBracketLowerRate: -0.5,
    actualCallerBracketUpperRate: 0.5,
  },
  output: { result: { conditionalPeriodicIrr: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/irr",
  title: "Real Estate IRR Calculator",
  description:
    "ConventionalperiodicIRR, bounded bisection under one initial negative cashflow/nonnegative future cash flows, external sign-changing rate bracket>-1. Multiple-sign-change ambiguous IRR srejected, no date-irregularXIRR, investment forecast or guaranteed return.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
