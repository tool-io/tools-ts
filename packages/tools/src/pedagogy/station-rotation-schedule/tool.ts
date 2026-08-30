import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly groupIds: readonly string[];
  readonly stationIds: readonly string[];
  readonly roundMinutes: number;
  readonly startMinute: number;
}>;
export type Output = Readonly<{
  readonly assignments: readonly string[];
  readonly roundStartMinutes: readonly number[];
  readonly endMinute: number;
}>;
export const calculate = (input: Input): Output => {
  const g = input.groupIds,
    s = input.stationIds,
    n = g.length;
  if (
    !n ||
    s.length !== n ||
    new Set(g).size !== n ||
    new Set(s).size !== n ||
    input.roundMinutes <= 0
  )
    simpleError(
      "stationIds",
      "Equal counts of distinct groups and stations, positive round duration required.",
    );
  return {
    assignments: Array.from({ length: n }, (_, round) =>
      g.map((id, i) => `${id}:${s[(i + round) % n]}`).join(","),
    ),
    roundStartMinutes: Array.from(
      { length: n },
      (_, round) => input.startMinute + round * input.roundMinutes,
    ),
    endMinute: input.startMinute + n * input.roundMinutes,
  };
};
export const exampleInput = {
  groupIds: ["A", "B", "C"],
  stationIds: ["1", "2", "3"],
  roundMinutes: 10,
  startMinute: 0,
} satisfies Input;
export const exampleOutput = {
  assignments: ["A:1,B:2,C:3", "A:2,B:3,C:1", "A:3,B:1,C:2"],
  roundStartMinutes: [0, 10, 20],
  endMinute: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/station-rotation-schedule",
  title: "Station Rotation Schedule",
  description:
    "Create a cyclic station-rotation schedule with one visit per group per station.",
  inputs: [
    { id: "groupIds", label: "Group ids", kind: "stringList" },
    { id: "stationIds", label: "Station ids", kind: "stringList" },
    { id: "roundMinutes", label: "Round minutes", kind: "number" },
    { id: "startMinute", label: "Start minute", kind: "number" },
  ],
  outputs: [
    { id: "assignments", label: "Assignments", kind: "stringList" },
    {
      id: "roundStartMinutes",
      label: "Round start minutes",
      kind: "numberList",
    },
    { id: "endMinute", label: "End minute", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      groupIds: value.groupIds as readonly string[],
      stationIds: value.stationIds as readonly string[],
      roundMinutes: value.roundMinutes as number,
      startMinute: value.startMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
