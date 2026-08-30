import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly initialCorrect: number;
  readonly postDiscussionCorrect: number;
  readonly participants: number;
}>;
export type Output = Readonly<{
  readonly initialPercent: number;
  readonly postPercent: number;
  readonly percentagePointGain: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.participants) ||
    input.participants < 1 ||
    !Number.isSafeInteger(input.initialCorrect) ||
    !Number.isSafeInteger(input.postDiscussionCorrect) ||
    input.initialCorrect < 0 ||
    input.postDiscussionCorrect < 0 ||
    input.initialCorrect > input.participants ||
    input.postDiscussionCorrect > input.participants
  )
    simpleError(
      "participants",
      "Correct responses must be within the positive cohort size.",
    );
  return {
    initialPercent: (100 * input.initialCorrect) / input.participants,
    postPercent: (100 * input.postDiscussionCorrect) / input.participants,
    percentagePointGain:
      (100 * (input.postDiscussionCorrect - input.initialCorrect)) /
      input.participants,
  };
};
export const exampleInput = {
  initialCorrect: 12,
  postDiscussionCorrect: 18,
  participants: 20,
} satisfies Input;
export const exampleOutput = {
  initialPercent: 60,
  postPercent: 90,
  percentagePointGain: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/peer-instruction-vote-shift",
  title: "Peer Instruction Vote Shift",
  description:
    "Compare peer-instruction concept votes before and after discussion.",
  inputs: [
    { id: "initialCorrect", label: "Initial correct", kind: "number" },
    {
      id: "postDiscussionCorrect",
      label: "Post discussion correct",
      kind: "number",
    },
    { id: "participants", label: "Participants", kind: "number" },
  ],
  outputs: [
    { id: "initialPercent", label: "Initial percent", kind: "number" },
    { id: "postPercent", label: "Post percent", kind: "number" },
    {
      id: "percentagePointGain",
      label: "Percentage point gain",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialCorrect: value.initialCorrect as number,
      postDiscussionCorrect: value.postDiscussionCorrect as number,
      participants: value.participants as number,
    }),
});
export const run = tool.execute;
export default tool;
