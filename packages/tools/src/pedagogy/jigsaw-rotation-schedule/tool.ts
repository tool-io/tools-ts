import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly studentIds: readonly string[];
  readonly topicIds: readonly string[];
  readonly homeGroupSize: number;
}>;
export type Output = Readonly<{
  readonly homeGroups: readonly string[];
  readonly expertGroups: readonly string[];
  readonly expertGroupCount: number;
}>;
export const calculate = (input: Input): Output => {
  const ids = input.studentIds,
    topics = input.topicIds;
  if (
    !ids.length ||
    !topics.length ||
    new Set(ids).size !== ids.length ||
    new Set(topics).size !== topics.length ||
    !Number.isSafeInteger(input.homeGroupSize) ||
    input.homeGroupSize !== topics.length ||
    ids.length % input.homeGroupSize !== 0
  )
    simpleError(
      "homeGroupSize",
      "Unique roster and topics, one topic per home-group member, and complete groups required.",
    );
  const homeGroups: string[] = [],
    buckets = topics.map(() => [] as string[]);
  for (let i = 0; i < ids.length; i += input.homeGroupSize) {
    homeGroups.push(ids.slice(i, i + input.homeGroupSize).join(","));
    for (let j = 0; j < topics.length; j++) buckets[j].push(ids[i + j]);
  }
  return {
    homeGroups,
    expertGroups: buckets.map((v) => v.join(",")),
    expertGroupCount: topics.length,
  };
};
export const exampleInput = {
  studentIds: ["A", "B", "C", "D", "E", "F"],
  topicIds: ["T1", "T2", "T3"],
  homeGroupSize: 3,
} satisfies Input;
export const exampleOutput = {
  homeGroups: ["A,B,C", "D,E,F"],
  expertGroups: ["A,D", "B,E", "C,F"],
  expertGroupCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/jigsaw-rotation-schedule",
  title: "Jigsaw Rotation Schedule",
  description:
    "Assign each home-group member a distinct topic and form expert groups.",
  inputs: [
    { id: "studentIds", label: "Student ids", kind: "stringList" },
    { id: "topicIds", label: "Topic ids", kind: "stringList" },
    { id: "homeGroupSize", label: "Home group size", kind: "number" },
  ],
  outputs: [
    { id: "homeGroups", label: "Home groups", kind: "stringList" },
    { id: "expertGroups", label: "Expert groups", kind: "stringList" },
    { id: "expertGroupCount", label: "Expert group count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      studentIds: value.studentIds as readonly string[],
      topicIds: value.topicIds as readonly string[],
      homeGroupSize: value.homeGroupSize as number,
    }),
});
export const run = tool.execute;
export default tool;
