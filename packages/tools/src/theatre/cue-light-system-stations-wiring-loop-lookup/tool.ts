import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly stationIds: readonly string[];
  readonly expectedStationChannelNumbers: readonly number[];
  readonly observedStationChannelNumbers: readonly number[];
  readonly channelObservationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly stationIdsWithChannelMismatch: readonly string[];
  readonly stationIdsMissingChannelEvidence: readonly string[];
}>;
const inputFields = [
  { id: "stationIds", label: "Station ids", kind: "stringList" },
  {
    id: "expectedStationChannelNumbers",
    label: "Expected station channel numbers",
    kind: "numberList",
  },
  {
    id: "observedStationChannelNumbers",
    label: "Observed station channel numbers",
    kind: "numberList",
  },
  {
    id: "channelObservationFlags",
    label: "Channel observation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.channelObservationFlags, "channelObservationFlags");
  aligned(input.stationIds, input.expectedStationChannelNumbers, "stationIds");
  aligned(input.stationIds, input.observedStationChannelNumbers, "stationIds");
  aligned(input.stationIds, input.channelObservationFlags, "stationIds");
  unique(input.stationIds, "stations");
  input.expectedStationChannelNumbers.forEach((v) =>
    bounded(v, "channel", 1, 512),
  );
  input.observedStationChannelNumbers.forEach((v, i) =>
    bounded(v, "observed", input.channelObservationFlags[i] ? 1 : 0, 512),
  );
  return {
    stationIdsWithChannelMismatch: input.stationIds.filter(
      (_, i) =>
        input.channelObservationFlags[i] &&
        input.expectedStationChannelNumbers[i] !==
          input.observedStationChannelNumbers[i],
    ),
    stationIdsMissingChannelEvidence: input.stationIds.filter(
      (_, i) => !input.channelObservationFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stationIds: ["A", "B"],
  expectedStationChannelNumbers: [1, 2],
  observedStationChannelNumbers: [1, 1],
  channelObservationFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  stationIdsWithChannelMismatch: ["B"],
  stationIdsMissingChannelEvidence: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/cue-light-system-stations-wiring-loop-lookup",
  title: "Cue Light System Stations Wiring Loop Lookup",
  description:
    "Reconcile actual cue-light station/channel evidence and missing observations, not required-to-observed station ID set coverage, wiring instructions or electrical loop continuity test.",
  inputs: inputFields,
  outputs: [
    {
      id: "stationIdsWithChannelMismatch",
      label: "Station ids with channel mismatch",
      kind: "stringList",
    },
    {
      id: "stationIdsMissingChannelEvidence",
      label: "Station ids missing channel evidence",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      stationIds: value.stationIds as readonly string[],
      expectedStationChannelNumbers:
        value.expectedStationChannelNumbers as readonly number[],
      observedStationChannelNumbers:
        value.observedStationChannelNumbers as readonly number[],
      channelObservationFlags:
        value.channelObservationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
