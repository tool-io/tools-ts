import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly comparableReplacementStoneQuotes: readonly number[];
  readonly replacementSettingQuotes: readonly number[];
  readonly restorationLaborQuotes: readonly number[];
  readonly quoteCurrencyMultipliers: readonly number[];
  readonly policyAdditionalCostFraction: number;
}>;
export type Output = Readonly<{
  readonly itemModeledReplacementValues: readonly number[];
  readonly totalModeledReplacementValue: number;
}>;
const inputFields = [
  {
    id: "comparableReplacementStoneQuotes",
    label: "Comparable replacement stone quotes",
    kind: "numberList",
  },
  {
    id: "replacementSettingQuotes",
    label: "Replacement setting quotes",
    kind: "numberList",
  },
  {
    id: "restorationLaborQuotes",
    label: "Restoration labor quotes",
    kind: "numberList",
  },
  {
    id: "quoteCurrencyMultipliers",
    label: "Quote currency multipliers",
    kind: "numberList",
  },
  {
    id: "policyAdditionalCostFraction",
    label: "Policy additional cost fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.quoteCurrencyMultipliers.forEach((v) =>
    positive(v, "quoteCurrencyMultipliers"),
  );
  input.comparableReplacementStoneQuotes.forEach((v) =>
    nonnegative(v, "comparableReplacementStoneQuotes"),
  );
  input.replacementSettingQuotes.forEach((v) =>
    nonnegative(v, "replacementSettingQuotes"),
  );
  input.restorationLaborQuotes.forEach((v) =>
    nonnegative(v, "restorationLaborQuotes"),
  );
  nonnegative(
    input.policyAdditionalCostFraction,
    "policyAdditionalCostFraction",
  );
  aligned(
    input.comparableReplacementStoneQuotes,
    input.replacementSettingQuotes,
    "comparableReplacementStoneQuotes",
  );
  aligned(
    input.comparableReplacementStoneQuotes,
    input.restorationLaborQuotes,
    "comparableReplacementStoneQuotes",
  );
  aligned(
    input.comparableReplacementStoneQuotes,
    input.quoteCurrencyMultipliers,
    "comparableReplacementStoneQuotes",
  );
  const itemModeledReplacementValues =
    input.comparableReplacementStoneQuotes.map(
      (v, i) =>
        (v +
          input.replacementSettingQuotes[i] +
          input.restorationLaborQuotes[i]) *
        input.quoteCurrencyMultipliers[i] *
        (1 + input.policyAdditionalCostFraction),
    );
  return {
    itemModeledReplacementValues,
    totalModeledReplacementValue: itemModeledReplacementValues.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  comparableReplacementStoneQuotes: [100, 200],
  replacementSettingQuotes: [50, 60],
  restorationLaborQuotes: [20, 30],
  quoteCurrencyMultipliers: [1, 2],
  policyAdditionalCostFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  itemModeledReplacementValues: [187, 638],
  totalModeledReplacementValue: 825,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/appraisal-retail-replacement",
  title: "Appraisal Retail Replacement Value",
  description:
    "Build caller replacement scenarios from comparable stone, setting and restoration quotes with explicit currency/policy cost additions; not a professional appraisal, wholesale resale or guaranteed insurer valuation.",
  inputs: inputFields,
  outputs: [
    {
      id: "itemModeledReplacementValues",
      label: "Item modeled replacement values",
      kind: "numberList",
    },
    {
      id: "totalModeledReplacementValue",
      label: "Total modeled replacement value",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      comparableReplacementStoneQuotes:
        value.comparableReplacementStoneQuotes as readonly number[],
      replacementSettingQuotes:
        value.replacementSettingQuotes as readonly number[],
      restorationLaborQuotes: value.restorationLaborQuotes as readonly number[],
      quoteCurrencyMultipliers:
        value.quoteCurrencyMultipliers as readonly number[],
      policyAdditionalCostFraction:
        value.policyAdditionalCostFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
