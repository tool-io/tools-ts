import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly currentDancerIdsBySlot: readonly string[];
  readonly targetDancerIdsBySlot: readonly string[];
}>;
export type Output = Readonly<{
  readonly dancersChangingSlots: number;
  readonly minimumUnrestrictedPairwiseSlotSwaps: number;
  readonly plannedSwapSlotPairs: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "currentDancerIdsBySlot",
    label: "Current dancer ids by slot",
    kind: "stringList",
  },
  {
    id: "targetDancerIdsBySlot",
    label: "Target dancer ids by slot",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.currentDancerIdsBySlot, "current");
  unique(input.targetDancerIdsBySlot, "target");
  aligned(input.currentDancerIdsBySlot, input.targetDancerIdsBySlot, "slots");
  if (
    input.currentDancerIdsBySlot.length > 128 ||
    input.targetDancerIdsBySlot.some(
      (v) => !input.currentDancerIdsBySlot.includes(v),
    )
  )
    simpleError(
      "formation",
      "Same 1–128 dancer identities in both formations required.",
    );
  const arrangement = [...input.currentDancerIdsBySlot],
    swaps: number[][] = [];
  for (let i = 0; i < arrangement.length; i++)
    if (arrangement[i] !== input.targetDancerIdsBySlot[i]) {
      const j = arrangement.indexOf(input.targetDancerIdsBySlot[i]);
      swaps.push([i, j]);
      [arrangement[i], arrangement[j]] = [arrangement[j], arrangement[i]];
    }
  return {
    dancersChangingSlots: input.currentDancerIdsBySlot.filter(
      (v, i) => v !== input.targetDancerIdsBySlot[i],
    ).length,
    minimumUnrestrictedPairwiseSlotSwaps: swaps.length,
    plannedSwapSlotPairs: swaps,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentDancerIdsBySlot: ["A", "B", "C", "D"],
  targetDancerIdsBySlot: ["B", "A", "D", "C"],
} satisfies Input;
export const exampleOutput = {
  dancersChangingSlots: 4,
  minimumUnrestrictedPairwiseSlotSwaps: 2,
  plannedSwapSlotPairs: [
    [0, 1],
    [2, 3],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/formation-swap-minimum-position-moves-solver",
  title: "Formation Swap Minimum Position Moves Solver",
  description:
    "Solve actual fixed-identity formation permutation with deterministic minimum unrestricted pair swaps and moving-dancer count; not Euclidean position assignment, sequential crossing paths, collision avoidance or stage-coordinate transforms.",
  inputs: inputFields,
  outputs: [
    {
      id: "dancersChangingSlots",
      label: "Dancers changing slots",
      kind: "number",
    },
    {
      id: "minimumUnrestrictedPairwiseSlotSwaps",
      label: "Minimum unrestricted pairwise slot swaps",
      kind: "number",
    },
    {
      id: "plannedSwapSlotPairs",
      label: "Planned swap slot pairs",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      currentDancerIdsBySlot: value.currentDancerIdsBySlot as readonly string[],
      targetDancerIdsBySlot: value.targetDancerIdsBySlot as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
