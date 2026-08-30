import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly dailyMeanTemperaturesC: readonly number[];
  readonly dailyDiurnalRangesC: readonly number[];
  readonly callerBaseTemperatureC: number;
  readonly callerMaximumDailyThermalContribution: number;
  readonly callerDiurnalAdjustmentPerDegree: number;
  readonly callerDiurnalReferenceC: number;
  readonly callerDayLengthMultiplier: number;
}>;
export type Output = Readonly<{
  readonly biologicallyEffectiveDailyDegreeDays: readonly number[];
  readonly biologicallyEffectiveDegreeDayTotal: number;
}>;
const inputFields = [
  {
    id: "dailyMeanTemperaturesC",
    label: "Daily mean temperatures c",
    kind: "numberList",
  },
  {
    id: "dailyDiurnalRangesC",
    label: "Daily diurnal ranges c",
    kind: "numberList",
  },
  {
    id: "callerBaseTemperatureC",
    label: "Caller base temperature c",
    kind: "number",
  },
  {
    id: "callerMaximumDailyThermalContribution",
    label: "Caller maximum daily thermal contribution",
    kind: "number",
  },
  {
    id: "callerDiurnalAdjustmentPerDegree",
    label: "Caller diurnal adjustment per degree",
    kind: "number",
  },
  {
    id: "callerDiurnalReferenceC",
    label: "Caller diurnal reference c",
    kind: "number",
  },
  {
    id: "callerDayLengthMultiplier",
    label: "Caller day length multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dailyDiurnalRangesC.forEach((v) =>
    nonnegative(v, "dailyDiurnalRangesC"),
  );
  nonnegative(
    input.callerMaximumDailyThermalContribution,
    "callerMaximumDailyThermalContribution",
  );
  nonnegative(input.callerDayLengthMultiplier, "callerDayLengthMultiplier");
  aligned(
    input.dailyMeanTemperaturesC,
    input.dailyDiurnalRangesC,
    "dailyMeanTemperaturesC",
  );
  const biologicallyEffectiveDailyDegreeDays = input.dailyMeanTemperaturesC.map(
    (t, i) =>
      Math.max(
        0,
        Math.min(
          input.callerMaximumDailyThermalContribution,
          Math.max(0, t - input.callerBaseTemperatureC),
        ) +
          input.callerDiurnalAdjustmentPerDegree *
            (input.dailyDiurnalRangesC[i] - input.callerDiurnalReferenceC),
      ) * input.callerDayLengthMultiplier,
  );
  return {
    biologicallyEffectiveDailyDegreeDays,
    biologicallyEffectiveDegreeDayTotal:
      biologicallyEffectiveDailyDegreeDays.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMeanTemperaturesC: [10, 20],
  dailyDiurnalRangesC: [5, 15],
  callerBaseTemperatureC: 10,
  callerMaximumDailyThermalContribution: 9,
  callerDiurnalAdjustmentPerDegree: 0.1,
  callerDiurnalReferenceC: 10,
  callerDayLengthMultiplier: 1,
} satisfies Input;
export const exampleOutput = {
  biologicallyEffectiveDailyDegreeDays: [0, 9.5],
  biologicallyEffectiveDegreeDayTotal: 9.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/bedd-calculator",
  title: "Biologically Effective Degree Days",
  description:
    "Evaluate caller explicit BEDD thermal-cap, diurnal-range adjustment and daylight convention, exposing all calibration rather than prescribing a universal viticultural formula or maturity date.",
  inputs: inputFields,
  outputs: [
    {
      id: "biologicallyEffectiveDailyDegreeDays",
      label: "Biologically effective daily degree days",
      kind: "numberList",
    },
    {
      id: "biologicallyEffectiveDegreeDayTotal",
      label: "Biologically effective degree day total",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyMeanTemperaturesC: value.dailyMeanTemperaturesC as readonly number[],
      dailyDiurnalRangesC: value.dailyDiurnalRangesC as readonly number[],
      callerBaseTemperatureC: value.callerBaseTemperatureC as number,
      callerMaximumDailyThermalContribution:
        value.callerMaximumDailyThermalContribution as number,
      callerDiurnalAdjustmentPerDegree:
        value.callerDiurnalAdjustmentPerDegree as number,
      callerDiurnalReferenceC: value.callerDiurnalReferenceC as number,
      callerDayLengthMultiplier: value.callerDayLengthMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
