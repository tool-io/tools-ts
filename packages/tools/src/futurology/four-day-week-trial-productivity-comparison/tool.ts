import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FourDayWeekFindingsInput = {
  readonly baselineOutputIndex: number;
  readonly baselineWeeklyHours: number;
  readonly trialOutputIndex: number;
  readonly trialWeeklyHours: number;
};

export type FourDayWeekFindingsOutput = {
  readonly hoursPerOutputChangePercent: number;
  readonly outputChangePercent: number;
  readonly trialOutputPerHour: number;
};

export const compareFourDayWeekTrialFindings = (
  input: FourDayWeekFindingsInput,
): FourDayWeekFindingsOutput => {
  for (const [field, value] of [
    ["baselineWeeklyHours", input.baselineWeeklyHours],
    ["trialWeeklyHours", input.trialWeeklyHours],
    ["baselineOutputIndex", input.baselineOutputIndex],
    ["trialOutputIndex", input.trialOutputIndex],
  ] as const)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        "Hours and output indices must be finite and greater than zero.",
        "finding_value_required",
      );
  const baselineOutputPerHour =
    input.baselineOutputIndex / input.baselineWeeklyHours;
  const trialOutputPerHour = input.trialOutputIndex / input.trialWeeklyHours;
  const hoursPerOutputChangePercent =
    ((trialOutputPerHour - baselineOutputPerHour) / baselineOutputPerHour) *
    100;
  if (
    !Number.isFinite(trialOutputPerHour) ||
    !Number.isFinite(hoursPerOutputChangePercent)
  )
    simpleError("", "The trial comparison is not finite.", "result_not_finite");
  return {
    hoursPerOutputChangePercent,
    outputChangePercent:
      ((input.trialOutputIndex - input.baselineOutputIndex) /
        input.baselineOutputIndex) *
      100,
    trialOutputPerHour,
  };
};

export const fourDayWeekFindingsExample = {
  input: {
    baselineOutputIndex: 100,
    baselineWeeklyHours: 40,
    trialOutputIndex: 90,
    trialWeeklyHours: 32,
  },
  output: {
    hoursPerOutputChangePercent: 12.5,
    outputChangePercent: -10,
    trialOutputPerHour: 2.8125,
  },
} satisfies ToolExample<FourDayWeekFindingsInput, FourDayWeekFindingsOutput>;

export const fourDayWeekFindingsTool = createSimpleTool({
  calculate: (input) =>
    compareFourDayWeekTrialFindings({
      baselineOutputIndex: input.baselineOutputIndex as number,
      baselineWeeklyHours: input.baselineWeeklyHours as number,
      trialOutputIndex: input.trialOutputIndex as number,
      trialWeeklyHours: input.trialWeeklyHours as number,
    }),
  description:
    "Compare caller-supplied baseline and four-day-week trial hours and output, reporting the changes in total output and output per hour. It does not infer evidence strength from sample size alone.",
  id: "futurology/four-day-week-trial-productivity-comparison",
  inputs: [
    {
      id: "baselineOutputIndex",
      kind: "number",
      label: "Baseline output index",
      minimum: 0,
    },
    {
      id: "baselineWeeklyHours",
      kind: "number",
      label: "Baseline weekly hours",
      minimum: 0,
    },
    {
      id: "trialOutputIndex",
      kind: "number",
      label: "Trial output index",
      minimum: 0,
    },
    {
      id: "trialWeeklyHours",
      kind: "number",
      label: "Trial weekly hours",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "hoursPerOutputChangePercent",
      kind: "number",
      label: "Output-per-hour change percent",
      unit: "%",
    },
    {
      id: "outputChangePercent",
      kind: "number",
      label: "Output change percent",
      unit: "%",
    },
    {
      id: "trialOutputPerHour",
      kind: "number",
      label: "Trial output per hour",
      minimum: 0,
    },
  ],
  title: "Four-Day Week Trial Productivity Comparison",
});

export const runFourDayWeekFindings = fourDayWeekFindingsTool.execute;
export default fourDayWeekFindingsTool;
