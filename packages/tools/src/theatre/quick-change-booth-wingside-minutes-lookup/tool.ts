import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
  literal,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly costumeChangeIds: readonly string[];
  readonly exitStageSides: readonly string[];
  readonly assignedBoothSides: readonly string[];
  readonly measuredBoothWalkSeconds: readonly number[];
  readonly availableExitToEntranceSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly oppositeWingBoothChangeIds: readonly string[];
  readonly signedWalkOnlyChangeSlackSeconds: readonly number[];
}>;
const inputFields = [
  { id: "costumeChangeIds", label: "Costume change ids", kind: "stringList" },
  { id: "exitStageSides", label: "Exit stage sides", kind: "stringList" },
  {
    id: "assignedBoothSides",
    label: "Assigned booth sides",
    kind: "stringList",
  },
  {
    id: "measuredBoothWalkSeconds",
    label: "Measured booth walk seconds",
    kind: "numberList",
  },
  {
    id: "availableExitToEntranceSeconds",
    label: "Available exit to entrance seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredBoothWalkSeconds.forEach((v) =>
    nonnegative(v, "measuredBoothWalkSeconds"),
  );
  input.availableExitToEntranceSeconds.forEach((v) =>
    nonnegative(v, "availableExitToEntranceSeconds"),
  );
  aligned(input.costumeChangeIds, input.exitStageSides, "costumeChangeIds");
  aligned(input.costumeChangeIds, input.assignedBoothSides, "costumeChangeIds");
  aligned(
    input.costumeChangeIds,
    input.measuredBoothWalkSeconds,
    "costumeChangeIds",
  );
  aligned(
    input.costumeChangeIds,
    input.availableExitToEntranceSeconds,
    "costumeChangeIds",
  );
  unique(input.costumeChangeIds, "changes");
  [...input.exitStageSides, ...input.assignedBoothSides].forEach((v) =>
    literal(v, ["left", "right"], "stageSide"),
  );
  return {
    oppositeWingBoothChangeIds: input.costumeChangeIds.filter(
      (_, i) => input.exitStageSides[i] !== input.assignedBoothSides[i],
    ),
    signedWalkOnlyChangeSlackSeconds: input.availableExitToEntranceSeconds.map(
      (v, i) => v - input.measuredBoothWalkSeconds[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  costumeChangeIds: ["A", "B"],
  exitStageSides: ["left", "right"],
  assignedBoothSides: ["left", "left"],
  measuredBoothWalkSeconds: [5, 20],
  availableExitToEntranceSeconds: [30, 15],
} satisfies Input;
export const exampleOutput = {
  oppositeWingBoothChangeIds: ["B"],
  signedWalkOnlyChangeSlackSeconds: [25, -5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/quick-change-booth-wingside-minutes-lookup",
  title: "Quick Change Booth Wingside Minutes Lookup",
  description:
    "Audit actual exit/booth wing assignment and measured travel-only slack separately from dressing-task handoff budget; no assuming walk-only slack proves a feasible quick change.",
  inputs: inputFields,
  outputs: [
    {
      id: "oppositeWingBoothChangeIds",
      label: "Opposite wing booth change ids",
      kind: "stringList",
    },
    {
      id: "signedWalkOnlyChangeSlackSeconds",
      label: "Signed walk only change slack seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      costumeChangeIds: value.costumeChangeIds as readonly string[],
      exitStageSides: value.exitStageSides as readonly string[],
      assignedBoothSides: value.assignedBoothSides as readonly string[],
      measuredBoothWalkSeconds:
        value.measuredBoothWalkSeconds as readonly number[],
      availableExitToEntranceSeconds:
        value.availableExitToEntranceSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
