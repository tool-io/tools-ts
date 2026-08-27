import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RockMassRatingRmrInput = {
  readonly uniaxialStrengthRating: number;
  readonly rockQualityRating: number;
  readonly jointSpacingRating: number;
  readonly groundwaterRating: number;
  readonly jointConditionRating: number;
};

export type RockMassRatingRmrOutput = {
  readonly rmrTotal: number;
  readonly rockMassClass: string;
};

const MAX_RATING = {
  groundwaterRating: 15,
  jointConditionRating: 30,
  jointSpacingRating: 20,
  rockQualityRating: 20,
  uniaxialStrengthRating: 15,
} as const;

export const calculateRockMassRatingRmr = (
  input: RockMassRatingRmrInput,
): RockMassRatingRmrOutput => {
  for (const [field, maximum] of Object.entries(MAX_RATING)) {
    const value = input[field as keyof RockMassRatingRmrInput];
    if (!(value >= 0 && value <= maximum))
      simpleError(
        field,
        `Rating must be between 0 and ${maximum}.`,
        "invalid_rating",
      );
  }
  const rmrTotal =
    input.uniaxialStrengthRating +
    input.rockQualityRating +
    input.jointSpacingRating +
    input.groundwaterRating +
    input.jointConditionRating;
  const rockMassClass =
    rmrTotal <= 20
      ? "very poor (I)"
      : rmrTotal <= 40
        ? "poor (II)"
        : rmrTotal <= 60
          ? "fair (III)"
          : rmrTotal <= 80
            ? "good (IV)"
            : "very good (V)";
  return { rmrTotal, rockMassClass };
};

export const rockMassRatingRmrExample = {
  input: {
    uniaxialStrengthRating: 7,
    rockQualityRating: 17,
    jointSpacingRating: 13,
    groundwaterRating: 10,
    jointConditionRating: 20,
  },
  output: { rmrTotal: 67, rockMassClass: "good (IV)" },
} satisfies ToolExample<RockMassRatingRmrInput, RockMassRatingRmrOutput>;

export const rockMassRatingRmrTool = createSimpleTool({
  id: "geology/rock-mass-rating-rmr",
  title: "Rock Mass Rating RMR Calculator",
  description:
    "Bieniawski RMR total from the five sub-ratings (strength max 15, RQD max 20, spacing max 20, groundwater max 15, joint condition max 30) with the standard RMR class boundaries.",
  inputs: [
    {
      description: "Sub-rating for intact rock strength (0-15).",
      id: "uniaxialStrengthRating",
      kind: "integer",
      label: "R1 strength",
      maximum: 15,
      minimum: 0,
    },
    {
      description: "Sub-rating for RQD (0-20).",
      id: "rockQualityRating",
      kind: "integer",
      label: "R2 RQD",
      maximum: 20,
      minimum: 0,
    },
    {
      description: "Sub-rating for joint spacing (0-20).",
      id: "jointSpacingRating",
      kind: "integer",
      label: "R3 spacing",
      maximum: 20,
      minimum: 0,
    },
    {
      description: "Sub-rating for groundwater conditions (0-15).",
      id: "groundwaterRating",
      kind: "integer",
      label: "R4 water",
      maximum: 15,
      minimum: 0,
    },
    {
      description: "Sub-rating for joint condition (0-30).",
      id: "jointConditionRating",
      kind: "integer",
      label: "R5 joints",
      maximum: 30,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total RMR rating between 0 and 100.",
      id: "rmrTotal",
      kind: "number",
      label: "RMR",
    },
    {
      description: "Rock mass class name and roman numeral.",
      id: "rockMassClass",
      kind: "string",
      label: "Class",
    },
  ],
  calculate: (input) =>
    calculateRockMassRatingRmr(input as unknown as RockMassRatingRmrInput),
});

export const runRockMassRatingRmr = rockMassRatingRmrTool.execute;
export default rockMassRatingRmrTool;
