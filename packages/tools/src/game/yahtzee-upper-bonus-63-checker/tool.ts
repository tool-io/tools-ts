import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, sum, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly upperCategoryScoresOneToSix: readonly number[];
  readonly callerBonusThreshold: number;
  readonly callerBonusPoints: number;
}>;
export type Output = Readonly<{
  readonly upperSectionTotal: number;
  readonly bonusEarned: boolean;
  readonly awardedUpperBonusPoints: number;
  readonly totalUpperIncludingBonus: number;
}>;
const inputFields = [
  {
    id: "upperCategoryScoresOneToSix",
    label: "Upper category scores one to six",
    kind: "numberList",
  },
  {
    id: "callerBonusThreshold",
    label: "Caller bonus threshold",
    kind: "number",
  },
  { id: "callerBonusPoints", label: "Caller bonus points", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.callerBonusThreshold, "callerBonusThreshold");
  count(input.callerBonusPoints, "callerBonusPoints");
  if (input.upperCategoryScoresOneToSix.length !== 6)
    simpleError("scores", "Six upper-category scores required.");
  input.upperCategoryScoresOneToSix.forEach((v, i) => {
    bounded(v, "score", 0, 5 * (i + 1));
    if (v % (i + 1))
      simpleError(
        "score",
        "Each category score must be a whole count of its face.",
      );
  });
  const total = sum(input.upperCategoryScoresOneToSix),
    earned = total >= input.callerBonusThreshold,
    bonus = earned ? input.callerBonusPoints : 0;
  return {
    upperSectionTotal: total,
    bonusEarned: earned,
    awardedUpperBonusPoints: bonus,
    totalUpperIncludingBonus: count(total + bonus, "total"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upperCategoryScoresOneToSix: [3, 6, 9, 12, 15, 18],
  callerBonusThreshold: 63,
  callerBonusPoints: 35,
} satisfies Input;
export const exampleOutput = {
  upperSectionTotal: 63,
  bonusEarned: true,
  awardedUpperBonusPoints: 35,
  totalUpperIncludingBonus: 98,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/yahtzee-upper-bonus-63-checker",
  title: "Yahtzee Upper Bonus 63 Check",
  description:
    "Audit achievable observed Yahtzee upper face-multiple scores against explicit bonus policy, including inclusive threshold; no hidden joker/lower-section scoring.",
  inputs: inputFields,
  outputs: [
    { id: "upperSectionTotal", label: "Upper section total", kind: "number" },
    { id: "bonusEarned", label: "Bonus earned", kind: "boolean" },
    {
      id: "awardedUpperBonusPoints",
      label: "Awarded upper bonus points",
      kind: "number",
    },
    {
      id: "totalUpperIncludingBonus",
      label: "Total upper including bonus",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      upperCategoryScoresOneToSix:
        value.upperCategoryScoresOneToSix as readonly number[],
      callerBonusThreshold: value.callerBonusThreshold as number,
      callerBonusPoints: value.callerBonusPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
