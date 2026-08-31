import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, poker } from "../shared.js";
export type Input = Readonly<{ readonly fiveCardHand: readonly string[] }>;
export type Output = Readonly<{
  readonly handCategory: string;
  readonly categoryRank: number;
  readonly tieBreakRanks: readonly number[];
}>;
const inputFields = [
  { id: "fiveCardHand", label: "Five card hand", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = poker(input.fiveCardHand);
  return {
    handCategory: p.category,
    categoryRank: p.rank,
    tieBreakRanks: p.tieBreakRanks,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fiveCardHand: ["AS", "2S", "3S", "4S", "5S"],
} satisfies Input;
export const exampleOutput = {
  handCategory: "straight-flush",
  categoryRank: 8,
  tieBreakRanks: [5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/poker-hand-rank-classifier",
  title: "Poker Hand Rank Classifier",
  description:
    "Classify exactly five distinct standard-deck cards and lexicographic tie-break ranks, including wheel ace-low straight; no wild cards or seven-card best-hand inference.",
  inputs: inputFields,
  outputs: [
    { id: "handCategory", label: "Hand category", kind: "string" },
    { id: "categoryRank", label: "Category rank", kind: "number" },
    { id: "tieBreakRanks", label: "Tie break ranks", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({ fiveCardHand: value.fiveCardHand as readonly string[] }),
});
export const run = tool.execute;
export default tool;
