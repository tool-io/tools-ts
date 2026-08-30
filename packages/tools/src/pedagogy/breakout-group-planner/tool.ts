import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly participantIds: readonly string[];
  readonly maximumRoomSize: number;
  readonly activityMinutes: number;
  readonly setupMinutes: number;
}>;
export type Output = Readonly<{
  readonly roomAssignments: readonly string[];
  readonly roomCount: number;
  readonly workingMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  const ids = input.participantIds;
  if (
    !ids.length ||
    new Set(ids).size !== ids.length ||
    !Number.isSafeInteger(input.maximumRoomSize) ||
    input.maximumRoomSize < 1 ||
    input.activityMinutes <= input.setupMinutes ||
    input.setupMinutes < 0
  )
    simpleError(
      "participantIds",
      "Unique participants, positive room capacity and working time required.",
    );
  const roomAssignments: string[] = [];
  for (let i = 0; i < ids.length; i += input.maximumRoomSize)
    roomAssignments.push(ids.slice(i, i + input.maximumRoomSize).join(","));
  return {
    roomAssignments,
    roomCount: roomAssignments.length,
    workingMinutes: input.activityMinutes - input.setupMinutes,
  };
};
export const exampleInput = {
  participantIds: ["A", "B", "C", "D", "E"],
  maximumRoomSize: 2,
  activityMinutes: 12,
  setupMinutes: 2,
} satisfies Input;
export const exampleOutput = {
  roomAssignments: ["A,B", "C,D", "E"],
  roomCount: 3,
  workingMinutes: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/breakout-group-planner",
  title: "Breakout Group Planner",
  description:
    "Partition participants into breakout rooms and calculate usable task time.",
  inputs: [
    { id: "participantIds", label: "Participant ids", kind: "stringList" },
    { id: "maximumRoomSize", label: "Maximum room size", kind: "number" },
    { id: "activityMinutes", label: "Activity minutes", kind: "number" },
    { id: "setupMinutes", label: "Setup minutes", kind: "number" },
  ],
  outputs: [
    { id: "roomAssignments", label: "Room assignments", kind: "stringList" },
    { id: "roomCount", label: "Room count", kind: "number" },
    { id: "workingMinutes", label: "Working minutes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      participantIds: value.participantIds as readonly string[],
      maximumRoomSize: value.maximumRoomSize as number,
      activityMinutes: value.activityMinutes as number,
      setupMinutes: value.setupMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
