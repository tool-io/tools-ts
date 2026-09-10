import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualObservedClockMinutesOnSameTimeline: number;
  readonly callerIndependentlyEstablishedCalloutMinuteOnSameTimeline: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedClockMinutesOnSameTimeline",
    label: "Actual observed clock minutes on same timeline",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedCalloutMinuteOnSameTimeline",
    label: "Caller independently established callout minute on same timeline",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualObservedClockMinutesOnSameTimeline, "clock");
  nonnegative(
    input.callerIndependentlyEstablishedCalloutMinuteOnSameTimeline,
    "callout",
  );
  return {
    signedOverdueMinutes:
      input.actualObservedClockMinutesOnSameTimeline -
      input.callerIndependentlyEstablishedCalloutMinuteOnSameTimeline,
    callerCalloutTimeReached:
      input.actualObservedClockMinutesOnSameTimeline >=
      input.callerIndependentlyEstablishedCalloutMinuteOnSameTimeline,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedClockMinutesOnSameTimeline: 120,
    callerIndependentlyEstablishedCalloutMinuteOnSameTimeline: 100,
  },
  output: {
    result: { signedOverdueMinutes: 20, callerCalloutTimeReached: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/callout-overdue-trigger",
  title: "Callout Time Overdue Trigger Calculator",
  description:
    "Actual same-timeline current minus independently agreed callout minute, no automatic alarm dispatch or emergency protocol. Day rollover/timezone/reference and responsible-party action external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
