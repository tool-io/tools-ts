import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, elo } from "../shared.js";
export type Input = Readonly<{
  readonly playerRating: number;
  readonly opponentRating: number;
  readonly callerRatingScale: number;
}>;
export type Output = Readonly<{
  readonly eloExpectedScore: number;
  readonly opponentExpectedScore: number;
}>;
const inputFields = [
  { id: "playerRating", label: "Player rating", kind: "number" },
  { id: "opponentRating", label: "Opponent rating", kind: "number" },
  { id: "callerRatingScale", label: "Caller rating scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const e = elo(
    input.playerRating,
    input.opponentRating,
    input.callerRatingScale,
  );
  return {
    eloExpectedScore: e,
    opponentExpectedScore: elo(
      input.opponentRating,
      input.playerRating,
      input.callerRatingScale,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  playerRating: 1500,
  opponentRating: 1900,
  callerRatingScale: 400,
} satisfies Input;
export const exampleOutput = {
  eloExpectedScore: 0.09090909090909091,
  opponentExpectedScore: 0.9090909090909091,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/elo-win-probability-expectancy",
  title: "Elo Win Probability Expectancy",
  description:
    "Compute stable complementary logistic Elo expected scores from explicit scale; expected score includes draws, not literal win probability unless the caller model excludes draws.",
  inputs: inputFields,
  outputs: [
    { id: "eloExpectedScore", label: "Elo expected score", kind: "number" },
    {
      id: "opponentExpectedScore",
      label: "Opponent expected score",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      playerRating: value.playerRating as number,
      opponentRating: value.opponentRating as number,
      callerRatingScale: value.callerRatingScale as number,
    }),
});
export const run = tool.execute;
export default tool;
