import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, feedback } from "../shared.js";
export type Input = Readonly<{
  readonly secretCode: readonly number[];
  readonly guessedCode: readonly number[];
  readonly symbolCount: number;
}>;
export type Output = Readonly<{
  readonly blackExactPegs: number;
  readonly whiteMisplacedPegs: number;
  readonly perPositionFeedback: readonly number[];
}>;
const inputFields = [
  { id: "secretCode", label: "Secret code", kind: "numberList" },
  { id: "guessedCode", label: "Guessed code", kind: "numberList" },
  { id: "symbolCount", label: "Symbol count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.symbolCount, "symbols", 1, 100);
  [...input.secretCode, ...input.guessedCode].forEach((v) =>
    bounded(v, "symbol", 0, input.symbolCount - 1),
  );
  const f = feedback(input.secretCode, input.guessedCode);
  return {
    blackExactPegs: f.filter((v) => v === 2).length,
    whiteMisplacedPegs: f.filter((v) => v === 1).length,
    perPositionFeedback: f,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  secretCode: [1, 1, 2, 3],
  guessedCode: [1, 2, 1, 1],
  symbolCount: 6,
} satisfies Input;
export const exampleOutput = {
  blackExactPegs: 1,
  whiteMisplacedPegs: 2,
  perPositionFeedback: [2, 1, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/mastermind-black-white-peg-feedback-calculator",
  title: "Mastermind Black/White Peg Feedback",
  description:
    "Resolve Mastermind duplicate symbols with exact matches reserved before multiset misplaced matches; output per-position allocation uses left-to-right convention, not excess repeated guesses.",
  inputs: inputFields,
  outputs: [
    { id: "blackExactPegs", label: "Black exact pegs", kind: "number" },
    { id: "whiteMisplacedPegs", label: "White misplaced pegs", kind: "number" },
    {
      id: "perPositionFeedback",
      label: "Per position feedback",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      secretCode: value.secretCode as readonly number[],
      guessedCode: value.guessedCode as readonly number[],
      symbolCount: value.symbolCount as number,
    }),
});
export const run = tool.execute;
export default tool;
