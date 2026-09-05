import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerLocaleIds: readonly string[];
  readonly callerVerifiedFirstWeekdaysMondayOne: readonly number[];
  readonly queryLocaleId: string;
}>;
export type Output = Readonly<{ readonly callerFirstWeekdayMondayOne: number }>;
const inputFields = [
  { id: "callerLocaleIds", label: "Caller locale ids", kind: "stringList" },
  {
    id: "callerVerifiedFirstWeekdaysMondayOne",
    label: "Caller verified first weekdays monday one",
    kind: "numberList",
  },
  { id: "queryLocaleId", label: "Query locale id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerLocaleIds,
    input.callerVerifiedFirstWeekdaysMondayOne,
    "locale week data",
  );
  input.callerVerifiedFirstWeekdaysMondayOne.forEach((v) =>
    bounded(v, "weekday", 1, 7),
  );
  return {
    callerFirstWeekdayMondayOne:
      input.callerVerifiedFirstWeekdaysMondayOne[
        catalogIndex(input.callerLocaleIds, input.queryLocaleId)
      ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLocaleIds: ["locale-a", "locale-b"],
  callerVerifiedFirstWeekdaysMondayOne: [1, 7],
  queryLocaleId: "locale-b",
} satisfies Input;
export const exampleOutput = {
  callerFirstWeekdayMondayOne: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/first-day-of-week-locale-lookup",
  title: "First Day of Week Locale Lookup",
  description:
    "Exact independently verified locale/CLDR edition first-day-of-week lookup, Monday 1..Sunday7; not date order, week numbering or inferred current host locale. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFirstWeekdayMondayOne",
      label: "Caller first weekday monday one",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLocaleIds: value.callerLocaleIds as readonly string[],
      callerVerifiedFirstWeekdaysMondayOne:
        value.callerVerifiedFirstWeekdaysMondayOne as readonly number[],
      queryLocaleId: value.queryLocaleId as string,
    }),
});
export const run = tool.execute;
export default tool;
