import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const categories = [
  "innovators",
  "earlyAdopters",
  "earlyMajority",
  "lateMajority",
  "laggards",
] as const;

export type SCurveAdoptionInput = {
  readonly categoryCutoffsPercent: ReadonlyArray<number>;
  readonly cumulativeAdoptionPercent: number;
};

export type SCurveAdoptionOutput = {
  readonly category: (typeof categories)[number];
  readonly categoryIndex: number;
  readonly nextCutoffPercent: number;
};

export const mapSCurveAdoptionPhase = (
  input: SCurveAdoptionInput,
): SCurveAdoptionOutput => {
  if (
    !Number.isFinite(input.cumulativeAdoptionPercent) ||
    input.cumulativeAdoptionPercent < 0 ||
    input.cumulativeAdoptionPercent > 100
  )
    simpleError(
      "cumulativeAdoptionPercent",
      "Cumulative adoption must be a value from 0 through 100.",
      "adoption_out_of_range",
    );
  if (
    !Array.isArray(input.categoryCutoffsPercent) ||
    input.categoryCutoffsPercent.length !== categories.length
  )
    simpleError(
      "categoryCutoffsPercent",
      "Exactly five category cutoffs are required.",
      "category_cutoffs_required",
    );
  let previousCutoff = 0;
  for (const [index, cutoff] of input.categoryCutoffsPercent.entries()) {
    if (
      !Number.isFinite(cutoff) ||
      cutoff < 0 ||
      cutoff > 100 ||
      cutoff < previousCutoff
    )
      simpleError(
        `categoryCutoffsPercent.${index}`,
        "Category cutoffs must be nondecreasing values from 0 through 100.",
        "invalid_category_cutoff",
      );
    previousCutoff = cutoff;
  }
  if (input.categoryCutoffsPercent[4] !== 100)
    simpleError(
      "categoryCutoffsPercent",
      "The final category cutoff must be 100.",
      "final_category_cutoff_required",
    );
  const categoryIndex = input.categoryCutoffsPercent.findIndex(
    (cutoff) => input.cumulativeAdoptionPercent <= cutoff,
  );
  if (categoryIndex === -1)
    simpleError(
      "cumulativeAdoptionPercent",
      "The final category cutoff must be 100.",
      "final_category_cutoff_required",
    );
  return {
    category: categories[categoryIndex]!,
    categoryIndex,
    nextCutoffPercent: input.categoryCutoffsPercent[categoryIndex]!,
  };
};

export const sCurveAdoptionExample = {
  input: {
    categoryCutoffsPercent: [2.5, 13.5, 34, 68, 100],
    cumulativeAdoptionPercent: 10,
  },
  output: {
    category: "earlyAdopters",
    categoryIndex: 1,
    nextCutoffPercent: 13.5,
  },
} satisfies ToolExample<SCurveAdoptionInput, SCurveAdoptionOutput>;

export const sCurveAdoptionTool = createSimpleTool({
  calculate: (input) =>
    mapSCurveAdoptionPhase({
      categoryCutoffsPercent: input.categoryCutoffsPercent as number[],
      cumulativeAdoptionPercent: input.cumulativeAdoptionPercent as number,
    }),
  description:
    "Map cumulative adoption to an adopter phase using five caller-supplied, nondecreasing category cutoffs.",
  id: "futurology/s-curve-adoption-phase-innovators-laggards-mapper",
  inputs: [
    {
      description:
        "Exactly five upper cumulative-adoption cutoffs ending at 100.",
      id: "categoryCutoffsPercent",
      kind: "numberList",
      label: "Category cutoffs percent",
      unit: "%",
    },
    {
      id: "cumulativeAdoptionPercent",
      kind: "number",
      label: "Cumulative adoption percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      enum: [...categories],
      id: "category",
      kind: "string",
      label: "Adopter category",
    },
    {
      id: "categoryIndex",
      kind: "integer",
      label: "Category index",
      maximum: 4,
      minimum: 0,
    },
    {
      id: "nextCutoffPercent",
      kind: "number",
      label: "Next cutoff percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  title: "S Curve Adoption Phase Innovators Laggards Mapper",
});

export const runSCurveAdoption = sCurveAdoptionTool.execute;
export default sCurveAdoptionTool;
