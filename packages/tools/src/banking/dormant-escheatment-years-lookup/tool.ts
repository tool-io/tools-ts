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
  addMonths,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly lastQualifyingActivityDate: string;
  readonly asOfDate: string;
  readonly callerDormancyYears: number;
  readonly callerExemptionEvidencePresent: boolean;
}>;
export type Output = Readonly<{
  readonly callerDormancyAnniversaryDate: string;
  readonly observedInactiveCivilDays: number;
  readonly callerDormancyThresholdReached: boolean;
  readonly escheatmentReviewCandidate: boolean;
}>;
const inputFields = [
  {
    id: "lastQualifyingActivityDate",
    label: "Last qualifying activity date",
    kind: "string",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
  { id: "callerDormancyYears", label: "Caller dormancy years", kind: "number" },
  {
    id: "callerExemptionEvidencePresent",
    label: "Caller exemption evidence present",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerDormancyYears, "years", 1, 50);
  const activity = dateDay(input.lastQualifyingActivityDate),
    today = dateDay(input.asOfDate);
  if (today < activity)
    simpleError("activity", "As-of cannot precede last activity.");
  const anniversary = addMonths(
      input.lastQualifyingActivityDate,
      12 * input.callerDormancyYears,
    ),
    reached = today >= dateDay(anniversary);
  return {
    callerDormancyAnniversaryDate: anniversary,
    observedInactiveCivilDays: today - activity,
    callerDormancyThresholdReached: reached,
    escheatmentReviewCandidate:
      reached && !input.callerExemptionEvidencePresent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lastQualifyingActivityDate: "2020-01-31",
  asOfDate: "2025-01-31",
  callerDormancyYears: 5,
  callerExemptionEvidencePresent: false,
} satisfies Input;
export const exampleOutput = {
  callerDormancyAnniversaryDate: "2025-01-31",
  observedInactiveCivilDays: 1827,
  callerDormancyThresholdReached: true,
  escheatmentReviewCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/dormant-escheatment-years-lookup",
  title: "Dormant Escheatment Years Lookup",
  description:
    "Screen observed qualifying inactivity against caller jurisdiction/account-type years and exemption evidence; actual escheatment, notices, filing deadlines and legal ownership are not determined.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerDormancyAnniversaryDate",
      label: "Caller dormancy anniversary date",
      kind: "string",
    },
    {
      id: "observedInactiveCivilDays",
      label: "Observed inactive civil days",
      kind: "number",
    },
    {
      id: "callerDormancyThresholdReached",
      label: "Caller dormancy threshold reached",
      kind: "boolean",
    },
    {
      id: "escheatmentReviewCandidate",
      label: "Escheatment review candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      lastQualifyingActivityDate: value.lastQualifyingActivityDate as string,
      asOfDate: value.asOfDate as string,
      callerDormancyYears: value.callerDormancyYears as number,
      callerExemptionEvidencePresent:
        value.callerExemptionEvidencePresent as boolean,
    }),
});
export const run = tool.execute;
export default tool;
