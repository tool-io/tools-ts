import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const categoryOrder = [
  "innovators",
  "earlyAdopters",
  "earlyMajority",
  "lateMajority",
  "laggards",
] as const;
const defaultCutoffs = [2.5, 13.5, 34, 68, 100] as const;

export type RogersSplitInput = {
  readonly cumulativeCategoryCutoffsPercent: ReadonlyArray<number>;
};

export type RogersSplitOutput = {
  readonly categorySharesPercent: ReadonlyArray<number>;
  readonly cumulativeCategoryCutoffsPercent: ReadonlyArray<number>;
  readonly innovatorsPercent: number;
  readonly earlyAdoptersPercent: number;
  readonly earlyMajorityPercent: number;
  readonly lateMajorityPercent: number;
  readonly laggardsPercent: number;
};

export const splitRogersAdopterCategories = (
  input: RogersSplitInput,
): RogersSplitOutput => {
  if (
    !Array.isArray(input.cumulativeCategoryCutoffsPercent) ||
    input.cumulativeCategoryCutoffsPercent.length !== categoryOrder.length
  )
    simpleError(
      "cumulativeCategoryCutoffsPercent",
      "Exactly five cumulative category cutoffs are required.",
      "category_cutoffs_required",
    );
  let previousCutoff = 0;
  const categorySharesPercent: number[] = [];
  for (const [
    index,
    cutoff,
  ] of input.cumulativeCategoryCutoffsPercent.entries()) {
    if (
      !Number.isFinite(cutoff) ||
      cutoff < 0 ||
      cutoff > 100 ||
      cutoff < previousCutoff
    )
      simpleError(
        `cumulativeCategoryCutoffs.${index}`,
        "Cumulative cutoffs must be nondecreasing values from 0 through 100.",
        "invalid_category_cutoff",
      );
    categorySharesPercent.push(cutoff - previousCutoff);
    previousCutoff = cutoff;
  }
  if (previousCutoff !== 100)
    simpleError(
      "cumulativeCategoryCutoffsPercent",
      "The final cumulative category cutoff must be 100.",
      "final_category_cutoff_required",
    );
  return {
    categorySharesPercent,
    cumulativeCategoryCutoffsPercent: [
      ...input.cumulativeCategoryCutoffsPercent,
    ],
    innovatorsPercent: categorySharesPercent[0]!,
    earlyAdoptersPercent: categorySharesPercent[1]!,
    earlyMajorityPercent: categorySharesPercent[2]!,
    lateMajorityPercent: categorySharesPercent[3]!,
    laggardsPercent: categorySharesPercent[4]!,
  };
};

export const rogersSplitExample = {
  input: { cumulativeCategoryCutoffsPercent: [...defaultCutoffs] },
  output: {
    categorySharesPercent: [2.5, 11, 20.5, 34, 32],
    cumulativeCategoryCutoffsPercent: [2.5, 13.5, 34, 68, 100],
    innovatorsPercent: 2.5,
    earlyAdoptersPercent: 11,
    earlyMajorityPercent: 20.5,
    lateMajorityPercent: 34,
    laggardsPercent: 32,
  },
} satisfies ToolExample<RogersSplitInput, RogersSplitOutput>;

export const rogersSplitTool = createSimpleTool({
  calculate: (input) =>
    splitRogersAdopterCategories({
      cumulativeCategoryCutoffsPercent:
        input.cumulativeCategoryCutoffsPercent as number[],
    }),
  description:
    "Convert five cumulative adopter-category cutoffs into category shares, defaulting to a common diffusion split.",
  id: "futurology/rogers-diffusion-adopter-categories-percent-split",
  inputs: [
    {
      default: [...defaultCutoffs],
      description: "Exactly five cumulative cutoffs ending at 100.",
      id: "cumulativeCategoryCutoffsPercent",
      kind: "numberList",
      label: "Cumulative category cutoffs percent",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "categorySharesPercent",
      kind: "numberList",
      label: "Category shares percent",
      unit: "%",
    },
    {
      id: "cumulativeCategoryCutoffsPercent",
      kind: "numberList",
      label: "Cumulative category cutoffs percent",
      unit: "%",
    },
    {
      id: "innovatorsPercent",
      kind: "number",
      label: "Innovators percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "earlyAdoptersPercent",
      kind: "number",
      label: "Early adopters percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "earlyMajorityPercent",
      kind: "number",
      label: "Early majority percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "lateMajorityPercent",
      kind: "number",
      label: "Late majority percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "laggardsPercent",
      kind: "number",
      label: "Laggards percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Rogers Diffusion Adopter Categories Percent Split",
});

export const runRogersSplit = rogersSplitTool.execute;
export default rogersSplitTool;
