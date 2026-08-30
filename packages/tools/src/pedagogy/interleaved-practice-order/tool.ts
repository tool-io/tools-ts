import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly topicIds: readonly string[];
  readonly repetitionsPerTopic: number;
  readonly startOffset: number;
}>;
export type Output = Readonly<{
  readonly practiceOrder: readonly string[];
  readonly sessionCount: number;
}>;
export const calculate = (input: Input): Output => {
  const ids = input.topicIds,
    n = ids.length;
  if (
    n < 2 ||
    new Set(ids).size !== n ||
    !Number.isSafeInteger(input.repetitionsPerTopic) ||
    input.repetitionsPerTopic < 1 ||
    !Number.isSafeInteger(input.startOffset) ||
    input.startOffset < 0
  )
    simpleError(
      "topicIds",
      "Two or more distinct topics and valid repetition/offset required.",
    );
  const practiceOrder: string[] = [];
  for (let round = 0; round < input.repetitionsPerTopic; round++)
    for (let j = 0; j < n; j++)
      practiceOrder.push(
        ids[(j + (n === 2 ? 0 : round) + input.startOffset) % n],
      );
  return { practiceOrder, sessionCount: practiceOrder.length };
};
export const exampleInput = {
  topicIds: ["A", "B", "C"],
  repetitionsPerTopic: 2,
  startOffset: 0,
} satisfies Input;
export const exampleOutput = {
  practiceOrder: ["A", "B", "C", "B", "C", "A"],
  sessionCount: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/interleaved-practice-order",
  title: "Interleaved Practice Order",
  description: "Build a round-robin interleaved topic practice sequence.",
  inputs: [
    { id: "topicIds", label: "Topic ids", kind: "stringList" },
    {
      id: "repetitionsPerTopic",
      label: "Repetitions per topic",
      kind: "number",
    },
    { id: "startOffset", label: "Start offset", kind: "number" },
  ],
  outputs: [
    { id: "practiceOrder", label: "Practice order", kind: "stringList" },
    { id: "sessionCount", label: "Session count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      topicIds: value.topicIds as readonly string[],
      repetitionsPerTopic: value.repetitionsPerTopic as number,
      startOffset: value.startOffset as number,
    }),
});
export const run = tool.execute;
export default tool;
