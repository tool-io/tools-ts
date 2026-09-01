import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  catalogIndex,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerReignRecordIds: readonly string[];
  readonly callerVerifiedReignFirstCeYears: readonly number[];
  readonly callerVerifiedReignLastCeYears: readonly number[];
  readonly queryReignRecordId: string;
  readonly observedReignYearNumber: number;
}>;
export type Output = Readonly<{
  readonly callerConvertedCalendarCeYear: number;
  readonly withinCallerVerifiedReignSpan: boolean;
}>;
const inputFields = [
  {
    id: "callerReignRecordIds",
    label: "Caller reign record ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedReignFirstCeYears",
    label: "Caller verified reign first ce years",
    kind: "numberList",
  },
  {
    id: "callerVerifiedReignLastCeYears",
    label: "Caller verified reign last ce years",
    kind: "numberList",
  },
  { id: "queryReignRecordId", label: "Query reign record id", kind: "string" },
  {
    id: "observedReignYearNumber",
    label: "Observed reign year number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerReignRecordIds,
    input.callerVerifiedReignFirstCeYears,
    "records",
  );
  aligned(
    input.callerReignRecordIds,
    input.callerVerifiedReignLastCeYears,
    "records",
  );
  input.callerVerifiedReignFirstCeYears.forEach((v) =>
    bounded(v, "firstYear", 1, 2199),
  );
  input.callerVerifiedReignLastCeYears.forEach((v, i) =>
    bounded(v, "lastYear", input.callerVerifiedReignFirstCeYears[i], 2199),
  );
  bounded(input.observedReignYearNumber, "reignYear", 1, 1000);
  const i = catalogIndex(input.callerReignRecordIds, input.queryReignRecordId),
    year =
      input.callerVerifiedReignFirstCeYears[i] +
      input.observedReignYearNumber -
      1;
  bounded(year, "calendarCeYear", 1, 2199);
  return {
    callerConvertedCalendarCeYear: year,
    withinCallerVerifiedReignSpan:
      year <= input.callerVerifiedReignLastCeYears[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReignRecordIds: ["a", "b"],
  callerVerifiedReignFirstCeYears: [1700, 1750],
  callerVerifiedReignLastCeYears: [1710, 1760],
  queryReignRecordId: "a",
  observedReignYearNumber: 3,
} satisfies Input;
export const exampleOutput = {
  callerConvertedCalendarCeYear: 1702,
  withinCallerVerifiedReignSpan: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/reign-title-era-name-to-calendar-years-converter",
  title: "Reign Title Era Name to Calendar Years Converter",
  description:
    "Convert actual caller verified CE reign record and one-based reign-year ordinal, retaining outside-span flag; caller already resolves accession/new-year conventions, no invented era dates, BCE/year-zero/lunisolar conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerConvertedCalendarCeYear",
      label: "Caller converted calendar ce year",
      kind: "number",
    },
    {
      id: "withinCallerVerifiedReignSpan",
      label: "Within caller verified reign span",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReignRecordIds: value.callerReignRecordIds as readonly string[],
      callerVerifiedReignFirstCeYears:
        value.callerVerifiedReignFirstCeYears as readonly number[],
      callerVerifiedReignLastCeYears:
        value.callerVerifiedReignLastCeYears as readonly number[],
      queryReignRecordId: value.queryReignRecordId as string,
      observedReignYearNumber: value.observedReignYearNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
