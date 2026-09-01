import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, sum } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedThreeGamePins: readonly number[];
  readonly callerPerGameHandicapPins: number;
}>;
export type Output = Readonly<{
  readonly scratchThreeGameSeriesPins: number;
  readonly handicapThreeGameSeriesPins: number;
}>;
const inputFields = [
  {
    id: "observedThreeGamePins",
    label: "Observed three game pins",
    kind: "numberList",
  },
  {
    id: "callerPerGameHandicapPins",
    label: "Caller per game handicap pins",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.observedThreeGamePins.length !== 3)
    simpleError("series", "Exactly three observed games required.");
  input.observedThreeGamePins.forEach((v) => bounded(v, "pins", 0, 300));
  bounded(input.callerPerGameHandicapPins, "handicap", 0, 300);
  return {
    scratchThreeGameSeriesPins: sum(input.observedThreeGamePins),
    handicapThreeGameSeriesPins:
      sum(input.observedThreeGamePins) + 3 * input.callerPerGameHandicapPins,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedThreeGamePins: [100, 150, 200],
  callerPerGameHandicapPins: 20,
} satisfies Input;
export const exampleOutput = {
  scratchThreeGameSeriesPins: 450,
  handicapThreeGameSeriesPins: 510,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/bowling-series-three-game-total",
  title: "Three-Game Bowling Series Total",
  description:
    "Reconcile actual three-game bowling series with independently supplied per-game handicap; not selecting league handicap or generic untyped list summation.",
  inputs: inputFields,
  outputs: [
    {
      id: "scratchThreeGameSeriesPins",
      label: "Scratch three game series pins",
      kind: "number",
    },
    {
      id: "handicapThreeGameSeriesPins",
      label: "Handicap three game series pins",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedThreeGamePins: value.observedThreeGamePins as readonly number[],
      callerPerGameHandicapPins: value.callerPerGameHandicapPins as number,
    }),
});
export const run = tool.execute;
export default tool;
