import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly startMinute: number;
  readonly thinkMinutes: number;
  readonly pairMinutes: number;
  readonly shareMinutes: number;
  readonly participantCount: number;
}>;
export type Output = Readonly<{
  readonly phaseStartMinutes: readonly number[];
  readonly endMinute: number;
  readonly pairCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    [input.thinkMinutes, input.pairMinutes, input.shareMinutes].some(
      (v) => v <= 0,
    ) ||
    !Number.isSafeInteger(input.participantCount) ||
    input.participantCount < 2
  )
    simpleError(
      "participantCount",
      "Positive phase times and at least two participants required.",
    );
  return {
    phaseStartMinutes: [
      input.startMinute,
      input.startMinute + input.thinkMinutes,
      input.startMinute + input.thinkMinutes + input.pairMinutes,
    ],
    endMinute:
      input.startMinute +
      input.thinkMinutes +
      input.pairMinutes +
      input.shareMinutes,
    pairCount: Math.ceil(input.participantCount / 2),
  };
};
export const exampleInput = {
  startMinute: 5,
  thinkMinutes: 2,
  pairMinutes: 3,
  shareMinutes: 5,
  participantCount: 5,
} satisfies Input;
export const exampleOutput = {
  phaseStartMinutes: [5, 7, 10],
  endMinute: 15,
  pairCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/think-pair-share-timeline",
  title: "Think Pair Share Timeline",
  description: "Schedule think, pair, and share phases with pair count.",
  inputs: [
    { id: "startMinute", label: "Start minute", kind: "number" },
    { id: "thinkMinutes", label: "Think minutes", kind: "number" },
    { id: "pairMinutes", label: "Pair minutes", kind: "number" },
    { id: "shareMinutes", label: "Share minutes", kind: "number" },
    { id: "participantCount", label: "Participant count", kind: "number" },
  ],
  outputs: [
    {
      id: "phaseStartMinutes",
      label: "Phase start minutes",
      kind: "numberList",
    },
    { id: "endMinute", label: "End minute", kind: "number" },
    { id: "pairCount", label: "Pair count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startMinute: value.startMinute as number,
      thinkMinutes: value.thinkMinutes as number,
      pairMinutes: value.pairMinutes as number,
      shareMinutes: value.shareMinutes as number,
      participantCount: value.participantCount as number,
    }),
});
export const run = tool.execute;
export default tool;
