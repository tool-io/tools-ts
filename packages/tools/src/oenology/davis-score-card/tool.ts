import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DavisScoreCardInput = {
  readonly aromaBouquet: number;
  readonly astringency: number;
  readonly body: number;
  readonly color: number;
  readonly flavor: number;
  readonly generalQuality: number;
  readonly appearance: number;
  readonly sugar: number;
  readonly totalAcid: number;
  readonly volatileAcidity: number;
};

export type DavisScoreCardOutput = {
  readonly recommendation: string;
  readonly totalPoints: number;
};

const MAX_POINTS = {
  appearance: 2,
  color: 2,
  aromaBouquet: 4,
  volatileAcidity: 2,
  totalAcid: 2,
  sugar: 1,
  body: 1,
  flavor: 2,
  astringency: 2,
  generalQuality: 2,
} as const;

const CATEGORY_KEYS = Object.keys(MAX_POINTS) as (keyof typeof MAX_POINTS)[];

export const davisScoreCardExample = {
  input: {
    appearance: 2,
    aromaBouquet: 3,
    astringency: 2,
    body: 1,
    color: 2,
    flavor: 1,
    generalQuality: 2,
    sugar: 1,
    totalAcid: 1,
    volatileAcidity: 2,
  },
  output: {
    recommendation: "superior",
    totalPoints: 17,
  },
} satisfies ToolExample<DavisScoreCardInput, DavisScoreCardOutput>;

export const calculateDavisScoreCard = (
  input: DavisScoreCardInput,
): DavisScoreCardOutput => {
  let total = 0;
  for (const key of CATEGORY_KEYS) {
    const score = input[key];
    if (score < 0 || score > MAX_POINTS[key])
      simpleError(
        key,
        `Scores must sit between zero and ${MAX_POINTS[key]} for ${key}.`,
        "invalid_score",
      );
    total += score;
  }
  return {
    recommendation:
      total >= 17
        ? "superior"
        : total >= 13
          ? "standard"
          : total >= 9
            ? "below_standard"
            : "unacceptable",
    totalPoints: total,
  };
};

export const davisScoreCardTool = createSimpleTool({
  calculate: (input) =>
    calculateDavisScoreCard(input as unknown as DavisScoreCardInput),
  description:
    "Total the ten categories of the 20-point UC Davis wine scorecard and map the result to the commonly used superior, standard, below-standard, or unacceptable bands.",
  id: "oenology/davis-score-card",
  inputs: [
    {
      description: "Clarity and brilliance.",
      id: "appearance",
      kind: "number",
      label: "Appearance",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Typicality and depth of color.",
      id: "color",
      kind: "number",
      label: "Color",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Aroma and bouquet intensity.",
      id: "aromaBouquet",
      kind: "number",
      label: "Aroma and bouquet",
      maximum: 4,
      minimum: 0,
    },
    {
      description: "Freedom from vinegar taint.",
      id: "volatileAcidity",
      kind: "number",
      label: "Volatile acidity",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Balance of acidity.",
      id: "totalAcid",
      kind: "number",
      label: "Total acid",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Balance of sweetness or dryness.",
      id: "sugar",
      kind: "number",
      label: "Sugar",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Weight in the mouth.",
      id: "body",
      kind: "number",
      label: "Body",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Varietal character on the palate.",
      id: "flavor",
      kind: "number",
      label: "Flavor",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Tannin grip appropriateness.",
      id: "astringency",
      kind: "number",
      label: "Astringency",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Overall harmony of the wine.",
      id: "generalQuality",
      kind: "number",
      label: "General quality",
      maximum: 2,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Sum of the ten categories out of twenty.",
      id: "totalPoints",
      kind: "number",
      label: "Total points",
    },
    {
      description:
        "One of superior, standard, below_standard, or unacceptable.",
      id: "recommendation",
      kind: "string",
      label: "Recommendation",
    },
  ],
  title: "Davis Score Card Tasting Points Calculator",
});
export const runDavisScoreCard = davisScoreCardTool.execute;
export default davisScoreCardTool;
