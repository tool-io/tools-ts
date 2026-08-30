import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly collectedMilkMassKgByInterval: readonly number[];
  readonly lactatingCowCountsByInterval: readonly number[];
  readonly intervalDurationsDays: readonly number[];
  readonly rejectedMilkMassKgByInterval: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalLactatingCowDays: number;
  readonly grossMilkKgPerLactatingCowDay: number;
  readonly acceptedMilkKgPerLactatingCowDay: number;
}>;
const inputFields = [
  {
    id: "collectedMilkMassKgByInterval",
    label: "Collected milk mass kg by interval",
    kind: "numberList",
  },
  {
    id: "lactatingCowCountsByInterval",
    label: "Lactating cow counts by interval",
    kind: "numberList",
  },
  {
    id: "intervalDurationsDays",
    label: "Interval durations days",
    kind: "numberList",
  },
  {
    id: "rejectedMilkMassKgByInterval",
    label: "Rejected milk mass kg by interval",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalDurationsDays.forEach((v) =>
    positive(v, "intervalDurationsDays"),
  );
  input.collectedMilkMassKgByInterval.forEach((v) =>
    nonnegative(v, "collectedMilkMassKgByInterval"),
  );
  input.rejectedMilkMassKgByInterval.forEach((v) =>
    nonnegative(v, "rejectedMilkMassKgByInterval"),
  );
  input.lactatingCowCountsByInterval.forEach((v) =>
    count(v, "lactatingCowCountsByInterval"),
  );
  aligned(
    input.collectedMilkMassKgByInterval,
    input.lactatingCowCountsByInterval,
    "collectedMilkMassKgByInterval",
  );
  aligned(
    input.collectedMilkMassKgByInterval,
    input.intervalDurationsDays,
    "collectedMilkMassKgByInterval",
  );
  aligned(
    input.collectedMilkMassKgByInterval,
    input.rejectedMilkMassKgByInterval,
    "collectedMilkMassKgByInterval",
  );
  const totalLactatingCowDays = positive(
      input.lactatingCowCountsByInterval.reduce(
        (s, v, i) => s + v * input.intervalDurationsDays[i],
        0,
      ),
      "cowDays",
    ),
    accepted = input.collectedMilkMassKgByInterval.reduce(
      (s, v, i) =>
        s +
        nonnegative(v - input.rejectedMilkMassKgByInterval[i], "rejectedMilk"),
      0,
    );
  return {
    totalLactatingCowDays,
    grossMilkKgPerLactatingCowDay:
      input.collectedMilkMassKgByInterval.reduce((a, b) => a + b, 0) /
      totalLactatingCowDays,
    acceptedMilkKgPerLactatingCowDay: accepted / totalLactatingCowDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  collectedMilkMassKgByInterval: [100, 300],
  lactatingCowCountsByInterval: [10, 20],
  intervalDurationsDays: [1, 2],
  rejectedMilkMassKgByInterval: [10, 30],
} satisfies Input;
export const exampleOutput = {
  totalLactatingCowDays: 50,
  grossMilkKgPerLactatingCowDay: 8,
  acceptedMilkKgPerLactatingCowDay: 7.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/milk-yield-per-cow",
  title: "Agriculture Milk Yield Per Cow",
  description:
    "Normalize interval milk inventories by actual lactating cow-days, separating accepted and rejected milk; not an unweighted per-cow average or a production/health guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalLactatingCowDays",
      label: "Total lactating cow days",
      kind: "number",
    },
    {
      id: "grossMilkKgPerLactatingCowDay",
      label: "Gross milk kg per lactating cow day",
      kind: "number",
    },
    {
      id: "acceptedMilkKgPerLactatingCowDay",
      label: "Accepted milk kg per lactating cow day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      collectedMilkMassKgByInterval:
        value.collectedMilkMassKgByInterval as readonly number[],
      lactatingCowCountsByInterval:
        value.lactatingCowCountsByInterval as readonly number[],
      intervalDurationsDays: value.intervalDurationsDays as readonly number[],
      rejectedMilkMassKgByInterval:
        value.rejectedMilkMassKgByInterval as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
