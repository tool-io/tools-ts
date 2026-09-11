import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedBreakingForceNewtons: number;
  readonly independentlyVerifiedWllForceNewtons: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedBreakingForceNewtons",
    label: "Independently verified breaking force newtons",
    kind: "number",
  },
  {
    id: "independentlyVerifiedWllForceNewtons",
    label: "Independently verified wll force newtons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyVerifiedBreakingForceNewtons, "breaking");
  positive(input.independentlyVerifiedWllForceNewtons, "WLL");
  const r =
    input.independentlyVerifiedBreakingForceNewtons /
    input.independentlyVerifiedWllForceNewtons;
  return { statedBreakingToWllRatio: r, meetsNominalFiveRatio: r >= 5 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedBreakingForceNewtons: 5000,
    independentlyVerifiedWllForceNewtons: 1000,
  },
  output: {
    result: { statedBreakingToWllRatio: 5, meetsNominalFiveRatio: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/wll-safety-factor-5-to-1-checker",
  title: "WLL Safety Factor 5 To 1 Checker",
  description:
    "Arithmetic ratio of independently verified compatible breaking/WLLforce values against nominal5, in the titles convention only. Not select/derive WLL, approve actual loads, universal statutory safety factor or certify hardware.",
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
