import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly plannedPreWallDistanceKm: number;
  readonly plannedPreWallSecondsKm: number;
  readonly callerRemainingDistanceKm: number;
  readonly callerPostWallSecondsKm: number;
}>;
export type Output = Readonly<{
  readonly plannedSecondsToCallerWall: number;
  readonly plannedRemainingSeconds: number;
  readonly plannedTotalMarathonSeconds: number;
}>;
const inputFields = [
  {
    id: "plannedPreWallDistanceKm",
    label: "Planned pre wall distance km",
    kind: "number",
  },
  {
    id: "plannedPreWallSecondsKm",
    label: "Planned pre wall seconds km",
    kind: "number",
  },
  {
    id: "callerRemainingDistanceKm",
    label: "Caller remaining distance km",
    kind: "number",
  },
  {
    id: "callerPostWallSecondsKm",
    label: "Caller post wall seconds km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.plannedPreWallSecondsKm, "plannedPreWallSecondsKm");
  positive(input.callerPostWallSecondsKm, "callerPostWallSecondsKm");
  nonnegative(input.plannedPreWallDistanceKm, "plannedPreWallDistanceKm");
  nonnegative(input.callerRemainingDistanceKm, "callerRemainingDistanceKm");
  return {
    plannedSecondsToCallerWall:
      input.plannedPreWallDistanceKm * input.plannedPreWallSecondsKm,
    plannedRemainingSeconds:
      input.callerRemainingDistanceKm * input.callerPostWallSecondsKm,
    plannedTotalMarathonSeconds: sum([
      input.plannedPreWallDistanceKm * input.plannedPreWallSecondsKm,
      input.callerRemainingDistanceKm * input.callerPostWallSecondsKm,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plannedPreWallDistanceKm: 30,
  plannedPreWallSecondsKm: 300,
  callerRemainingDistanceKm: 12.195,
  callerPostWallSecondsKm: 360,
} satisfies Input;
export const exampleOutput = {
  plannedSecondsToCallerWall: 9000,
  plannedRemainingSeconds: 4390.2,
  plannedTotalMarathonSeconds: 13390.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/marathon-split-time-wall",
  title: "Marathon Split Time To The Wall Calculator",
  description:
    "Budget caller separately planned pre/post-wall running segments, exposing time to chosen wall point; no inferred glycogen exhaustion, race completion or medical advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedSecondsToCallerWall",
      label: "Planned seconds to caller wall",
      kind: "number",
    },
    {
      id: "plannedRemainingSeconds",
      label: "Planned remaining seconds",
      kind: "number",
    },
    {
      id: "plannedTotalMarathonSeconds",
      label: "Planned total marathon seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      plannedPreWallDistanceKm: value.plannedPreWallDistanceKm as number,
      plannedPreWallSecondsKm: value.plannedPreWallSecondsKm as number,
      callerRemainingDistanceKm: value.callerRemainingDistanceKm as number,
      callerPostWallSecondsKm: value.callerPostWallSecondsKm as number,
    }),
});
export const run = tool.execute;
export default tool;
