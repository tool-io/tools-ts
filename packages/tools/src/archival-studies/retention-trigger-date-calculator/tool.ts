import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  aligned,
  maximum,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly eventDayOrdinals: readonly number[];
  readonly callerQualifyingTriggerFlags: readonly number[];
  readonly callerRetentionDaysAfterLatestTrigger: number;
}>;
export type Output = Readonly<{
  readonly latestQualifyingTriggerOrdinal: number;
  readonly modeledRetentionExpiryOrdinal: number;
  readonly qualifyingTriggerIndices: readonly number[];
}>;
const inputFields = [
  { id: "eventDayOrdinals", label: "Event day ordinals", kind: "numberList" },
  {
    id: "callerQualifyingTriggerFlags",
    label: "Caller qualifying trigger flags",
    kind: "numberList",
  },
  {
    id: "callerRetentionDaysAfterLatestTrigger",
    label: "Caller retention days after latest trigger",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.eventDayOrdinals.forEach((v) => count(v, "eventDayOrdinals"));
  count(
    input.callerRetentionDaysAfterLatestTrigger,
    "callerRetentionDaysAfterLatestTrigger",
  );
  aligned(input.eventDayOrdinals, input.callerQualifyingTriggerFlags, "events");
  binary(input.callerQualifyingTriggerFlags, "qualifying");
  const q = input.eventDayOrdinals.flatMap((v, i) =>
    input.callerQualifyingTriggerFlags[i] ? [i] : [],
  );
  if (!q.length)
    simpleError("trigger", "Observed qualifying trigger required.");
  const last = maximum(q.map((i) => input.eventDayOrdinals[i]));
  return {
    latestQualifyingTriggerOrdinal: last,
    modeledRetentionExpiryOrdinal: count(
      last + input.callerRetentionDaysAfterLatestTrigger,
      "expiry",
    ),
    qualifyingTriggerIndices: q,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eventDayOrdinals: [10, 20, 15],
  callerQualifyingTriggerFlags: [1, 0, 1],
  callerRetentionDaysAfterLatestTrigger: 5,
} satisfies Input;
export const exampleOutput = {
  latestQualifyingTriggerOrdinal: 15,
  modeledRetentionExpiryOrdinal: 20,
  qualifyingTriggerIndices: [0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/retention-trigger-date-calculator",
  title: "Retention Schedule Trigger Date Calculator",
  description:
    "Resolve latest caller qualifying retention trigger from observed event inventory plus explicitly declared day period; no legal schedule selection, calendar-year substitution or disposal authorization.",
  inputs: inputFields,
  outputs: [
    {
      id: "latestQualifyingTriggerOrdinal",
      label: "Latest qualifying trigger ordinal",
      kind: "number",
    },
    {
      id: "modeledRetentionExpiryOrdinal",
      label: "Modeled retention expiry ordinal",
      kind: "number",
    },
    {
      id: "qualifyingTriggerIndices",
      label: "Qualifying trigger indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      eventDayOrdinals: value.eventDayOrdinals as readonly number[],
      callerQualifyingTriggerFlags:
        value.callerQualifyingTriggerFlags as readonly number[],
      callerRetentionDaysAfterLatestTrigger:
        value.callerRetentionDaysAfterLatestTrigger as number,
    }),
});
export const run = tool.execute;
export default tool;
