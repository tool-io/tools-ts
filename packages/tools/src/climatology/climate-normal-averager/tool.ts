import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  aligned,
  ordered,
  mean,
  shape,
} from "../shared.js";

export type Input = Readonly<{
  readonly calendarYears: readonly number[];
  readonly monthlyValuesByYear: readonly (readonly number[])[];
  readonly monthlyObservedFlagsByYear: readonly (readonly number[])[];
  readonly baselineStartYear: number;
  readonly baselineEndYear: number;
  readonly callerMinimumObservedYearsPerMonth: number;
}>;
export type Output = Readonly<{
  readonly monthlyClimateNormals: readonly number[];
  readonly monthlyObservedYearCounts: readonly number[];
  readonly baselineCalendarSpanYears: number;
}>;
const inputFields = [
  { id: "calendarYears", label: "Calendar years", kind: "numberList" },
  {
    id: "monthlyValuesByYear",
    label: "Monthly values by year",
    kind: "matrix",
  },
  {
    id: "monthlyObservedFlagsByYear",
    label: "Monthly observed flags by year",
    kind: "matrix",
  },
  { id: "baselineStartYear", label: "Baseline start year", kind: "integer" },
  { id: "baselineEndYear", label: "Baseline end year", kind: "integer" },
  {
    id: "callerMinimumObservedYearsPerMonth",
    label: "Caller minimum observed years per month",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.calendarYears.forEach((v) => count(v, "calendarYears"));
  count(input.baselineStartYear, "baselineStartYear");
  count(input.baselineEndYear, "baselineEndYear");
  count(
    input.callerMinimumObservedYearsPerMonth,
    "callerMinimumObservedYearsPerMonth",
  );
  ordered(input.calendarYears, "calendarYears");
  if (
    input.baselineEndYear - input.baselineStartYear !== 29 ||
    input.callerMinimumObservedYearsPerMonth < 1
  )
    simpleError(
      "baseline",
      "Thirty-year inclusive baseline and positive minimum coverage required.",
    );
  if (
    shape(input.monthlyValuesByYear, "values") !== 12 ||
    shape(input.monthlyObservedFlagsByYear, "flags") !== 12
  )
    simpleError("months", "Twelve columns per year required.");
  aligned(input.calendarYears, input.monthlyValuesByYear, "years");
  aligned(input.calendarYears, input.monthlyObservedFlagsByYear, "years");
  if (
    input.monthlyObservedFlagsByYear.some((r) =>
      r.some((v) => v !== 0 && v !== 1),
    )
  )
    simpleError("flags", "Binary observation flags required.");
  const monthlyObservedYearCounts: number[] = [],
    monthlyClimateNormals: number[] = [];
  for (let m = 0; m < 12; m++) {
    const x = input.calendarYears.flatMap((y, i) =>
      y >= input.baselineStartYear &&
      y <= input.baselineEndYear &&
      input.monthlyObservedFlagsByYear[i][m] === 1
        ? [input.monthlyValuesByYear[i][m]]
        : [],
    );
    if (x.length < input.callerMinimumObservedYearsPerMonth)
      simpleError(
        "coverage",
        "A month lacks caller required observed-year coverage.",
      );
    monthlyObservedYearCounts.push(x.length);
    monthlyClimateNormals.push(mean(x));
  }
  return {
    monthlyClimateNormals,
    monthlyObservedYearCounts,
    baselineCalendarSpanYears: 30,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calendarYears: [1991, 1992],
  monthlyValuesByYear: [
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  ],
  monthlyObservedFlagsByYear: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  baselineStartYear: 1991,
  baselineEndYear: 2020,
  callerMinimumObservedYearsPerMonth: 2,
} satisfies Input;
export const exampleOutput = {
  monthlyClimateNormals: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
  monthlyObservedYearCounts: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  baselineCalendarSpanYears: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/climate-normal-averager",
  title: "Climate Normal 30-Year Averager",
  description:
    "Audit twelve month-of-year normals within an explicit 30-year baseline with independent observation flags/coverage, not missing-as-zero or a falsely complete climatological normal.",
  inputs: inputFields,
  outputs: [
    {
      id: "monthlyClimateNormals",
      label: "Monthly climate normals",
      kind: "numberList",
    },
    {
      id: "monthlyObservedYearCounts",
      label: "Monthly observed year counts",
      kind: "numberList",
    },
    {
      id: "baselineCalendarSpanYears",
      label: "Baseline calendar span years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      calendarYears: value.calendarYears as readonly number[],
      monthlyValuesByYear:
        value.monthlyValuesByYear as readonly (readonly number[])[],
      monthlyObservedFlagsByYear:
        value.monthlyObservedFlagsByYear as readonly (readonly number[])[],
      baselineStartYear: value.baselineStartYear as number,
      baselineEndYear: value.baselineEndYear as number,
      callerMinimumObservedYearsPerMonth:
        value.callerMinimumObservedYearsPerMonth as number,
    }),
});
export const run = tool.execute;
export default tool;
