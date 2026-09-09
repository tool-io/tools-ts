import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  nonnegative,
  unique,
  finite,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSequentialEventIds: readonly string[];
  readonly callerEstablishedEventDurationsMinutes: readonly number[];
  readonly callerEstablishedStartMinuteOnOneTimeline: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSequentialEventIds",
    label: "Actual sequential event ids",
    kind: "stringList",
  },
  {
    id: "callerEstablishedEventDurationsMinutes",
    label: "Caller established event durations minutes",
    kind: "numberList",
  },
  {
    id: "callerEstablishedStartMinuteOnOneTimeline",
    label: "Caller established start minute on one timeline",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.actualSequentialEventIds, "events");
  aligned(
    input.actualSequentialEventIds,
    input.callerEstablishedEventDurationsMinutes,
    "durations",
  );
  input.callerEstablishedEventDurationsMinutes.forEach((v) =>
    nonnegative(v, "minutes"),
  );
  nonnegative(input.callerEstablishedStartMinuteOnOneTimeline, "start");
  let t = input.callerEstablishedStartMinuteOnOneTimeline;
  const starts: number[] = [],
    ends: number[] = [];
  input.callerEstablishedEventDurationsMinutes.forEach((v) => {
    starts.push(t);
    t = finite(t + v);
    ends.push(t);
  });
  return {
    eventIds: [...input.actualSequentialEventIds],
    conditionalEventStartMinutes: starts,
    conditionalEventEndMinutes: ends,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSequentialEventIds: ["ceremony", "photos"],
    callerEstablishedEventDurationsMinutes: [30, 20],
    callerEstablishedStartMinuteOnOneTimeline: 100,
  },
  output: {
    result: {
      eventIds: ["ceremony", "photos"],
      conditionalEventStartMinutes: [100, 130],
      conditionalEventEndMinutes: [130, 150],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-timeline-generator",
  title: "Wedding Timeline Generator",
  description:
    "Deterministic sequential caller-defined wedding event timeline, one declared minute axis, not local-time/date planning, parallel events, weather forecast or professional schedule adequacy.",
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
