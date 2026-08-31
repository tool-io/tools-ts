import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, cards } from "../shared.js";
export type Input = Readonly<{
  readonly cleanOutCount: number;
  readonly unseenCardCount: number;
  readonly cardsToCome: number;
}>;
export type Output = Readonly<{
  readonly ruleOfTwoOrFourApproxPercent: number;
  readonly exactAtLeastOneCleanOutPercent: number;
  readonly signedApproximationErrorPercentagePoints: number;
}>;
const inputFields = [
  { id: "cleanOutCount", label: "Clean out count", kind: "number" },
  { id: "unseenCardCount", label: "Unseen card count", kind: "number" },
  { id: "cardsToCome", label: "Cards to come", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.unseenCardCount, "unseen", 1, 52);
  bounded(input.cleanOutCount, "outs", 0, input.unseenCardCount);
  bounded(input.cardsToCome, "cardsToCome", 1, 2);
  if (input.cardsToCome > input.unseenCardCount)
    simpleError("cards", "Enough unseen cards required.");
  let miss = 1;
  for (let i = 0; i < input.cardsToCome; i++)
    miss *=
      Math.max(0, input.unseenCardCount - input.cleanOutCount - i) /
      (input.unseenCardCount - i);
  const exact = 100 * (1 - miss),
    approx = Math.min(
      100,
      input.cleanOutCount * (input.cardsToCome === 2 ? 4 : 2),
    );
  return {
    ruleOfTwoOrFourApproxPercent: approx,
    exactAtLeastOneCleanOutPercent: exact,
    signedApproximationErrorPercentagePoints: approx - exact,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cleanOutCount: 9,
  unseenCardCount: 47,
  cardsToCome: 2,
} satisfies Input;
export const exampleOutput = {
  ruleOfTwoOrFourApproxPercent: 36,
  exactAtLeastOneCleanOutPercent: 34.96762257169288,
  signedApproximationErrorPercentagePoints: 1.0323774283071216,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/poker-outs-rule-of-2-and-4",
  title: "Poker Outs Rule of 2 and 4",
  description:
    "Compare 2/4 outs approximation with exact without-replacement at-least-one clean-out probability for one/two cards; caller clean outs may not guarantee winning and overlap/dirty outs are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "ruleOfTwoOrFourApproxPercent",
      label: "Rule of two or four approx percent",
      kind: "number",
    },
    {
      id: "exactAtLeastOneCleanOutPercent",
      label: "Exact at least one clean out percent",
      kind: "number",
    },
    {
      id: "signedApproximationErrorPercentagePoints",
      label: "Signed approximation error percentage points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cleanOutCount: value.cleanOutCount as number,
      unseenCardCount: value.unseenCardCount as number,
      cardsToCome: value.cardsToCome as number,
    }),
});
export const run = tool.execute;
export default tool;
