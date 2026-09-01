import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly houseEventIds: readonly string[];
  readonly actualEventMinutesRelativeCurtain: readonly number[];
  readonly callerLatestEventMinutesRelativeCurtain: readonly number[];
}>;
export type Output = Readonly<{
  readonly eventMinutesLateAgainstCallerPlan: readonly number[];
  readonly eventsAfterCallerLatestTime: readonly string[];
}>;
const inputFields = [
  { id: "houseEventIds", label: "House event ids", kind: "stringList" },
  {
    id: "actualEventMinutesRelativeCurtain",
    label: "Actual event minutes relative curtain",
    kind: "numberList",
  },
  {
    id: "callerLatestEventMinutesRelativeCurtain",
    label: "Caller latest event minutes relative curtain",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.houseEventIds,
    input.actualEventMinutesRelativeCurtain,
    "houseEventIds",
  );
  aligned(
    input.houseEventIds,
    input.callerLatestEventMinutesRelativeCurtain,
    "houseEventIds",
  );
  unique(input.houseEventIds, "events");
  if (
    input.actualEventMinutesRelativeCurtain.some(
      (v, i) => i > 0 && v < input.actualEventMinutesRelativeCurtain[i - 1],
    )
  )
    simpleError(
      "sequence",
      "Observed house events must be chronological in caller event order.",
    );
  const late = input.actualEventMinutesRelativeCurtain.map(
    (v, i) => v - input.callerLatestEventMinutesRelativeCurtain[i],
  );
  return {
    eventMinutesLateAgainstCallerPlan: late,
    eventsAfterCallerLatestTime: input.houseEventIds.filter(
      (_, i) => late[i] > 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  houseEventIds: ["doors", "places", "curtain"],
  actualEventMinutesRelativeCurtain: [-30, -5, 1],
  callerLatestEventMinutesRelativeCurtain: [-30, -5, 0],
} satisfies Input;
export const exampleOutput = {
  eventMinutesLateAgainstCallerPlan: [0, 0, 1],
  eventsAfterCallerLatestTime: ["curtain"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/house-open-to-curtain-minute-sequence-lookup",
  title: "House Open To Curtain Minute Sequence Lookup",
  description:
    "Audit actual house-open/places/curtain timeline against caller latest offsets; signed earliness retained, no invented fixed thirty-minute house-open sequence or audience admission approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "eventMinutesLateAgainstCallerPlan",
      label: "Event minutes late against caller plan",
      kind: "numberList",
    },
    {
      id: "eventsAfterCallerLatestTime",
      label: "Events after caller latest time",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      houseEventIds: value.houseEventIds as readonly string[],
      actualEventMinutesRelativeCurtain:
        value.actualEventMinutesRelativeCurtain as readonly number[],
      callerLatestEventMinutesRelativeCurtain:
        value.callerLatestEventMinutesRelativeCurtain as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
