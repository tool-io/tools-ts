import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, dateDay } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerClaimsMadeRetroCivilDate: string;
  readonly callerPolicyStartCivilDate: string;
  readonly callerPolicyEndExclusiveCivilDate: string;
  readonly observedWrongfulActCivilDate: string;
  readonly observedClaimFirstMadeCivilDate: string;
  readonly observedClaimReportedCivilDate: string;
  readonly callerReportLagCalendarDays: number;
}>;
export type Output = Readonly<{
  readonly callerActAfterRetroDate: boolean;
  readonly claimFirstMadeWithinCallerTerm: boolean;
  readonly reportedWithinCallerLag: boolean;
  readonly allCallerTimingConditionsMet: boolean;
}>;
const inputFields = [
  {
    id: "callerClaimsMadeRetroCivilDate",
    label: "Caller claims made retro civil date",
    kind: "string",
  },
  {
    id: "callerPolicyStartCivilDate",
    label: "Caller policy start civil date",
    kind: "string",
  },
  {
    id: "callerPolicyEndExclusiveCivilDate",
    label: "Caller policy end exclusive civil date",
    kind: "string",
  },
  {
    id: "observedWrongfulActCivilDate",
    label: "Observed wrongful act civil date",
    kind: "string",
  },
  {
    id: "observedClaimFirstMadeCivilDate",
    label: "Observed claim first made civil date",
    kind: "string",
  },
  {
    id: "observedClaimReportedCivilDate",
    label: "Observed claim reported civil date",
    kind: "string",
  },
  {
    id: "callerReportLagCalendarDays",
    label: "Caller report lag calendar days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const retro = dateDay(input.callerClaimsMadeRetroCivilDate),
    start = dateDay(input.callerPolicyStartCivilDate),
    end = dateDay(input.callerPolicyEndExclusiveCivilDate),
    act = dateDay(input.observedWrongfulActCivilDate),
    made = dateDay(input.observedClaimFirstMadeCivilDate),
    reported = dateDay(input.observedClaimReportedCivilDate);
  if (end <= start || retro > start || act > made || reported < made)
    simpleError(
      "chronology",
      "Ordered retro/term/act/claim/report chronology required.",
    );
  bounded(input.callerReportLagCalendarDays, "lag", 0, 3660);
  const a = act >= retro,
    m = made >= start && made < end,
    r = reported - made <= input.callerReportLagCalendarDays;
  return {
    callerActAfterRetroDate: a,
    claimFirstMadeWithinCallerTerm: m,
    reportedWithinCallerLag: r,
    allCallerTimingConditionsMet: a && m && r,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerClaimsMadeRetroCivilDate: "2025-01-01",
  callerPolicyStartCivilDate: "2026-01-01",
  callerPolicyEndExclusiveCivilDate: "2027-01-01",
  observedWrongfulActCivilDate: "2025-06-01",
  observedClaimFirstMadeCivilDate: "2026-06-01",
  observedClaimReportedCivilDate: "2026-06-10",
  callerReportLagCalendarDays: 30,
} satisfies Input;
export const exampleOutput = {
  callerActAfterRetroDate: true,
  claimFirstMadeWithinCallerTerm: true,
  reportedWithinCallerLag: true,
  allCallerTimingConditionsMet: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/eo-claims-made-retro-date-checker",
  title: "E&O Claims Made Retro Date Checker",
  description:
    "Audit actual E&O wrongful-act/first-made/report chronology against explicit retro date, half-open term and caller reporting lag; not existing tail-period-only check, causation, continuity or legal coverage determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerActAfterRetroDate",
      label: "Caller act after retro date",
      kind: "boolean",
    },
    {
      id: "claimFirstMadeWithinCallerTerm",
      label: "Claim first made within caller term",
      kind: "boolean",
    },
    {
      id: "reportedWithinCallerLag",
      label: "Reported within caller lag",
      kind: "boolean",
    },
    {
      id: "allCallerTimingConditionsMet",
      label: "All caller timing conditions met",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerClaimsMadeRetroCivilDate:
        value.callerClaimsMadeRetroCivilDate as string,
      callerPolicyStartCivilDate: value.callerPolicyStartCivilDate as string,
      callerPolicyEndExclusiveCivilDate:
        value.callerPolicyEndExclusiveCivilDate as string,
      observedWrongfulActCivilDate:
        value.observedWrongfulActCivilDate as string,
      observedClaimFirstMadeCivilDate:
        value.observedClaimFirstMadeCivilDate as string,
      observedClaimReportedCivilDate:
        value.observedClaimReportedCivilDate as string,
      callerReportLagCalendarDays: value.callerReportLagCalendarDays as number,
    }),
});
export const run = tool.execute;
export default tool;
