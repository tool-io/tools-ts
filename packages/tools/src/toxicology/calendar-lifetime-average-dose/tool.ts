import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly exposureStartDays: readonly number[];
  readonly exposureDurationsDays: readonly number[];
  readonly dailyDosesMgPerKg: readonly number[];
  readonly lifetimeDays: number;
}>;
export type Output = Readonly<{
  readonly segmentLifetimeContributions: readonly number[];
  readonly lifetimeAverageDailyDose: number;
}>;
const inputFields = [
  { id: "exposureStartDays", label: "Exposure start days", kind: "numberList" },
  {
    id: "exposureDurationsDays",
    label: "Exposure durations days",
    kind: "numberList",
  },
  {
    id: "dailyDosesMgPerKg",
    label: "Daily doses mg per kg",
    kind: "numberList",
    unit: "kg",
  },
  { id: "lifetimeDays", label: "Lifetime days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.exposureStartDays,
    input.exposureDurationsDays,
    "exposureStartDays",
  );
  aligned(
    input.exposureStartDays,
    input.dailyDosesMgPerKg,
    "exposureStartDays",
  );
  positive(input.lifetimeDays, "lifetimeDays");
  let previousEnd = 0;
  input.exposureStartDays.forEach((v, i) => {
    nonnegative(v, "exposureStartDays");
    positive(input.exposureDurationsDays[i], "exposureDurationsDays");
    nonnegative(input.dailyDosesMgPerKg[i], "dailyDosesMgPerKg");
    const end = v + input.exposureDurationsDays[i];
    if (v < previousEnd || end > input.lifetimeDays)
      simpleError(
        "exposureStartDays",
        "Ordered nonoverlapping exposure segments within lifetime required.",
      );
    previousEnd = end;
  });
  const segmentLifetimeContributions = input.dailyDosesMgPerKg.map(
    (v, i) => (v * input.exposureDurationsDays[i]) / input.lifetimeDays,
  );
  return {
    segmentLifetimeContributions,
    lifetimeAverageDailyDose: segmentLifetimeContributions.reduce(
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
  exposureStartDays: [0, 100],
  exposureDurationsDays: [10, 20],
  dailyDosesMgPerKg: [1, 2],
  lifetimeDays: 1000,
} satisfies Input;
export const exampleOutput = {
  segmentLifetimeContributions: [0.01, 0.04],
  lifetimeAverageDailyDose: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/calendar-lifetime-average-dose",
  title: "Lifetime Average Daily Dose",
  description:
    "Integrate nonoverlapping exposure calendar segments into lifetime-average daily dose, with nonexposed days contributing zero; lifetime and exposures are caller scenarios.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentLifetimeContributions",
      label: "Segment lifetime contributions",
      kind: "numberList",
    },
    {
      id: "lifetimeAverageDailyDose",
      label: "Lifetime average daily dose",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      exposureStartDays: value.exposureStartDays as readonly number[],
      exposureDurationsDays: value.exposureDurationsDays as readonly number[],
      dailyDosesMgPerKg: value.dailyDosesMgPerKg as readonly number[],
      lifetimeDays: value.lifetimeDays as number,
    }),
});
export const run = tool.execute;
export default tool;
