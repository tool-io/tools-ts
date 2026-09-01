import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  weightedMinor,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedGoldHoldingValueMinor: number;
  readonly observedSilverHoldingValueMinor: number;
  readonly callerTargetGoldValueBasisPoints: number;
  readonly callerSameTimeGoldPriceMinorPerGram: number;
  readonly callerSameTimeSilverPriceMinorPerGram: number;
}>;
export type Output = Readonly<{
  readonly callerTargetGoldValueMinor: number;
  readonly signedGoldValueTradeMinor: number;
  readonly signedSilverValueTradeMinor: number;
  readonly signedGoldTradeGrams: number;
  readonly signedSilverTradeGrams: number;
  readonly observedSameTimeGoldSilverPriceRatio: number;
}>;
const inputFields = [
  {
    id: "observedGoldHoldingValueMinor",
    label: "Observed gold holding value minor",
    kind: "number",
  },
  {
    id: "observedSilverHoldingValueMinor",
    label: "Observed silver holding value minor",
    kind: "number",
  },
  {
    id: "callerTargetGoldValueBasisPoints",
    label: "Caller target gold value basis points",
    kind: "number",
  },
  {
    id: "callerSameTimeGoldPriceMinorPerGram",
    label: "Caller same time gold price minor per gram",
    kind: "number",
  },
  {
    id: "callerSameTimeSilverPriceMinorPerGram",
    label: "Caller same time silver price minor per gram",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedGoldHoldingValueMinor,
    input.observedSilverHoldingValueMinor,
  ].forEach((v) => bounded(v, "holding", 0, 1000000000));
  bounded(input.callerTargetGoldValueBasisPoints, "target", 0, 10000);
  bounded(
    input.callerSameTimeGoldPriceMinorPerGram,
    "goldPrice",
    1,
    1000000000,
  );
  bounded(
    input.callerSameTimeSilverPriceMinorPerGram,
    "silverPrice",
    1,
    1000000000,
  );
  const total = sumMoney([
      input.observedGoldHoldingValueMinor,
      input.observedSilverHoldingValueMinor,
    ]),
    target = weightedMinor(
      total,
      input.callerTargetGoldValueBasisPoints,
      10000,
    ),
    trade = target - input.observedGoldHoldingValueMinor;
  return {
    callerTargetGoldValueMinor: target,
    signedGoldValueTradeMinor: trade,
    signedSilverValueTradeMinor: -trade,
    signedGoldTradeGrams: trade / input.callerSameTimeGoldPriceMinorPerGram,
    signedSilverTradeGrams:
      -trade / input.callerSameTimeSilverPriceMinorPerGram,
    observedSameTimeGoldSilverPriceRatio:
      input.callerSameTimeGoldPriceMinorPerGram /
      input.callerSameTimeSilverPriceMinorPerGram,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGoldHoldingValueMinor: 600,
  observedSilverHoldingValueMinor: 400,
  callerTargetGoldValueBasisPoints: 5000,
  callerSameTimeGoldPriceMinorPerGram: 200,
  callerSameTimeSilverPriceMinorPerGram: 10,
} satisfies Input;
export const exampleOutput = {
  callerTargetGoldValueMinor: 500,
  signedGoldValueTradeMinor: -100,
  signedSilverValueTradeMinor: 100,
  signedGoldTradeGrams: -0.5,
  signedSilverTradeGrams: 10,
  observedSameTimeGoldSilverPriceRatio: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/rebalancing-trade-amount-gsr",
  title: "Rebalancing Trade Amount GSR Calculator",
  description:
    "Solve actual two-metal value reallocation under caller target gold share and same-time/same-currency prices, preserving buy-positive/sell-negative trades; ideal fractional grams, fees/spreads/tax/lot constraints excluded, not allocation advice or scalar GSR alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTargetGoldValueMinor",
      label: "Caller target gold value minor",
      kind: "number",
    },
    {
      id: "signedGoldValueTradeMinor",
      label: "Signed gold value trade minor",
      kind: "number",
    },
    {
      id: "signedSilverValueTradeMinor",
      label: "Signed silver value trade minor",
      kind: "number",
    },
    {
      id: "signedGoldTradeGrams",
      label: "Signed gold trade grams",
      kind: "number",
    },
    {
      id: "signedSilverTradeGrams",
      label: "Signed silver trade grams",
      kind: "number",
    },
    {
      id: "observedSameTimeGoldSilverPriceRatio",
      label: "Observed same time gold silver price ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGoldHoldingValueMinor:
        value.observedGoldHoldingValueMinor as number,
      observedSilverHoldingValueMinor:
        value.observedSilverHoldingValueMinor as number,
      callerTargetGoldValueBasisPoints:
        value.callerTargetGoldValueBasisPoints as number,
      callerSameTimeGoldPriceMinorPerGram:
        value.callerSameTimeGoldPriceMinorPerGram as number,
      callerSameTimeSilverPriceMinorPerGram:
        value.callerSameTimeSilverPriceMinorPerGram as number,
    }),
});
export const run = tool.execute;
export default tool;
