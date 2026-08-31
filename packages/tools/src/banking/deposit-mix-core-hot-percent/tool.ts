import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly depositAmountsMinor: readonly number[];
  readonly callerCoreZeroHotOneUnknownTwoCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly coreDepositAmountMinor: number;
  readonly hotDepositAmountMinor: number;
  readonly unknownDepositAmountMinor: number;
  readonly coreHotUnknownSharePercents: readonly number[];
}>;
const inputFields = [
  {
    id: "depositAmountsMinor",
    label: "Deposit amounts minor",
    kind: "numberList",
  },
  {
    id: "callerCoreZeroHotOneUnknownTwoCodes",
    label: "Caller core zero hot one unknown two codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depositAmountsMinor.forEach((v) => money(v, "depositAmountsMinor"));
  aligned(
    input.depositAmountsMinor,
    input.callerCoreZeroHotOneUnknownTwoCodes,
    "depositAmountsMinor",
  );
  input.callerCoreZeroHotOneUnknownTwoCodes.forEach((v) =>
    bounded(v, "class", 0, 2),
  );
  const total = positive(sumMoney(input.depositAmountsMinor), "deposits"),
    amounts = [0, 1, 2].map((k) =>
      sumMoney(
        input.depositAmountsMinor.filter(
          (_, i) => input.callerCoreZeroHotOneUnknownTwoCodes[i] === k,
        ),
      ),
    );
  return {
    coreDepositAmountMinor: amounts[0],
    hotDepositAmountMinor: amounts[1],
    unknownDepositAmountMinor: amounts[2],
    coreHotUnknownSharePercents: amounts.map((v) => (100 * v) / total),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depositAmountsMinor: [100, 200, 300],
  callerCoreZeroHotOneUnknownTwoCodes: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  coreDepositAmountMinor: 100,
  hotDepositAmountMinor: 200,
  unknownDepositAmountMinor: 300,
  coreHotUnknownSharePercents: [16.666666666666668, 33.333333333333336, 50],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/deposit-mix-core-hot-percent",
  title: "Deposit Mix Core vs Hot Percent Calculator",
  description:
    "Audit actual deposit mix under explicit core/hot/unknown annotations without assuming unknown balances are stable; caller concentration/stability labels are not liquidity stress calibration or a bank safety rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "coreDepositAmountMinor",
      label: "Core deposit amount minor",
      kind: "number",
    },
    {
      id: "hotDepositAmountMinor",
      label: "Hot deposit amount minor",
      kind: "number",
    },
    {
      id: "unknownDepositAmountMinor",
      label: "Unknown deposit amount minor",
      kind: "number",
    },
    {
      id: "coreHotUnknownSharePercents",
      label: "Core hot unknown share percents",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depositAmountsMinor: value.depositAmountsMinor as readonly number[],
      callerCoreZeroHotOneUnknownTwoCodes:
        value.callerCoreZeroHotOneUnknownTwoCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
