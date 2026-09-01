import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBinderStartCivilDate: string;
  readonly callerBinderEndExclusiveCivilDate: string;
  readonly observedPolicyEffectiveStartCivilDate: string;
}>;
export type Output = Readonly<{
  readonly observedBinderPolicyGapCalendarDays: number;
  readonly observedBinderPolicyOverlapCalendarDays: number;
}>;
const inputFields = [
  {
    id: "observedBinderStartCivilDate",
    label: "Observed binder start civil date",
    kind: "string",
  },
  {
    id: "callerBinderEndExclusiveCivilDate",
    label: "Caller binder end exclusive civil date",
    kind: "string",
  },
  {
    id: "observedPolicyEffectiveStartCivilDate",
    label: "Observed policy effective start civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const start = dateDay(input.observedBinderStartCivilDate),
    end = dateDay(input.callerBinderEndExclusiveCivilDate),
    policy = dateDay(input.observedPolicyEffectiveStartCivilDate);
  if (end <= start || policy < start)
    simpleError(
      "chronology",
      "Positive binder term and policy start not before binder required.",
    );
  return {
    observedBinderPolicyGapCalendarDays: Math.max(0, policy - end),
    observedBinderPolicyOverlapCalendarDays: Math.max(0, end - policy),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBinderStartCivilDate: "2026-01-01",
  callerBinderEndExclusiveCivilDate: "2026-01-31",
  observedPolicyEffectiveStartCivilDate: "2026-02-05",
} satisfies Input;
export const exampleOutput = {
  observedBinderPolicyGapCalendarDays: 5,
  observedBinderPolicyOverlapCalendarDays: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/binder-to-policy-issue-gap-checker",
  title: "Binder To Policy Issue Gap Checker",
  description:
    "Reconcile actual binder end-exclusive and policy effective start, separate overlap/gap without treating document issue date as coverage start; no coverage continuity/legal conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBinderPolicyGapCalendarDays",
      label: "Observed binder policy gap calendar days",
      kind: "number",
    },
    {
      id: "observedBinderPolicyOverlapCalendarDays",
      label: "Observed binder policy overlap calendar days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBinderStartCivilDate:
        value.observedBinderStartCivilDate as string,
      callerBinderEndExclusiveCivilDate:
        value.callerBinderEndExclusiveCivilDate as string,
      observedPolicyEffectiveStartCivilDate:
        value.observedPolicyEffectiveStartCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
