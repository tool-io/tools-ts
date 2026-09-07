import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  roundMinor,
  brackets,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly ordinaryTaxableIncomeMinor: number;
  readonly eligibleCapitalGainMinor: number;
  readonly callerBracketStartsMinor: readonly number[];
  readonly callerCapitalRateBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly stackedCapitalGainTaxMinor: number;
  readonly signedTotalStackMinor: number;
}>;
const inputFields = [
  {
    id: "ordinaryTaxableIncomeMinor",
    label: "Ordinary taxable income minor",
    kind: "number",
  },
  {
    id: "eligibleCapitalGainMinor",
    label: "Eligible capital gain minor",
    kind: "number",
  },
  {
    id: "callerBracketStartsMinor",
    label: "Caller bracket starts minor",
    kind: "numberList",
  },
  {
    id: "callerCapitalRateBasisPoints",
    label: "Caller capital rate basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.ordinaryTaxableIncomeMinor, "ordinaryTaxableIncomeMinor");
  money(input.eligibleCapitalGainMinor, "eligibleCapitalGainMinor");
  const total = sumMoney([
      input.ordinaryTaxableIncomeMinor,
      input.eligibleCapitalGainMinor,
    ]),
    base = brackets(
      input.ordinaryTaxableIncomeMinor,
      input.callerBracketStartsMinor,
      input.callerCapitalRateBasisPoints,
    ),
    full = brackets(
      total,
      input.callerBracketStartsMinor,
      input.callerCapitalRateBasisPoints,
    );
  const numerator = full.sliceTaxableAmountsMinor.reduce(
    (s, v, i) =>
      s +
      BigInt(v - base.sliceTaxableAmountsMinor[i]) *
        BigInt(input.callerCapitalRateBasisPoints[i]),
    0n,
  );
  return {
    stackedCapitalGainTaxMinor: roundMinor(numerator, 10000n),
    signedTotalStackMinor: total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ordinaryTaxableIncomeMinor: 80,
  eligibleCapitalGainMinor: 50,
  callerBracketStartsMinor: [0, 100],
  callerCapitalRateBasisPoints: [0, 2000],
} satisfies Input;
export const exampleOutput = {
  stackedCapitalGainTaxMinor: 6,
  signedTotalStackMinor: 130,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/capital-gains-stacking-order-bracket-tool",
  title: "Capital Gains Stacking Order Bracket Tool",
  description:
    "Preferential capital gains stacked above ordinary income, explicit same-currency caller rate schedule; final incremental numerator rounded once, no surtax or status inference. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "stackedCapitalGainTaxMinor",
      label: "Stacked capital gain tax minor",
      kind: "number",
    },
    {
      id: "signedTotalStackMinor",
      label: "Signed total stack minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ordinaryTaxableIncomeMinor: value.ordinaryTaxableIncomeMinor as number,
      eligibleCapitalGainMinor: value.eligibleCapitalGainMinor as number,
      callerBracketStartsMinor:
        value.callerBracketStartsMinor as readonly number[],
      callerCapitalRateBasisPoints:
        value.callerCapitalRateBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
