import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly choreographicEventCounts: readonly number[];
  readonly countOneAudioBeatIndex: number;
  readonly callerAudioBeatsPerDanceCount: number;
}>;
export type Output = Readonly<{
  readonly eventPhraseNumbers: readonly number[];
  readonly eventOneBasedCountsWithinPhrase: readonly number[];
  readonly mappedAudioBeatIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "choreographicEventCounts",
    label: "Choreographic event counts",
    kind: "numberList",
  },
  {
    id: "countOneAudioBeatIndex",
    label: "Count one audio beat index",
    kind: "number",
  },
  {
    id: "callerAudioBeatsPerDanceCount",
    label: "Caller audio beats per dance count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerAudioBeatsPerDanceCount,
    "callerAudioBeatsPerDanceCount",
  );
  input.choreographicEventCounts.forEach((v) =>
    nonnegative(v, "choreographicEventCounts"),
  );
  nonnegative(input.countOneAudioBeatIndex, "countOneAudioBeatIndex");
  sequence(input.choreographicEventCounts, "events");
  input.choreographicEventCounts.forEach((v) =>
    bounded(v, "count", 0, 1000000),
  );
  return {
    eventPhraseNumbers: input.choreographicEventCounts.map(
      (v) => Math.floor(v / 8) + 1,
    ),
    eventOneBasedCountsWithinPhrase: input.choreographicEventCounts.map(
      (v) => (v % 8) + 1,
    ),
    mappedAudioBeatIndices: input.choreographicEventCounts.map(
      (v) =>
        input.countOneAudioBeatIndex + v * input.callerAudioBeatsPerDanceCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  choreographicEventCounts: [0, 7, 8, 15],
  countOneAudioBeatIndex: 4,
  callerAudioBeatsPerDanceCount: 1,
} satisfies Input;
export const exampleOutput = {
  eventPhraseNumbers: [1, 1, 2, 2],
  eventOneBasedCountsWithinPhrase: [1, 8, 1, 8],
  mappedAudioBeatIndices: [4, 11, 12, 19],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/eight-count-phrase-beat-mapper",
  title: "Eight Count Phrase Beat Mapper",
  description:
    "Map actual choreographic event counts into eight-count phrases and caller audio-beat anchor/rate; integer count events, no assumed downbeat, tempo inference or generic bars/count conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "eventPhraseNumbers",
      label: "Event phrase numbers",
      kind: "numberList",
    },
    {
      id: "eventOneBasedCountsWithinPhrase",
      label: "Event one based counts within phrase",
      kind: "numberList",
    },
    {
      id: "mappedAudioBeatIndices",
      label: "Mapped audio beat indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      choreographicEventCounts:
        value.choreographicEventCounts as readonly number[],
      countOneAudioBeatIndex: value.countOneAudioBeatIndex as number,
      callerAudioBeatsPerDanceCount:
        value.callerAudioBeatsPerDanceCount as number,
    }),
});
export const run = tool.execute;
export default tool;
