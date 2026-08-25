import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AgeWorthinessScoreInput = {
  readonly acidityScore: number;
  readonly bodyScore: number;
  readonly tanninScore: number;
};

export type AgeWorthinessScoreOutput = {
  readonly ageWorthinessScore: number;
};

export const ageWorthinessScoreExample = {
  input: {
    acidityScore: 7,
    bodyScore: 9,
    tanninScore: 8,
  },
  output: {
    ageWorthinessScore: 8,
  },
} satisfies ToolExample<AgeWorthinessScoreInput, AgeWorthinessScoreOutput>;

const SCORE_MAX = 10;

export const calculateAgeWorthinessScore = (
  input: AgeWorthinessScoreInput,
): AgeWorthinessScoreOutput => {
  for (const [key, value] of Object.entries(input)) {
    if (value < 0 || value > SCORE_MAX)
      simpleError(
        key as keyof AgeWorthinessScoreInput,
        `Scores must sit between zero and ${SCORE_MAX}.`,
        "invalid_score",
      );
  }
  return {
    ageWorthinessScore: roundStatistic(
      (input.tanninScore + input.acidityScore + input.bodyScore) / 3,
    ),
  };
};

export const ageWorthinessScoreTool = createSimpleTool({
  calculate: (input) =>
    calculateAgeWorthinessScore(input as unknown as AgeWorthinessScoreInput),
  description:
    "Average three user-assigned zero-to-ten ratings for acidity, body, and tannin into a structural aging score; it does not predict development, faults, closure performance, or drinking window.",
  id: "oenology/age-worthiness-score",
  inputs: [
    {
      description: "Acidity contribution on a ten point scale.",
      id: "acidityScore",
      kind: "number",
      label: "Acidity",
      maximum: 10,
      minimum: 0,
    },
    {
      description: "Body or extract contribution.",
      id: "bodyScore",
      kind: "number",
      label: "Body",
      maximum: 10,
      minimum: 0,
    },
    {
      description: "Tannin or phenolic contribution.",
      id: "tanninScore",
      kind: "number",
      label: "Tannin",
      maximum: 10,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Mean of the three structural scores.",
      id: "ageWorthinessScore",
      kind: "number",
      label: "Age worthiness",
    },
  ],
  title: "Wine Structural Age-Worthiness Score Calculator",
});
export const runAgeWorthinessScore = ageWorthinessScoreTool.execute;
export default ageWorthinessScoreTool;
