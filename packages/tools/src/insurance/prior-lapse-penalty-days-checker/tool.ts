import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, dateDay } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPriorCoverageEndExclusiveCivilDate: string;
  readonly observedNextCoverageStartCivilDate: string;
  readonly callerMaximumUnpenalizedLapseCalendarDays: number;
  readonly callerLapseCountEvidenceVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedNoncoveredGapCalendarDays: number;
  readonly callerLapsePenaltyReviewTriggered: boolean;
}>;
const inputFields = [
  {
    id: "observedPriorCoverageEndExclusiveCivilDate",
    label: "Observed prior coverage end exclusive civil date",
    kind: "string",
  },
  {
    id: "observedNextCoverageStartCivilDate",
    label: "Observed next coverage start civil date",
    kind: "string",
  },
  {
    id: "callerMaximumUnpenalizedLapseCalendarDays",
    label: "Caller maximum unpenalized lapse calendar days",
    kind: "number",
  },
  {
    id: "callerLapseCountEvidenceVerified",
    label: "Caller lapse count evidence verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMaximumUnpenalizedLapseCalendarDays, "days", 0, 3660);
  const end = dateDay(input.observedPriorCoverageEndExclusiveCivilDate),
    start = dateDay(input.observedNextCoverageStartCivilDate),
    gap = Math.max(0, start - end);
  return {
    observedNoncoveredGapCalendarDays: gap,
    callerLapsePenaltyReviewTriggered:
      input.callerLapseCountEvidenceVerified &&
      gap > input.callerMaximumUnpenalizedLapseCalendarDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPriorCoverageEndExclusiveCivilDate: "2026-01-01",
  observedNextCoverageStartCivilDate: "2026-01-11",
  callerMaximumUnpenalizedLapseCalendarDays: 5,
  callerLapseCountEvidenceVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedNoncoveredGapCalendarDays: 10,
  callerLapsePenaltyReviewTriggered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/prior-lapse-penalty-days-checker",
  title: "Prior Lapse Penalty Days Checker",
  description:
    "Audit actual prior half-open coverage gap against caller lapse penalty trigger and verified counting evidence; overlap yields no gap, not legal premium penalty or effective coverage determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNoncoveredGapCalendarDays",
      label: "Observed noncovered gap calendar days",
      kind: "number",
    },
    {
      id: "callerLapsePenaltyReviewTriggered",
      label: "Caller lapse penalty review triggered",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPriorCoverageEndExclusiveCivilDate:
        value.observedPriorCoverageEndExclusiveCivilDate as string,
      observedNextCoverageStartCivilDate:
        value.observedNextCoverageStartCivilDate as string,
      callerMaximumUnpenalizedLapseCalendarDays:
        value.callerMaximumUnpenalizedLapseCalendarDays as number,
      callerLapseCountEvidenceVerified:
        value.callerLapseCountEvidenceVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
