import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  roundMinor,
  dateDay,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerPolicyStartCivilDate: string;
  readonly callerPolicyEndExclusiveCivilDate: string;
  readonly observedEndorsementEffectiveCivilDate: string;
  readonly callerFullTermOldPremiumMinor: number;
  readonly callerFullTermNewPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly remainingTermCalendarDays: number;
  readonly totalTermCalendarDays: number;
  readonly signedProratedEndorsementPremiumMinor: number;
}>;
const inputFields = [
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
    id: "observedEndorsementEffectiveCivilDate",
    label: "Observed endorsement effective civil date",
    kind: "string",
  },
  {
    id: "callerFullTermOldPremiumMinor",
    label: "Caller full term old premium minor",
    kind: "number",
  },
  {
    id: "callerFullTermNewPremiumMinor",
    label: "Caller full term new premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerFullTermOldPremiumMinor);
  money(input.callerFullTermNewPremiumMinor);
  const start = dateDay(input.callerPolicyStartCivilDate),
    end = dateDay(input.callerPolicyEndExclusiveCivilDate),
    effective = dateDay(input.observedEndorsementEffectiveCivilDate);
  if (end <= start || effective < start || effective >= end)
    simpleError(
      "term",
      "Positive half-open term and endorsement effective within that term required.",
    );
  return {
    remainingTermCalendarDays: end - effective,
    totalTermCalendarDays: end - start,
    signedProratedEndorsementPremiumMinor: roundMinor(
      BigInt(
        input.callerFullTermNewPremiumMinor -
          input.callerFullTermOldPremiumMinor,
      ) * BigInt(end - effective),
      BigInt(end - start),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPolicyStartCivilDate: "2026-01-01",
  callerPolicyEndExclusiveCivilDate: "2027-01-01",
  observedEndorsementEffectiveCivilDate: "2026-07-01",
  callerFullTermOldPremiumMinor: 36500,
  callerFullTermNewPremiumMinor: 73000,
} satisfies Input;
export const exampleOutput = {
  remainingTermCalendarDays: 184,
  totalTermCalendarDays: 365,
  signedProratedEndorsementPremiumMinor: 18400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/mid-term-endorsement-proration-return-premium",
  title: "Mid Term Endorsement Proration Return Premium Calculator",
  description:
    "Prorate actual full-term premium change over remaining civil days of half-open term, exact signed rational rounding; no 360-day convention, cancellation fee or insurer/legal return entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "remainingTermCalendarDays",
      label: "Remaining term calendar days",
      kind: "number",
    },
    {
      id: "totalTermCalendarDays",
      label: "Total term calendar days",
      kind: "number",
    },
    {
      id: "signedProratedEndorsementPremiumMinor",
      label: "Signed prorated endorsement premium minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPolicyStartCivilDate: value.callerPolicyStartCivilDate as string,
      callerPolicyEndExclusiveCivilDate:
        value.callerPolicyEndExclusiveCivilDate as string,
      observedEndorsementEffectiveCivilDate:
        value.observedEndorsementEffectiveCivilDate as string,
      callerFullTermOldPremiumMinor:
        value.callerFullTermOldPremiumMinor as number,
      callerFullTermNewPremiumMinor:
        value.callerFullTermNewPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
