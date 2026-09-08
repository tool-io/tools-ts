import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly realizedEligibleLossMinor: number;
  readonly eligibleCapitalGainMinor: number;
  readonly callerOrdinaryOffsetCapMinor: number;
}>;
export type Output = Readonly<{
  readonly capitalGainOffsetMinor: number;
  readonly ordinaryIncomeOffsetMinor: number;
  readonly unappliedLossMinor: number;
}>;
const inputFields = [
  {
    id: "realizedEligibleLossMinor",
    label: "Realized eligible loss minor",
    kind: "number",
  },
  {
    id: "eligibleCapitalGainMinor",
    label: "Eligible capital gain minor",
    kind: "number",
  },
  {
    id: "callerOrdinaryOffsetCapMinor",
    label: "Caller ordinary offset cap minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.realizedEligibleLossMinor, "realizedEligibleLossMinor");
  money(input.eligibleCapitalGainMinor, "eligibleCapitalGainMinor");
  money(input.callerOrdinaryOffsetCapMinor, "callerOrdinaryOffsetCapMinor");
  const g = Math.min(
      input.realizedEligibleLossMinor,
      input.eligibleCapitalGainMinor,
    ),
    remaining = input.realizedEligibleLossMinor - g,
    o = Math.min(remaining, input.callerOrdinaryOffsetCapMinor);
  return {
    capitalGainOffsetMinor: g,
    ordinaryIncomeOffsetMinor: o,
    unappliedLossMinor: remaining - o,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realizedEligibleLossMinor: 100,
  eligibleCapitalGainMinor: 40,
  callerOrdinaryOffsetCapMinor: 30,
} satisfies Input;
export const exampleOutput = {
  capitalGainOffsetMinor: 40,
  ordinaryIncomeOffsetMinor: 30,
  unappliedLossMinor: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/tax-loss-harvest-offset-limit-checker",
  title: "Tax Loss Harvest Offset Limit Calculator",
  description:
    "Sequential eligible loss offsets to gains then caller ordinary-income cap, residual retained; no wash-sale/account/status applicability inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "capitalGainOffsetMinor",
      label: "Capital gain offset minor",
      kind: "number",
    },
    {
      id: "ordinaryIncomeOffsetMinor",
      label: "Ordinary income offset minor",
      kind: "number",
    },
    { id: "unappliedLossMinor", label: "Unapplied loss minor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      realizedEligibleLossMinor: value.realizedEligibleLossMinor as number,
      eligibleCapitalGainMinor: value.eligibleCapitalGainMinor as number,
      callerOrdinaryOffsetCapMinor:
        value.callerOrdinaryOffsetCapMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
