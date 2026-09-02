import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedOperatingCostMinor: readonly number[];
  readonly callerExcludedCostFlags: readonly number[];
  readonly observedOperatingIncomeMinor: readonly number[];
  readonly callerExcludedIncomeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerAdjustedOperatingCostMinor: number;
  readonly callerAdjustedOperatingIncomeMinor: number;
  readonly callerAdjustedCostIncomeRatio: number;
}>;
const inputFields = [
  {
    id: "observedOperatingCostMinor",
    label: "Observed operating cost minor",
    kind: "numberList",
  },
  {
    id: "callerExcludedCostFlags",
    label: "Caller excluded cost flags",
    kind: "numberList",
  },
  {
    id: "observedOperatingIncomeMinor",
    label: "Observed operating income minor",
    kind: "numberList",
  },
  {
    id: "callerExcludedIncomeFlags",
    label: "Caller excluded income flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const [v, f] of [
    [input.observedOperatingCostMinor, input.callerExcludedCostFlags],
    [input.observedOperatingIncomeMinor, input.callerExcludedIncomeFlags],
  ]) {
    aligned(v, f, "adjustments");
    binary(f, "exclusion");
    v.forEach((x) => money(x));
  }
  const costs = sumMoney(
      input.observedOperatingCostMinor.filter(
        (_, i) => !input.callerExcludedCostFlags[i],
      ),
    ),
    income = sumMoney(
      input.observedOperatingIncomeMinor.filter(
        (_, i) => !input.callerExcludedIncomeFlags[i],
      ),
    );
  positive(income, "adjusted income");
  return {
    callerAdjustedOperatingCostMinor: costs,
    callerAdjustedOperatingIncomeMinor: income,
    callerAdjustedCostIncomeRatio: costs / income,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOperatingCostMinor: [100, 50],
  callerExcludedCostFlags: [0, 1],
  observedOperatingIncomeMinor: [200, 100],
  callerExcludedIncomeFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  callerAdjustedOperatingCostMinor: 100,
  callerAdjustedOperatingIncomeMinor: 200,
  callerAdjustedCostIncomeRatio: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cost-to-income-efficiency-ratio",
  title: "Cost To Income Efficiency Ratio Calculator",
  description:
    "Audit caller-adjusted bank efficiency from separate cost/income ledgers and independently resolved exclusions, not basic ratio with unverified gross definitions. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAdjustedOperatingCostMinor",
      label: "Caller adjusted operating cost minor",
      kind: "number",
    },
    {
      id: "callerAdjustedOperatingIncomeMinor",
      label: "Caller adjusted operating income minor",
      kind: "number",
    },
    {
      id: "callerAdjustedCostIncomeRatio",
      label: "Caller adjusted cost income ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOperatingCostMinor:
        value.observedOperatingCostMinor as readonly number[],
      callerExcludedCostFlags:
        value.callerExcludedCostFlags as readonly number[],
      observedOperatingIncomeMinor:
        value.observedOperatingIncomeMinor as readonly number[],
      callerExcludedIncomeFlags:
        value.callerExcludedIncomeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
