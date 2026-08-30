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
  count,
  dateMs,
  dateShift,
} from "../shared.js";
export type Input = Readonly<{
  readonly firstNightDate: string;
  readonly uninterruptedDarkHoursByNight: readonly number[];
  readonly callerMinimumDarkHours: number;
  readonly callerConsecutiveInductiveNights: number;
}>;
export type Output = Readonly<{
  readonly firstQualifyingNightDate: string;
  readonly modelInductionCompletionDate: string;
}>;
const inputFields = [
  { id: "firstNightDate", label: "First night date", kind: "string" },
  {
    id: "uninterruptedDarkHoursByNight",
    label: "Uninterrupted dark hours by night",
    kind: "numberList",
  },
  {
    id: "callerMinimumDarkHours",
    label: "Caller minimum dark hours",
    kind: "number",
  },
  {
    id: "callerConsecutiveInductiveNights",
    label: "Caller consecutive inductive nights",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerConsecutiveInductiveNights,
    "callerConsecutiveInductiveNights",
  );
  input.uninterruptedDarkHoursByNight.forEach((v) =>
    nonnegative(v, "uninterruptedDarkHoursByNight"),
  );
  nonnegative(input.callerMinimumDarkHours, "callerMinimumDarkHours");
  count(
    input.callerConsecutiveInductiveNights,
    "callerConsecutiveInductiveNights",
  );
  dateMs(input.firstNightDate);
  if (
    input.callerMinimumDarkHours > 24 ||
    input.uninterruptedDarkHoursByNight.some((v) => v > 24)
  )
    simpleError("darkHours", "Night durations within [0,24] required.");
  let run = 0;
  for (let i = 0; i < input.uninterruptedDarkHoursByNight.length; i++) {
    run =
      input.uninterruptedDarkHoursByNight[i] >= input.callerMinimumDarkHours
        ? run + 1
        : 0;
    if (run >= input.callerConsecutiveInductiveNights)
      return {
        firstQualifyingNightDate: dateShift(input.firstNightDate, i - run + 1),
        modelInductionCompletionDate: dateShift(input.firstNightDate, i + 1),
      };
  }
  return simpleError(
    "uninterruptedDarkHoursByNight",
    "No qualifying complete consecutive run observed; induction is right-censored.",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstNightDate: "2026-10-01",
  uninterruptedDarkHoursByNight: [10, 14, 14, 14, 10],
  callerMinimumDarkHours: 12,
  callerConsecutiveInductiveNights: 3,
} satisfies Input;
export const exampleOutput = {
  firstQualifyingNightDate: "2026-10-02",
  modelInductionCompletionDate: "2026-10-05",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/poinsettia-short-day-trigger-date",
  title: "Poinsettia Short Day Trigger Date",
  description:
    "Locate the first caller-defined consecutive uninterrupted-dark run in measured/scheduled poinsettia nights; each date is night start and completion is following morning, not cultivar-specific flowering prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstQualifyingNightDate",
      label: "First qualifying night date",
      kind: "string",
    },
    {
      id: "modelInductionCompletionDate",
      label: "Model induction completion date",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      firstNightDate: value.firstNightDate as string,
      uninterruptedDarkHoursByNight:
        value.uninterruptedDarkHoursByNight as readonly number[],
      callerMinimumDarkHours: value.callerMinimumDarkHours as number,
      callerConsecutiveInductiveNights:
        value.callerConsecutiveInductiveNights as number,
    }),
});
export const run = tool.execute;
export default tool;
