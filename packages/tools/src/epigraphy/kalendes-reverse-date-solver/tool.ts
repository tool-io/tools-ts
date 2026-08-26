import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KalendesReverseDateSolverInput = {
  readonly count: number;
  readonly anchor: "kalendes" | "nones" | "ides";
  readonly month: number;
  readonly monthLengthDays: number;
};

export type KalendesReverseDateSolverOutput = {
  readonly dayOfMonth: number;
  readonly anchorDay: number;
  readonly countsToNextMonthsKalends: boolean;
};

const NONES_DAY = [5, 5, 7, 5, 7, 5, 7, 7, 5, 7, 5, 5];

export const calculateKalendesReverseDateSolver = (
  input: KalendesReverseDateSolverInput,
): KalendesReverseDateSolverOutput => {
  const anchorDay =
    input.anchor === "kalendes"
      ? 1
      : input.anchor === "nones"
        ? NONES_DAY[input.month - 1]
        : NONES_DAY[input.month - 1] + 8;
  const countsToNextMonthsKalends = input.anchor === "kalendes";
  const dayOfMonth = countsToNextMonthsKalends
    ? input.monthLengthDays + 2 - input.count
    : anchorDay + 1 - input.count;
  if (!(dayOfMonth >= 1 && dayOfMonth <= input.monthLengthDays))
    return simpleError(
      "count",
      `a.d. ${input.count} falls outside the given ${input.monthLengthDays}-day month.`,
      "invalid_count",
    );
  return { dayOfMonth, anchorDay, countsToNextMonthsKalends };
};

export const kalendesReverseDateSolverExample = {
  input: { count: 3, anchor: "kalendes", month: 3, monthLengthDays: 28 },
  output: { dayOfMonth: 27, anchorDay: 1, countsToNextMonthsKalends: true },
} satisfies ToolExample<
  KalendesReverseDateSolverInput,
  KalendesReverseDateSolverOutput
>;

export const kalendesReverseDateSolverTool = createSimpleTool({
  id: "epigraphy/kalendes-reverse-date-solver",
  title: "Day Before Kalends Nones Ides Reverse Date Solver",
  description:
    "Converts inclusive ante diem counts against the kalends, nones or ides into the corresponding day of a month of known length.",
  inputs: [
    {
      id: "count",
      kind: "integer",
      label: "Ante diem count",
      description: "Inclusive day count N in 'a.d. N'.",
      minimum: 2,
      maximum: 60,
    },
    {
      id: "anchor",
      kind: "string",
      enum: ["kalendes", "nones", "ides"],
      label: "Anchor",
      description: "Reference day named in the date.",
    },
    {
      id: "month",
      kind: "integer",
      label: "Month",
      description: "Anchor month number one to twelve.",
      minimum: 1,
      maximum: 12,
    },
    {
      id: "monthLengthDays",
      kind: "integer",
      label: "Month length",
      description:
        "Length of the month containing the resolved date; for kalends, this is the preceding month.",
      minimum: 28,
      maximum: 31,
    },
  ],
  outputs: [
    {
      id: "dayOfMonth",
      kind: "integer",
      label: "Day of month",
      description: "Resolved day within the anchor month.",
    },
    {
      id: "anchorDay",
      kind: "integer",
      label: "Anchor day",
      description: "Day of month on which the anchor falls.",
    },
    {
      id: "countsToNextMonthsKalends",
      kind: "boolean",
      label: "Counts to next kalends",
      description: "Whether the count runs to the following month's kalends.",
    },
  ],
  calculate: (input) =>
    calculateKalendesReverseDateSolver(
      input as unknown as KalendesReverseDateSolverInput,
    ),
});

export const runKalendesReverseDateSolver =
  kalendesReverseDateSolverTool.execute;
export default kalendesReverseDateSolverTool;
