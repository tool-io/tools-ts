import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, bounded, dice } from "../shared.js";
export type Input = Readonly<{
  readonly rolledDice: readonly number[];
  readonly currentlyInJail: boolean;
  readonly priorConsecutiveDoubles: number;
  readonly priorFailedJailAttempts: number;
}>;
export type Output = Readonly<{
  readonly mustGoToJailNow: boolean;
  readonly releasedByDouble: boolean;
  readonly mustPayAfterThirdFailedAttempt: boolean;
  readonly moveDistanceAfterJailResolution: number;
  readonly nextConsecutiveDoubles: number;
  readonly nextFailedJailAttempts: number;
  readonly entitledToAnotherRoll: boolean;
}>;
const inputFields = [
  { id: "rolledDice", label: "Rolled dice", kind: "numberList" },
  { id: "currentlyInJail", label: "Currently in jail", kind: "boolean" },
  {
    id: "priorConsecutiveDoubles",
    label: "Prior consecutive doubles",
    kind: "number",
  },
  {
    id: "priorFailedJailAttempts",
    label: "Prior failed jail attempts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  dice(input.rolledDice, 2);
  bounded(input.priorConsecutiveDoubles, "doubles", 0, 2);
  bounded(input.priorFailedJailAttempts, "jailAttempts", 0, 2);
  if (
    (input.currentlyInJail && input.priorConsecutiveDoubles !== 0) ||
    (!input.currentlyInJail && input.priorFailedJailAttempts !== 0)
  )
    simpleError("state", "Jailed/free state must match carried counters.");
  const doubles = input.rolledDice[0] === input.rolledDice[1],
    jail =
      !input.currentlyInJail && doubles && input.priorConsecutiveDoubles === 2,
    released = input.currentlyInJail && doubles,
    pay =
      input.currentlyInJail && !doubles && input.priorFailedJailAttempts === 2,
    moves = !jail && (!input.currentlyInJail || released || pay);
  return {
    mustGoToJailNow: jail,
    releasedByDouble: released,
    mustPayAfterThirdFailedAttempt: pay,
    moveDistanceAfterJailResolution: moves ? sum(input.rolledDice) : 0,
    nextConsecutiveDoubles:
      !input.currentlyInJail && !jail && doubles
        ? input.priorConsecutiveDoubles + 1
        : 0,
    nextFailedJailAttempts:
      input.currentlyInJail && !released && !pay
        ? input.priorFailedJailAttempts + 1
        : 0,
    entitledToAnotherRoll: !input.currentlyInJail && !jail && doubles,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rolledDice: [3, 3],
  currentlyInJail: false,
  priorConsecutiveDoubles: 2,
  priorFailedJailAttempts: 0,
} satisfies Input;
export const exampleOutput = {
  mustGoToJailNow: true,
  releasedByDouble: false,
  mustPayAfterThirdFailedAttempt: false,
  moveDistanceAfterJailResolution: 0,
  nextConsecutiveDoubles: 0,
  nextFailedJailAttempts: 0,
  entitledToAnotherRoll: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/monopoly-jail-three-doubles-exit-rule",
  title: "Monopoly Jail Three-Doubles Exit Rule",
  description:
    "Resolve observed Monopoly third-consecutive-double jailing versus jailed double/third-failed-attempt release; jailed doubles do not grant another roll. Fees, cards, landing effects and voluntary early payment are outside this state transition.",
  inputs: inputFields,
  outputs: [
    { id: "mustGoToJailNow", label: "Must go to jail now", kind: "boolean" },
    { id: "releasedByDouble", label: "Released by double", kind: "boolean" },
    {
      id: "mustPayAfterThirdFailedAttempt",
      label: "Must pay after third failed attempt",
      kind: "boolean",
    },
    {
      id: "moveDistanceAfterJailResolution",
      label: "Move distance after jail resolution",
      kind: "number",
    },
    {
      id: "nextConsecutiveDoubles",
      label: "Next consecutive doubles",
      kind: "number",
    },
    {
      id: "nextFailedJailAttempts",
      label: "Next failed jail attempts",
      kind: "number",
    },
    {
      id: "entitledToAnotherRoll",
      label: "Entitled to another roll",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      rolledDice: value.rolledDice as readonly number[],
      currentlyInJail: value.currentlyInJail as boolean,
      priorConsecutiveDoubles: value.priorConsecutiveDoubles as number,
      priorFailedJailAttempts: value.priorFailedJailAttempts as number,
    }),
});
export const run = tool.execute;
export default tool;
