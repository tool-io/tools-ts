import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly bossWorldPosition: readonly number[];
  readonly spawnAnchorPosition: readonly number[];
  readonly callerLeashRadius: number;
  readonly callerResetWhenAtBoundary: boolean;
}>;
export type Output = Readonly<{
  readonly bossDistanceFromSpawnAnchor: number;
  readonly signedLeashMargin: number;
  readonly callerLeashResetTriggered: boolean;
}>;
const inputFields = [
  { id: "bossWorldPosition", label: "Boss world position", kind: "numberList" },
  {
    id: "spawnAnchorPosition",
    label: "Spawn anchor position",
    kind: "numberList",
  },
  { id: "callerLeashRadius", label: "Caller leash radius", kind: "number" },
  {
    id: "callerResetWhenAtBoundary",
    label: "Caller reset when at boundary",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerLeashRadius, "callerLeashRadius");
  if (
    input.bossWorldPosition.length !== 2 ||
    input.spawnAnchorPosition.length !== 2
  )
    simpleError("position", "Two-dimensional caller world positions required.");
  const d = Math.hypot(
    input.bossWorldPosition[0] - input.spawnAnchorPosition[0],
    input.bossWorldPosition[1] - input.spawnAnchorPosition[1],
  );
  return {
    bossDistanceFromSpawnAnchor: d,
    signedLeashMargin: input.callerLeashRadius - d,
    callerLeashResetTriggered: input.callerResetWhenAtBoundary
      ? d >= input.callerLeashRadius
      : d > input.callerLeashRadius,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bossWorldPosition: [6, 8],
  spawnAnchorPosition: [0, 0],
  callerLeashRadius: 10,
  callerResetWhenAtBoundary: false,
} satisfies Input;
export const exampleOutput = {
  bossDistanceFromSpawnAnchor: 10,
  signedLeashMargin: 0,
  callerLeashResetTriggered: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/boss-leash-range-reset-distance-checker",
  title: "Boss Leash Range Reset Distance Check",
  description:
    "Audit actual boss displacement from explicit spawn anchor under caller strict/inclusive reset boundary; not distance from current player or hardcoded boss leash behavior.",
  inputs: inputFields,
  outputs: [
    {
      id: "bossDistanceFromSpawnAnchor",
      label: "Boss distance from spawn anchor",
      kind: "number",
    },
    { id: "signedLeashMargin", label: "Signed leash margin", kind: "number" },
    {
      id: "callerLeashResetTriggered",
      label: "Caller leash reset triggered",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      bossWorldPosition: value.bossWorldPosition as readonly number[],
      spawnAnchorPosition: value.spawnAnchorPosition as readonly number[],
      callerLeashRadius: value.callerLeashRadius as number,
      callerResetWhenAtBoundary: value.callerResetWhenAtBoundary as boolean,
    }),
});
export const run = tool.execute;
export default tool;
