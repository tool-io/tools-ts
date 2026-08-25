import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BlindTastingVarietalScorerInput = {
  readonly flightSize: number;
  readonly partialCreditPoints?: number;
  readonly pointsPerCorrect: number;
  readonly varietalsCorrect: number;
};

export type BlindTastingVarietalScorerOutput = {
  readonly score: number;
  readonly scorePercent: number;
};

export const blindTastingVarietalScorerExample = {
  input: {
    flightSize: 10,
    partialCreditPoints: 0,
    pointsPerCorrect: 10,
    varietalsCorrect: 6,
  },
  output: {
    score: 60,
    scorePercent: 60,
  },
} satisfies ToolExample<
  BlindTastingVarietalScorerInput,
  BlindTastingVarietalScorerOutput
>;

export const calculateBlindTastingVarietalScore = (
  input: BlindTastingVarietalScorerInput,
): BlindTastingVarietalScorerOutput => {
  if (input.pointsPerCorrect <= 0)
    simpleError(
      "pointsPerCorrect",
      "Points per correct call must be positive.",
      "invalid_value",
    );
  if (input.varietalsCorrect > input.flightSize)
    simpleError(
      "varietalsCorrect",
      "Correct calls cannot exceed the number of wines poured.",
      "invalid_value",
    );
  const score =
    input.varietalsCorrect * input.pointsPerCorrect +
    (input.partialCreditPoints ?? 0);
  const maximumScore = input.flightSize * input.pointsPerCorrect;
  if (score > maximumScore)
    simpleError(
      "partialCreditPoints",
      "Exact and partial credit cannot exceed the flight's maximum score.",
      "invalid_value",
    );
  return {
    score: roundStatistic(score),
    scorePercent: roundStatistic((score / maximumScore) * 100),
  };
};

export const blindTastingVarietalScorerTool = createSimpleTool({
  calculate: (input) =>
    calculateBlindTastingVarietalScore(
      input as unknown as BlindTastingVarietalScorerInput,
    ),
  description:
    "Score exact varietal calls and aggregate partial credit against a caller-defined number of points per wine, then report both total points and percentage of the possible score.",
  id: "oenology/blind-tasting-varietal-scorer",
  inputs: [
    {
      description: "Maximum points awarded for one exact varietal call.",
      id: "pointsPerCorrect",
      kind: "number",
      label: "Points per correct call",
      minimum: 0.000001,
    },
    {
      description: "Wines poured in the flight.",
      id: "flightSize",
      kind: "integer",
      label: "Flight size",
      maximum: 100,
      minimum: 1,
    },
    {
      default: 0,
      description:
        "Bonus points awarded for near-miss calls such as the right family.",
      id: "partialCreditPoints",
      kind: "number",
      label: "Partial credit",
      minimum: 0,
    },
    {
      description: "Flights where the variety was named exactly.",
      id: "varietalsCorrect",
      kind: "integer",
      label: "Correct calls",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Points for exact calls plus aggregate partial credit.",
      id: "score",
      kind: "number",
      label: "Score",
    },
    {
      description: "Total score as a share of all available points.",
      id: "scorePercent",
      kind: "number",
      label: "Score percent",
      unit: "%",
    },
  ],
  title: "Blind Tasting Varietal Call Scorer",
});
export const runBlindTastingVarietalScorer =
  blindTastingVarietalScorerTool.execute;
export default blindTastingVarietalScorerTool;
