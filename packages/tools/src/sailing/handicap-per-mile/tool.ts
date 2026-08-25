import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HandicapPerMileInput = {
  readonly opponentRatingSecondsPerMile: number;
  readonly yourRatingSecondsPerMile: number;
};

export type HandicapPerMileOutput = {
  readonly allowanceSecondsPerMile: number;
};

export const handicapPerMileExample = {
  input: { opponentRatingSecondsPerMile: 605, yourRatingSecondsPerMile: 630 },
  output: { allowanceSecondsPerMile: 25 },
} satisfies ToolExample<HandicapPerMileInput, HandicapPerMileOutput>;

export const calculateHandicapPerMile = (
  input: HandicapPerMileInput,
): HandicapPerMileOutput => {
  return {
    allowanceSecondsPerMile:
      input.yourRatingSecondsPerMile - input.opponentRatingSecondsPerMile,
  };
};

export const handicapPerMileTool = createSimpleTool({
  calculate: (input) =>
    calculateHandicapPerMile(input as unknown as HandicapPerMileInput),
  description:
    "Compute the signed per-mile handicap allowance as your rating in seconds per mile minus the opponent rating in seconds per mile.",
  id: "sailing/handicap-per-mile",
  inputs: [
    {
      description:
        "Opponent rating in seconds per mile; positive means you owe this many seconds per mile.",
      format: "rating-s-per-nm",
      id: "opponentRatingSecondsPerMile",
      kind: "number",
      label: "Opponent rating",
      minimum: 0,
      unit: "s/mile",
    },
    {
      description: "Your rating in seconds per mile.",
      format: "rating-s-per-nm",
      id: "yourRatingSecondsPerMile",
      kind: "number",
      label: "Your rating",
      minimum: 0,
      unit: "s/mile",
    },
  ],
  outputs: [
    {
      description:
        "Signed seconds per mile you give or receive; negative means you are owed time.",
      format: "duration-s",
      id: "allowanceSecondsPerMile",
      kind: "number",
      label: "Allowance per mile",
      unit: "s/mile",
    },
  ],
  title: "Handicap Allowance Calculator",
});
export const runHandicapPerMile = handicapPerMileTool.execute;
export default handicapPerMileTool;
