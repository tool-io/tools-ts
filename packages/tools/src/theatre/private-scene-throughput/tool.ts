import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rooms: number;
  readonly operatingMinutes: number;
  readonly sceneMinutes: number;
  readonly turnoverMinutes: number;
}>;
export type Output = Readonly<{
  readonly scenesPerRoom: number;
  readonly totalSceneCapacity: number;
  readonly unusedMinutesPerRoom: number;
}>;

export const calculate = (input: Input): Output => {
  const cycleMinutes = input.sceneMinutes + input.turnoverMinutes;
  if (cycleMinutes <= 0)
    simpleError(
      "sceneMinutes",
      "Scene plus turnover time must be positive.",
      "invalid_cycle",
    );
  const scenesPerRoom = Math.floor(input.operatingMinutes / cycleMinutes);
  return {
    scenesPerRoom,
    totalSceneCapacity: scenesPerRoom * input.rooms,
    unusedMinutesPerRoom: input.operatingMinutes - scenesPerRoom * cycleMinutes,
  };
};

export const exampleInput = {
  rooms: 3,
  operatingMinutes: 240,
  sceneMinutes: 20,
  turnoverMinutes: 10,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  rooms: 1,
  operatingMinutes: 25,
  sceneMinutes: 20,
  turnoverMinutes: 10,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rooms: input.rooms as number,
      operatingMinutes: input.operatingMinutes as number,
      sceneMinutes: input.sceneMinutes as number,
      turnoverMinutes: input.turnoverMinutes as number,
    }),
  description:
    "Calculate private-scene capacity from rooms, operating time, and turnover.",
  id: "theatre/private-scene-throughput",
  inputs: [
    { id: "rooms", label: "Available rooms", kind: "integer", minimum: 1 },
    {
      id: "operatingMinutes",
      label: "Operating time",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "sceneMinutes",
      label: "Scene duration",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "turnoverMinutes",
      label: "Turnover duration",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      id: "scenesPerRoom",
      label: "Scenes per room",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalSceneCapacity",
      label: "Total scene capacity",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "unusedMinutesPerRoom",
      label: "Unused time per room",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
  ],
  title: "Private Scene Throughput",
});

export const run = tool.execute;
export default tool;
