import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  dayDate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPremiumDueCivilDate: string;
  readonly callerGraceCalendarDays: number;
  readonly callerReinstatementCalendarDaysAfterGrace: number;
  readonly observedAsOfCivilDate: string;
}>;
export type Output = Readonly<{
  readonly callerGraceEndsCivilDate: string;
  readonly callerReinstatementEndsCivilDate: string;
  readonly callerTimingStage: string;
}>;
const inputFields = [
  {
    id: "observedPremiumDueCivilDate",
    label: "Observed premium due civil date",
    kind: "string",
  },
  {
    id: "callerGraceCalendarDays",
    label: "Caller grace calendar days",
    kind: "number",
  },
  {
    id: "callerReinstatementCalendarDaysAfterGrace",
    label: "Caller reinstatement calendar days after grace",
    kind: "number",
  },
  {
    id: "observedAsOfCivilDate",
    label: "Observed as of civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerGraceCalendarDays, "grace", 0, 366);
  bounded(
    input.callerReinstatementCalendarDaysAfterGrace,
    "reinstatement",
    0,
    3660,
  );
  const due = dateDay(input.observedPremiumDueCivilDate),
    now = dateDay(input.observedAsOfCivilDate),
    grace = due + input.callerGraceCalendarDays,
    reinstatement = grace + input.callerReinstatementCalendarDaysAfterGrace;
  if (now < due)
    simpleError("asOf", "As-of before due date outside lapse chronology.");
  return {
    callerGraceEndsCivilDate: dayDate(grace),
    callerReinstatementEndsCivilDate: dayDate(reinstatement),
    callerTimingStage:
      now <= grace
        ? "grace"
        : now <= reinstatement
          ? "reinstatement-window"
          : "outside-windows",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPremiumDueCivilDate: "2026-01-01",
  callerGraceCalendarDays: 30,
  callerReinstatementCalendarDaysAfterGrace: 60,
  observedAsOfCivilDate: "2026-02-10",
} satisfies Input;
export const exampleOutput = {
  callerGraceEndsCivilDate: "2026-01-31",
  callerReinstatementEndsCivilDate: "2026-04-01",
  callerTimingStage: "reinstatement-window",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/lapse-grace-period-reinstatement-lookup",
  title: "Lapse Grace Period Reinstatement Lookup",
  description:
    "Audit actual lapse chronology with caller grace and separate after-grace reinstatement windows, endpoints inclusive; no coverage continuity, automatic reinstatement or underwriting permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerGraceEndsCivilDate",
      label: "Caller grace ends civil date",
      kind: "string",
    },
    {
      id: "callerReinstatementEndsCivilDate",
      label: "Caller reinstatement ends civil date",
      kind: "string",
    },
    { id: "callerTimingStage", label: "Caller timing stage", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      observedPremiumDueCivilDate: value.observedPremiumDueCivilDate as string,
      callerGraceCalendarDays: value.callerGraceCalendarDays as number,
      callerReinstatementCalendarDaysAfterGrace:
        value.callerReinstatementCalendarDaysAfterGrace as number,
      observedAsOfCivilDate: value.observedAsOfCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
