import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly activeEndCounts: readonly number[];
  readonly deliverySpeedsMPerMinute: readonly number[];
  readonly yarnDeniers: readonly number[];
  readonly productiveFractions: readonly number[];
  readonly saleableFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly saleableKgPerHourByBank: readonly number[];
  readonly totalSaleableKgPerHour: number;
}>;
const inputFields = [
  { id: "activeEndCounts", label: "Active end counts", kind: "numberList" },
  {
    id: "deliverySpeedsMPerMinute",
    label: "Delivery speeds m per minute",
    kind: "numberList",
  },
  { id: "yarnDeniers", label: "Yarn deniers", kind: "numberList" },
  {
    id: "productiveFractions",
    label: "Productive fractions",
    kind: "numberList",
  },
  { id: "saleableFractions", label: "Saleable fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.yarnDeniers.forEach((v) => positive(v, "yarnDeniers"));
  input.deliverySpeedsMPerMinute.forEach((v) =>
    nonnegative(v, "deliverySpeedsMPerMinute"),
  );
  input.productiveFractions.forEach((v) => fraction(v, "productiveFractions"));
  input.saleableFractions.forEach((v) => fraction(v, "saleableFractions"));
  input.activeEndCounts.forEach((v) => count(v, "activeEndCounts"));
  aligned(
    input.activeEndCounts,
    input.deliverySpeedsMPerMinute,
    "activeEndCounts",
  );
  aligned(input.activeEndCounts, input.yarnDeniers, "activeEndCounts");
  aligned(input.activeEndCounts, input.productiveFractions, "activeEndCounts");
  aligned(input.activeEndCounts, input.saleableFractions, "activeEndCounts");
  const saleableKgPerHourByBank = input.activeEndCounts.map(
    (v, i) =>
      ((v * input.deliverySpeedsMPerMinute[i] * 60 * input.yarnDeniers[i]) /
        9000000) *
      input.productiveFractions[i] *
      input.saleableFractions[i],
  );
  return {
    saleableKgPerHourByBank,
    totalSaleableKgPerHour: saleableKgPerHourByBank.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  activeEndCounts: [10, 20],
  deliverySpeedsMPerMinute: [100, 50],
  yarnDeniers: [9, 18],
  productiveFractions: [0.5, 1],
  saleableFractions: [1, 0.8],
} satisfies Input;
export const exampleOutput = {
  saleableKgPerHourByBank: [0.03, 0.096],
  totalSaleableKgPerHour: 0.126,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/automatic-reeling-capacity-kghr",
  title: "Automatic Reeling Capacity KGHR",
  description:
    "Calculate heterogeneous automatic reeling-bank mass throughput from end count, speed, denier, uptime and saleability; not a nominal machine capacity reference.",
  inputs: inputFields,
  outputs: [
    {
      id: "saleableKgPerHourByBank",
      label: "Saleable kg per hour by bank",
      kind: "numberList",
    },
    {
      id: "totalSaleableKgPerHour",
      label: "Total saleable kg per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      activeEndCounts: value.activeEndCounts as readonly number[],
      deliverySpeedsMPerMinute:
        value.deliverySpeedsMPerMinute as readonly number[],
      yarnDeniers: value.yarnDeniers as readonly number[],
      productiveFractions: value.productiveFractions as readonly number[],
      saleableFractions: value.saleableFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
