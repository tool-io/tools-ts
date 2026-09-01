import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedLapsedCoverageEndExclusiveCivilDate: string;
  readonly observedReinstatementEffectiveCivilDate: string;
  readonly callerVerifiedReinstatementIsRetroactive: boolean;
  readonly callerRetroactiveEffectiveCivilDate: string;
}>;
export type Output = Readonly<{
  readonly observedCoverageGapBeforeReinstatementDays: number;
  readonly callerModeledRemainingGapDays: number;
  readonly retroactiveEffectiveDateUsed: boolean;
}>;
const inputFields = [
  {
    id: "observedLapsedCoverageEndExclusiveCivilDate",
    label: "Observed lapsed coverage end exclusive civil date",
    kind: "string",
  },
  {
    id: "observedReinstatementEffectiveCivilDate",
    label: "Observed reinstatement effective civil date",
    kind: "string",
  },
  {
    id: "callerVerifiedReinstatementIsRetroactive",
    label: "Caller verified reinstatement is retroactive",
    kind: "boolean",
  },
  {
    id: "callerRetroactiveEffectiveCivilDate",
    label: "Caller retroactive effective civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const end = dateDay(input.observedLapsedCoverageEndExclusiveCivilDate),
    effective = dateDay(input.observedReinstatementEffectiveCivilDate),
    retro = dateDay(input.callerRetroactiveEffectiveCivilDate);
  if (effective < end || retro > effective)
    simpleError(
      "chronology",
      "Reinstatement not before lapse end and retro date not after reinstatement required.",
    );
  return {
    observedCoverageGapBeforeReinstatementDays: effective - end,
    callerModeledRemainingGapDays:
      input.callerVerifiedReinstatementIsRetroactive
        ? Math.max(0, retro - end)
        : effective - end,
    retroactiveEffectiveDateUsed:
      input.callerVerifiedReinstatementIsRetroactive,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLapsedCoverageEndExclusiveCivilDate: "2026-01-01",
  observedReinstatementEffectiveCivilDate: "2026-01-11",
  callerVerifiedReinstatementIsRetroactive: false,
  callerRetroactiveEffectiveCivilDate: "2026-01-01",
} satisfies Input;
export const exampleOutput = {
  observedCoverageGapBeforeReinstatementDays: 10,
  callerModeledRemainingGapDays: 10,
  retroactiveEffectiveDateUsed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/reinstatement-lapse-gap-checker",
  title: "Reinstatement Lapse Gap Checker",
  description:
    "Audit actual lapse/reinstatement effective chronology with independently verified retroactivity and explicit retro date; not grace period, automatic gap erasure or legal claim coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCoverageGapBeforeReinstatementDays",
      label: "Observed coverage gap before reinstatement days",
      kind: "number",
    },
    {
      id: "callerModeledRemainingGapDays",
      label: "Caller modeled remaining gap days",
      kind: "number",
    },
    {
      id: "retroactiveEffectiveDateUsed",
      label: "Retroactive effective date used",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLapsedCoverageEndExclusiveCivilDate:
        value.observedLapsedCoverageEndExclusiveCivilDate as string,
      observedReinstatementEffectiveCivilDate:
        value.observedReinstatementEffectiveCivilDate as string,
      callerVerifiedReinstatementIsRetroactive:
        value.callerVerifiedReinstatementIsRetroactive as boolean,
      callerRetroactiveEffectiveCivilDate:
        value.callerRetroactiveEffectiveCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
