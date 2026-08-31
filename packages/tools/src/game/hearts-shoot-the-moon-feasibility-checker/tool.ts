import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly targetPlayerIndex: number;
  readonly heartsCapturedByPlayers: readonly number[];
  readonly queenSpadesCapturedByPlayer: number;
}>;
export type Output = Readonly<{
  readonly targetCapturedPenaltyPoints: number;
  readonly opponentsCapturedPenaltyPoints: number;
  readonly unallocatedPenaltyPoints: number;
  readonly shootMoonStillArithmeticallyPossible: boolean;
  readonly allMoonPenaltyCardsObservedCaptured: boolean;
}>;
const inputFields = [
  { id: "targetPlayerIndex", label: "Target player index", kind: "number" },
  {
    id: "heartsCapturedByPlayers",
    label: "Hearts captured by players",
    kind: "numberList",
  },
  {
    id: "queenSpadesCapturedByPlayer",
    label: "Queen spades captured by player",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.targetPlayerIndex, "player", 0, 3);
  if (input.heartsCapturedByPlayers.length !== 4)
    simpleError("hearts", "Four player heart counts required.");
  input.heartsCapturedByPlayers.forEach((v) => bounded(v, "hearts", 0, 13));
  if (
    sum(input.heartsCapturedByPlayers) > 13 ||
    !Number.isInteger(input.queenSpadesCapturedByPlayer) ||
    input.queenSpadesCapturedByPlayer < -1 ||
    input.queenSpadesCapturedByPlayer > 3
  )
    simpleError(
      "inventory",
      "Feasible unique penalty-card allocation required; −1 means queen unallocated.",
    );
  const p = input.heartsCapturedByPlayers.map(
      (v, i) => v + (i === input.queenSpadesCapturedByPlayer ? 13 : 0),
    ),
    own = p[input.targetPlayerIndex],
    other = sum(p) - own,
    left = 26 - sum(p);
  return {
    targetCapturedPenaltyPoints: own,
    opponentsCapturedPenaltyPoints: other,
    unallocatedPenaltyPoints: left,
    shootMoonStillArithmeticallyPossible: other === 0,
    allMoonPenaltyCardsObservedCaptured: own === 26,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetPlayerIndex: 0,
  heartsCapturedByPlayers: [5, 0, 0, 0],
  queenSpadesCapturedByPlayer: -1,
} satisfies Input;
export const exampleOutput = {
  targetCapturedPenaltyPoints: 5,
  opponentsCapturedPenaltyPoints: 0,
  unallocatedPenaltyPoints: 21,
  shootMoonStillArithmeticallyPossible: true,
  allMoonPenaltyCardsObservedCaptured: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/hearts-shoot-the-moon-feasibility-checker",
  title: "Hearts Shoot-the-Moon Feasibility Check",
  description:
    "Screen observed hearts/queen-spades allocation for arithmetic shoot-the-moon possibility, retaining unallocated cards; does not infer future trick control or authorize variant scoring.",
  inputs: inputFields,
  outputs: [
    {
      id: "targetCapturedPenaltyPoints",
      label: "Target captured penalty points",
      kind: "number",
    },
    {
      id: "opponentsCapturedPenaltyPoints",
      label: "Opponents captured penalty points",
      kind: "number",
    },
    {
      id: "unallocatedPenaltyPoints",
      label: "Unallocated penalty points",
      kind: "number",
    },
    {
      id: "shootMoonStillArithmeticallyPossible",
      label: "Shoot moon still arithmetically possible",
      kind: "boolean",
    },
    {
      id: "allMoonPenaltyCardsObservedCaptured",
      label: "All moon penalty cards observed captured",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      targetPlayerIndex: value.targetPlayerIndex as number,
      heartsCapturedByPlayers:
        value.heartsCapturedByPlayers as readonly number[],
      queenSpadesCapturedByPlayer: value.queenSpadesCapturedByPlayer as number,
    }),
});
export const run = tool.execute;
export default tool;
