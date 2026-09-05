import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  fraction,
  money,
  roundMinor,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly fullReinstatementPremiumMinor: number;
  readonly usedLimitNumerator: number;
  readonly usedLimitDenominator: number;
  readonly remainingTimeNumerator: number;
  readonly remainingTimeDenominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "fullReinstatementPremiumMinor",
    label: "Full reinstatement premium minor",
    kind: "number",
  },
  { id: "usedLimitNumerator", label: "Used limit numerator", kind: "number" },
  {
    id: "usedLimitDenominator",
    label: "Used limit denominator",
    kind: "number",
  },
  {
    id: "remainingTimeNumerator",
    label: "Remaining time numerator",
    kind: "number",
  },
  {
    id: "remainingTimeDenominator",
    label: "Remaining time denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.fullReinstatementPremiumMinor, "premium");
  bounded(input.usedLimitDenominator, "denominator", 1, 1000000000);
  bounded(input.remainingTimeDenominator, "denominator", 1, 1000000000);
  bounded(input.usedLimitNumerator, "fraction", 0, input.usedLimitDenominator);
  bounded(
    input.remainingTimeNumerator,
    "fraction",
    0,
    input.remainingTimeDenominator,
  );
  return {
    conditionalReinstatementPremiumMinor: roundMinor(
      BigInt(input.fullReinstatementPremiumMinor) *
        BigInt(input.usedLimitNumerator) *
        BigInt(input.remainingTimeNumerator),
      BigInt(input.usedLimitDenominator) *
        BigInt(input.remainingTimeDenominator),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    fullReinstatementPremiumMinor: 10000,
    usedLimitNumerator: 1,
    usedLimitDenominator: 2,
    remainingTimeNumerator: 1,
    remainingTimeDenominator: 4,
  },
  output: { result: { conditionalReinstatementPremiumMinor: 1250 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/xol-reinstatement-premium-pro-rata-lookup",
  title: "XOL Reinstatement Premium Pro Rata Lookup",
  description:
    "Conditional pro-rata amount-and-time XOL reinstatement premium using independently applicable exact integer fractions. Exact one-currency minor rounding nearest/ties away from zero; no implied universal treaty basis or authorization to reinstate.",
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
