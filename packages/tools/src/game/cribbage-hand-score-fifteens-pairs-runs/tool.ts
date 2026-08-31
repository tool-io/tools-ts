import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, cribbage } from "../shared.js";
export type Input = Readonly<{
  readonly fourHandCards: readonly string[];
  readonly starterCard: string;
  readonly isCrib: boolean;
}>;
export type Output = Readonly<{
  readonly fifteensPoints: number;
  readonly pairsPoints: number;
  readonly runsPoints: number;
  readonly flushPoints: number;
  readonly nobsPoints: number;
  readonly handTotalPoints: number;
  readonly dealerHeelsPoints: number;
}>;
const inputFields = [
  { id: "fourHandCards", label: "Four hand cards", kind: "stringList" },
  { id: "starterCard", label: "Starter card", kind: "string" },
  { id: "isCrib", label: "Is crib", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return cribbage(input.fourHandCards, input.starterCard, input.isCrib);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fourHandCards: ["5H", "5D", "5C", "JS"],
  starterCard: "5S",
  isCrib: false,
} satisfies Input;
export const exampleOutput = {
  fifteensPoints: 16,
  pairsPoints: 12,
  runsPoints: 0,
  flushPoints: 0,
  nobsPoints: 1,
  handTotalPoints: 29,
  dealerHeelsPoints: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/cribbage-hand-score-fifteens-pairs-runs",
  title: "Cribbage Hand Scorer (15s/Pairs/Runs)",
  description:
    "Score complete cribbage hand/starter by exhaustive bounded subset fifteens and longest multiplicative runs, pairs, hand-versus-crib flush and nobs; starter-jack heels are reported separately, not added to hand points.",
  inputs: inputFields,
  outputs: [
    { id: "fifteensPoints", label: "Fifteens points", kind: "number" },
    { id: "pairsPoints", label: "Pairs points", kind: "number" },
    { id: "runsPoints", label: "Runs points", kind: "number" },
    { id: "flushPoints", label: "Flush points", kind: "number" },
    { id: "nobsPoints", label: "Nobs points", kind: "number" },
    { id: "handTotalPoints", label: "Hand total points", kind: "number" },
    { id: "dealerHeelsPoints", label: "Dealer heels points", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      fourHandCards: value.fourHandCards as readonly string[],
      starterCard: value.starterCard as string,
      isCrib: value.isCrib as boolean,
    }),
});
export const run = tool.execute;
export default tool;
