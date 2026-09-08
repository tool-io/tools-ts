import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  sumMoney,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentlyNetRealizableAssetValuesMinor: readonly number[];
  readonly observedMonthlyDisposableIncomeMinor: number;
  readonly callerFutureIncomeMonths: number;
}>;
export type Output = Readonly<{
  readonly conditionalCollectionPotentialMinor: number;
}>;
const inputFields = [
  {
    id: "independentlyNetRealizableAssetValuesMinor",
    label: "Independently net realizable asset values minor",
    kind: "numberList",
  },
  {
    id: "observedMonthlyDisposableIncomeMinor",
    label: "Observed monthly disposable income minor",
    kind: "number",
  },
  {
    id: "callerFutureIncomeMonths",
    label: "Caller future income months",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyNetRealizableAssetValuesMinor.forEach((v) =>
    money(v, "independentlyNetRealizableAssetValuesMinor"),
  );
  money(
    input.observedMonthlyDisposableIncomeMinor,
    "observedMonthlyDisposableIncomeMinor",
  );
  bounded(input.callerFutureIncomeMonths, "months", 0, 1200);
  const future = roundMinor(
    BigInt(input.observedMonthlyDisposableIncomeMinor) *
      BigInt(input.callerFutureIncomeMonths),
    1n,
  );
  return {
    conditionalCollectionPotentialMinor: sumMoney([
      sumMoney(input.independentlyNetRealizableAssetValuesMinor),
      future,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyNetRealizableAssetValuesMinor: [30, 40],
  observedMonthlyDisposableIncomeMinor: 10,
  callerFutureIncomeMonths: 12,
} satisfies Input;
export const exampleOutput = {
  conditionalCollectionPotentialMinor: 190,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/oic-offer-compromise-collection-potential-calculator",
  title: "OIC Offer Compromise Collection Potential Calculator",
  description:
    "Offer-in-compromise conditional realizable assetPLUSfuture-income collection potential, caller independently establishes equity exclusions/expense allowances/method horizon; no offer acceptance. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalCollectionPotentialMinor",
      label: "Conditional collection potential minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyNetRealizableAssetValuesMinor:
        value.independentlyNetRealizableAssetValuesMinor as readonly number[],
      observedMonthlyDisposableIncomeMinor:
        value.observedMonthlyDisposableIncomeMinor as number,
      callerFutureIncomeMonths: value.callerFutureIncomeMonths as number,
    }),
});
export const run = tool.execute;
export default tool;
