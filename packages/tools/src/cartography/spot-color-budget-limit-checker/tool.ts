import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly actualSpotColors: number;
  readonly callerMaximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualSpotColors", label: "Actual spot colors", kind: "number" },
  { id: "callerMaximum", label: "Caller maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.actualSpotColors, "colors", 0, 1000);
  bounded(i.callerMaximum, "maximum", 0, 1000);
  return { budgetExceeded: i.actualSpotColors > i.callerMaximum };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { actualSpotColors: 3, callerMaximum: 2 },
  output: { result: { budgetExceeded: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/spot-color-budget-limit-checker",
  title: "Spot Color Count Budget Limit Checker",
  description:
    "Actual spot plate count compared with caller budget limit; no printing cost model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
