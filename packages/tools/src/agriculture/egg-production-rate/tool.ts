import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly collectedEggCounts: readonly number[];
  readonly layingHenCounts: readonly number[];
  readonly intervalDays: readonly number[];
  readonly unmarketableEggCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalObservedHenDays: number;
  readonly henDayEggProductionPercent: number;
  readonly marketableEggsPerHenDay: number;
}>;
const inputFields = [
  {
    id: "collectedEggCounts",
    label: "Collected egg counts",
    kind: "numberList",
  },
  { id: "layingHenCounts", label: "Laying hen counts", kind: "numberList" },
  { id: "intervalDays", label: "Interval days", kind: "numberList" },
  {
    id: "unmarketableEggCounts",
    label: "Unmarketable egg counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalDays.forEach((v) => positive(v, "intervalDays"));
  input.collectedEggCounts.forEach((v) => count(v, "collectedEggCounts"));
  input.layingHenCounts.forEach((v) => count(v, "layingHenCounts"));
  input.unmarketableEggCounts.forEach((v) => count(v, "unmarketableEggCounts"));
  aligned(
    input.collectedEggCounts,
    input.layingHenCounts,
    "collectedEggCounts",
  );
  aligned(input.collectedEggCounts, input.intervalDays, "collectedEggCounts");
  aligned(
    input.collectedEggCounts,
    input.unmarketableEggCounts,
    "collectedEggCounts",
  );
  const totalObservedHenDays = positive(
      input.layingHenCounts.reduce(
        (s, v, i) => s + v * input.intervalDays[i],
        0,
      ),
      "henDays",
    ),
    market = input.collectedEggCounts.reduce(
      (s, v, i) =>
        s + count(v - input.unmarketableEggCounts[i], "unmarketableEggCounts"),
      0,
    );
  return {
    totalObservedHenDays,
    henDayEggProductionPercent:
      (100 * input.collectedEggCounts.reduce((a, b) => a + b, 0)) /
      totalObservedHenDays,
    marketableEggsPerHenDay: market / totalObservedHenDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  collectedEggCounts: [50, 100],
  layingHenCounts: [100, 100],
  intervalDays: [1, 2],
  unmarketableEggCounts: [5, 10],
} satisfies Input;
export const exampleOutput = {
  totalObservedHenDays: 300,
  henDayEggProductionPercent: 50,
  marketableEggsPerHenDay: 0.45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/egg-production-rate",
  title: "Agriculture Egg Production Rate",
  description:
    "Account gross/marketable observed egg inventory per actual hen-days with varying collection periods; hen-day production is eggs per hen-day×100, not a binomial egg probability or nutritional adequacy.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalObservedHenDays",
      label: "Total observed hen days",
      kind: "number",
    },
    {
      id: "henDayEggProductionPercent",
      label: "Hen day egg production percent",
      kind: "number",
    },
    {
      id: "marketableEggsPerHenDay",
      label: "Marketable eggs per hen day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      collectedEggCounts: value.collectedEggCounts as readonly number[],
      layingHenCounts: value.layingHenCounts as readonly number[],
      intervalDays: value.intervalDays as readonly number[],
      unmarketableEggCounts: value.unmarketableEggCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
