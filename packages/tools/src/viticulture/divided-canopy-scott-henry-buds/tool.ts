import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  bounded,
  aligned,
  sumMoney,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedScottHenryUpperCurtainBudCounts: readonly number[];
  readonly observedScottHenryLowerCurtainBudCounts: readonly number[];
  readonly callerUpperBudBurstFractions: readonly number[];
  readonly callerLowerBudBurstFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly expectedUpperCurtainBurstShoots: readonly number[];
  readonly expectedLowerCurtainBurstShoots: readonly number[];
  readonly expectedUpperLowerBurstImbalance: readonly number[];
  readonly totalRetainedCurtainBudCount: number;
}>;
const inputFields = [
  {
    id: "observedScottHenryUpperCurtainBudCounts",
    label: "Observed scott henry upper curtain bud counts",
    kind: "numberList",
  },
  {
    id: "observedScottHenryLowerCurtainBudCounts",
    label: "Observed scott henry lower curtain bud counts",
    kind: "numberList",
  },
  {
    id: "callerUpperBudBurstFractions",
    label: "Caller upper bud burst fractions",
    kind: "numberList",
  },
  {
    id: "callerLowerBudBurstFractions",
    label: "Caller lower bud burst fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerUpperBudBurstFractions.forEach((v) =>
    fraction(v, "callerUpperBudBurstFractions"),
  );
  input.callerLowerBudBurstFractions.forEach((v) =>
    fraction(v, "callerLowerBudBurstFractions"),
  );
  aligned(
    input.observedScottHenryUpperCurtainBudCounts,
    input.observedScottHenryLowerCurtainBudCounts,
    "observedScottHenryUpperCurtainBudCounts",
  );
  aligned(
    input.observedScottHenryUpperCurtainBudCounts,
    input.callerUpperBudBurstFractions,
    "observedScottHenryUpperCurtainBudCounts",
  );
  aligned(
    input.observedScottHenryUpperCurtainBudCounts,
    input.callerLowerBudBurstFractions,
    "observedScottHenryUpperCurtainBudCounts",
  );
  [
    ...input.observedScottHenryUpperCurtainBudCounts,
    ...input.observedScottHenryLowerCurtainBudCounts,
  ].forEach((v) => bounded(v, "buds", 0, 1000000));
  const upper = input.observedScottHenryUpperCurtainBudCounts.map(
      (v, i) => v * input.callerUpperBudBurstFractions[i],
    ),
    lower = input.observedScottHenryLowerCurtainBudCounts.map(
      (v, i) => v * input.callerLowerBudBurstFractions[i],
    );
  return {
    expectedUpperCurtainBurstShoots: upper,
    expectedLowerCurtainBurstShoots: lower,
    expectedUpperLowerBurstImbalance: upper.map((v, i) => v - lower[i]),
    totalRetainedCurtainBudCount: sumMoney([
      ...input.observedScottHenryUpperCurtainBudCounts,
      ...input.observedScottHenryLowerCurtainBudCounts,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedScottHenryUpperCurtainBudCounts: [10, 20],
  observedScottHenryLowerCurtainBudCounts: [8, 10],
  callerUpperBudBurstFractions: [0.8, 0.5],
  callerLowerBudBurstFractions: [0.5, 0.9],
} satisfies Input;
export const exampleOutput = {
  expectedUpperCurtainBurstShoots: [8, 10],
  expectedLowerCurtainBurstShoots: [4, 9],
  expectedUpperLowerBurstImbalance: [4, 1],
  totalRetainedCurtainBudCount: 48,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/divided-canopy-scott-henry-buds",
  title: "Divided Canopy Scott Henry Buds Calculator",
  description:
    "Account actual Scott-Henry upper/lower retained buds and independent curtain-specific burst scenarios; expected fractional shoots not existing observed Smart-Dyson shoot inventory, no prescribed curtain balance.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedUpperCurtainBurstShoots",
      label: "Expected upper curtain burst shoots",
      kind: "numberList",
    },
    {
      id: "expectedLowerCurtainBurstShoots",
      label: "Expected lower curtain burst shoots",
      kind: "numberList",
    },
    {
      id: "expectedUpperLowerBurstImbalance",
      label: "Expected upper lower burst imbalance",
      kind: "numberList",
    },
    {
      id: "totalRetainedCurtainBudCount",
      label: "Total retained curtain bud count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedScottHenryUpperCurtainBudCounts:
        value.observedScottHenryUpperCurtainBudCounts as readonly number[],
      observedScottHenryLowerCurtainBudCounts:
        value.observedScottHenryLowerCurtainBudCounts as readonly number[],
      callerUpperBudBurstFractions:
        value.callerUpperBudBurstFractions as readonly number[],
      callerLowerBudBurstFractions:
        value.callerLowerBudBurstFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
