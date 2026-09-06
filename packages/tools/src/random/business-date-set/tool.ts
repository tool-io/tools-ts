import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  bounded,
  unique,
  dayOffset,
} from "../batch42-shared.js";
import weekday from "../../date/iso-weekday/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateDates: readonly string[];
  readonly callerBusinessWeekdayNumbers: readonly number[];
  readonly callerHolidayDates: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  { id: "candidateDates", label: "Candidate dates", kind: "stringList" },
  {
    id: "callerBusinessWeekdayNumbers",
    label: "Caller business weekday numbers",
    kind: "numberList",
  },
  {
    id: "callerHolidayDates",
    label: "Caller holiday dates",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.candidateDates, "candidate dates");
  input.candidateDates.forEach((v) => dayOffset(v, 0));
  unique(input.callerBusinessWeekdayNumbers.map(String), "business weekdays");
  input.callerBusinessWeekdayNumbers.forEach((v) =>
    bounded(v, "ISO weekday", 1, 7),
  );
  input.callerHolidayDates.forEach((v) => dayOffset(v, 0));
  const eligible = input.candidateDates.filter((v) => {
    const w = weekday.execute({ date: v });
    if (!w.ok) simpleError("date", "Imported weekday failed.");
    return (
      input.callerBusinessWeekdayNumbers.includes(w.output.weekday) &&
      !input.callerHolidayDates.includes(v)
    );
  });
  const chosen = indices(eligible.length, input, random);
  return {
    result: {
      dates: chosen.map((i) => eligible[i]),
      eligibleCandidateDates: eligible,
      excludedCandidateDates: input.candidateDates.filter(
        (v) => !eligible.includes(v),
      ),
      eligibleEntryIndices: chosen,
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateDates: ["2026-01-02", "2026-01-05"],
    callerBusinessWeekdayNumbers: [1, 2, 3, 4, 5],
    callerHolidayDates: ["2026-01-01"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/business-date-set",
  title: "Random Business Date Set Generator",
  description:
    "Uniformly sample actual supplied eligible businessdates, not dates inferred from the machine clock. Caller business weekdays/holiday calendar or exact ISO weekday is explicit; leap-day candidates must be real civil February29dates. Infeasible empty inventories or excessive unique requests fail. No jurisdiction-specific trading or business-day inference.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
