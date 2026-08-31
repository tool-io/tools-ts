import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly runningCount: number;
  readonly estimatedDecksRemaining: number;
}>;
export type Output = Readonly<{
  readonly unroundedTrueCount: number;
  readonly estimatedCardsRemaining: number;
}>;
const inputFields = [
  { id: "runningCount", label: "Running count", kind: "number" },
  {
    id: "estimatedDecksRemaining",
    label: "Estimated decks remaining",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.estimatedDecksRemaining, "estimatedDecksRemaining");
  if (
    !Number.isSafeInteger(input.runningCount) ||
    Math.abs(input.runningCount) > 1000000 ||
    input.estimatedDecksRemaining > 1000
  )
    simpleError(
      "count",
      "Bounded signed integer count and actual positive deck estimate required.",
    );
  return {
    unroundedTrueCount: input.runningCount / input.estimatedDecksRemaining,
    estimatedCardsRemaining: 52 * input.estimatedDecksRemaining,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  runningCount: -3,
  estimatedDecksRemaining: 1.5,
} satisfies Input;
export const exampleOutput = {
  unroundedTrueCount: -2,
  estimatedCardsRemaining: 78,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/blackjack-true-count-divide-decks",
  title: "True Count Decks Division",
  description:
    "Normalize signed Hi-Lo running count by explicit positive fractional remaining-deck estimate, without hidden truncation/floor convention or strategy inference.",
  inputs: inputFields,
  outputs: [
    { id: "unroundedTrueCount", label: "Unrounded true count", kind: "number" },
    {
      id: "estimatedCardsRemaining",
      label: "Estimated cards remaining",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      runningCount: value.runningCount as number,
      estimatedDecksRemaining: value.estimatedDecksRemaining as number,
    }),
});
export const run = tool.execute;
export default tool;
