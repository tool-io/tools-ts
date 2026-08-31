import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, binary, sum } from "../shared.js";
export type Input = Readonly<{
  readonly suspectExcludedFlags: readonly number[];
  readonly weaponExcludedFlags: readonly number[];
  readonly roomExcludedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly remainingSuspects: number;
  readonly remainingWeapons: number;
  readonly remainingRooms: number;
  readonly unexcludedEnvelopeCombinations: number;
  readonly contradictoryExclusionInventory: boolean;
}>;
const inputFields = [
  {
    id: "suspectExcludedFlags",
    label: "Suspect excluded flags",
    kind: "numberList",
  },
  {
    id: "weaponExcludedFlags",
    label: "Weapon excluded flags",
    kind: "numberList",
  },
  { id: "roomExcludedFlags", label: "Room excluded flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.suspectExcludedFlags.length !== 6 ||
    input.weaponExcludedFlags.length !== 6 ||
    input.roomExcludedFlags.length !== 9
  )
    simpleError(
      "inventory",
      "Standard six suspects/six weapons/nine rooms required.",
    );
  [
    input.suspectExcludedFlags,
    input.weaponExcludedFlags,
    input.roomExcludedFlags,
  ].forEach((v) => binary(v, "excluded"));
  const a = 6 - sum(input.suspectExcludedFlags),
    b = 6 - sum(input.weaponExcludedFlags),
    c = 9 - sum(input.roomExcludedFlags);
  return {
    remainingSuspects: a,
    remainingWeapons: b,
    remainingRooms: c,
    unexcludedEnvelopeCombinations: a * b * c,
    contradictoryExclusionInventory: a * b * c === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  suspectExcludedFlags: [1, 1, 1, 1, 1, 0],
  weaponExcludedFlags: [1, 1, 1, 1, 1, 0],
  roomExcludedFlags: [1, 1, 1, 1, 1, 1, 1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  remainingSuspects: 1,
  remainingWeapons: 1,
  remainingRooms: 1,
  unexcludedEnvelopeCombinations: 1,
  contradictoryExclusionInventory: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/clue-suspect-weapon-room-elimination-count",
  title: "Clue Card Elimination Count Matrix",
  description:
    "Audit direct category exclusions for standard Clue envelope combinations, retaining contradictory empty categories; no deduction from disjunctive player responses or correlation proof.",
  inputs: inputFields,
  outputs: [
    { id: "remainingSuspects", label: "Remaining suspects", kind: "number" },
    { id: "remainingWeapons", label: "Remaining weapons", kind: "number" },
    { id: "remainingRooms", label: "Remaining rooms", kind: "number" },
    {
      id: "unexcludedEnvelopeCombinations",
      label: "Unexcluded envelope combinations",
      kind: "number",
    },
    {
      id: "contradictoryExclusionInventory",
      label: "Contradictory exclusion inventory",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      suspectExcludedFlags: value.suspectExcludedFlags as readonly number[],
      weaponExcludedFlags: value.weaponExcludedFlags as readonly number[],
      roomExcludedFlags: value.roomExcludedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
