import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WhippleAgeHeapingIndexInput = {
  readonly populationBySingleAge: readonly number[];
  readonly startAge?: number;
  readonly minimumAge?: number;
  readonly maximumAge?: number;
};

export type WhippleAgeHeapingIndexOutput = {
  readonly whippleIndex: number;
  readonly endingZeroFiveSharePercent: number;
  readonly qualityRating:
    | "very_accurate"
    | "relatively_accurate"
    | "approximate"
    | "rough"
    | "very_rough";
};

export const calculateWhippleAgeHeapingIndex = (
  input: WhippleAgeHeapingIndexInput,
): WhippleAgeHeapingIndexOutput => {
  const counts = input.populationBySingleAge;
  const startAge = input.startAge ?? 23;
  const minimumAge = input.minimumAge ?? 23;
  const maximumAge = input.maximumAge ?? 62;
  if (counts.length < 1)
    return simpleError(
      "populationBySingleAge",
      "Provide at least one single-age count.",
      "invalid_list",
    );
  if (!(Number.isSafeInteger(startAge) && startAge >= 0))
    return simpleError(
      "startAge",
      "The starting age must be a non-negative integer.",
      "invalid_age",
    );
  if (!(
    Number.isSafeInteger(minimumAge) &&
    Number.isSafeInteger(maximumAge) &&
    minimumAge > 0
  ))
    return simpleError(
      "minimumAge",
      "The evaluation window bounds must be non-negative integers.",
      "invalid_age",
    );
  if (!(minimumAge < maximumAge))
    return simpleError(
      "minimumAge",
      "The window minimum must be below its maximum.",
      "invalid_age",
    );
  for (const count of counts)
    if (!(count >= 0))
      return simpleError(
        "populationBySingleAge",
        "Population counts must be non-negative.",
        "invalid_list",
      );
  const endAge = startAge + counts.length - 1;
  if (startAge > minimumAge || endAge < maximumAge)
    return simpleError(
      "populationBySingleAge",
      "The list must cover every single age of the evaluation window.",
      "invalid_list",
    );
  let heaped = 0;
  let total = 0;
  for (let age = minimumAge; age <= maximumAge; age += 1) {
    const count = counts[age - startAge] as number;
    total += count;
    if (age % 5 === 0) heaped += count;
  }
  if (!(total > 0))
    return simpleError(
      "populationBySingleAge",
      `The population aged ${minimumAge}-${maximumAge} must be positive.`,
      "invalid_list",
    );
  const endingZeroFiveSharePercent = (100 * heaped) / total;
  const whippleIndex = 5 * endingZeroFiveSharePercent;
  const qualityRating =
    whippleIndex < 105
      ? "very_accurate"
      : whippleIndex < 110
        ? "relatively_accurate"
        : whippleIndex < 125
          ? "approximate"
          : whippleIndex < 175
            ? "rough"
            : "very_rough";
  return { whippleIndex, endingZeroFiveSharePercent, qualityRating };
};

export const whippleAgeHeapingIndexExample = {
  input: {
    populationBySingleAge: [
      96, 96, 128, 96, 96, 96, 96, 128, 96, 96, 96, 96, 128, 96, 96, 96, 96,
      128, 96, 96, 96, 96, 128, 96, 96, 96, 96, 128, 96, 96, 96, 96, 128, 96,
      96, 96, 96, 128, 96, 96,
    ],
    startAge: 23,
  },
  output: {
    whippleIndex: 125,
    endingZeroFiveSharePercent: 25,
    qualityRating: "rough",
  },
} satisfies ToolExample<
  WhippleAgeHeapingIndexInput,
  WhippleAgeHeapingIndexOutput
>;

export const whippleAgeHeapingIndexTool = createSimpleTool({
  id: "demography/whipple-age-heaping-index",
  title: "Whipple Age Heaping Index Calculator",
  description:
    "Compute the classic Whipple index of age heaping over ages 23-62, reporting both the five-fold-scaled index and the raw share of reported ages ending in 0 or 5, with UN quality bands. A custom inclusive evaluation window may also be supplied.",
  inputs: [
    {
      description:
        "Population at each single year of age beginning with the starting age; the list must cover the whole evaluation window.",
      id: "populationBySingleAge",
      kind: "numberList",
      label: "By single age",
    },
    {
      default: 23,
      description: "Age of the first entry in the list.",
      id: "startAge",
      kind: "integer",
      label: "Start age",
      minimum: 0,
    },
    {
      default: 23,
      description:
        "Inclusive lower bound of the evaluation window; 23 is the classic Whipple convention.",
      id: "minimumAge",
      kind: "integer",
      label: "Window start",
      minimum: 0,
    },
    {
      default: 62,
      description:
        "Inclusive upper bound of the evaluation window; 62 gives the classic forty-year evaluation span.",
      id: "maximumAge",
      kind: "integer",
      label: "Window end",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Classic UN-scaled Whipple index; 100 means no heaping and 500 means all ages end in 0 or 5.",
      id: "whippleIndex",
      kind: "number",
      label: "Whipple",
    },
    {
      description:
        "Raw percentage of the evaluated population reporting ages ending in 0 or 5.",
      id: "endingZeroFiveSharePercent",
      kind: "number",
      label: "0/5 share %",
    },
    {
      description:
        "UN data-quality band from the index thresholds 105/110/125/175.",
      enum: [
        "very_accurate",
        "relatively_accurate",
        "approximate",
        "rough",
        "very_rough",
      ],
      id: "qualityRating",
      kind: "string",
      label: "Quality",
    },
  ],
  calculate: (input) =>
    calculateWhippleAgeHeapingIndex(
      input as unknown as WhippleAgeHeapingIndexInput,
    ),
});

export const runWhippleAgeHeapingIndex = whippleAgeHeapingIndexTool.execute;
export default whippleAgeHeapingIndexTool;
