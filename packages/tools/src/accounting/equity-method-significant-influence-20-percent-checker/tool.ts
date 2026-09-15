import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly votingInterestPercent: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "votingInterestPercent",
    label: "Voting interest percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.votingInterestPercent, "interest", 0, 100);
  return { illustrativePresumptionThresholdMet: i.votingInterestPercent >= 20 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { votingInterestPercent: 25 },
  output: { result: { illustrativePresumptionThresholdMet: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/equity-method-significant-influence-20-percent-checker",
  title: "Equity Method Significant Influence 20 Percent Checker",
  description:
    "Illustrative 20% significant-influence presumption screen only; rebuttals, control, substantive rights and actual accounting treatment require independent assessment.",
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
