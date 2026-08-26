import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MedianAgeGroupedInterpolationInput = {
  readonly groupBoundaries: readonly number[];
  readonly countsByGroup: readonly number[];
};

export type MedianAgeGroupedInterpolationOutput = {
  readonly medianAge: number;
  readonly totalPopulation: number;
};

export const calculateMedianAgeGroupedInterpolation = (
  input: MedianAgeGroupedInterpolationInput,
): MedianAgeGroupedInterpolationOutput => {
  const boundaries = input.groupBoundaries;
  const counts = input.countsByGroup;
  if (boundaries.length < 2)
    return simpleError(
      "groupBoundaries",
      "Provide at least two group boundaries.",
      "invalid_list",
    );
  if (counts.length !== boundaries.length - 1)
    return simpleError(
      "countsByGroup",
      "Provide exactly one count per age group, one fewer than the boundaries.",
      "invalid_list",
    );
  for (let index = 0; index < boundaries.length; index += 1)
    if (!(
      typeof boundaries[index] === "number" &&
      Number.isFinite(boundaries[index])
    ))
      return simpleError(
        "groupBoundaries",
        "Boundaries must be finite numbers.",
        "invalid_list",
      );
  for (let index = 1; index < boundaries.length; index += 1)
    if (!((boundaries[index] as number) > (boundaries[index - 1] as number)))
      return simpleError(
        "groupBoundaries",
        "Group boundaries must be strictly increasing.",
        "invalid_list",
      );
  let total = 0;
  for (const count of counts) {
    if (!(count >= 0))
      return simpleError(
        "countsByGroup",
        "Group counts must be non-negative.",
        "invalid_list",
      );
    total += count;
  }
  if (!(total > 0))
    return simpleError(
      "countsByGroup",
      "The total population must be positive.",
      "invalid_list",
    );
  const half = total / 2;
  let cumulative = 0;
  let classIndex = -1;
  for (let index = 0; index < counts.length; index += 1) {
    if (
      (counts[index] as number) > 0 &&
      cumulative + (counts[index] as number) >= half
    ) {
      classIndex = index;
      break;
    }
    cumulative += counts[index] as number;
  }
  if (classIndex < 0 || !((counts[classIndex] as number) > 0))
    return simpleError(
      "countsByGroup",
      "No age class brackets the median.",
      "invalid_list",
    );
  const lower = boundaries[classIndex] as number;
  const upper = boundaries[classIndex + 1] as number;
  return {
    medianAge:
      lower +
      ((upper - lower) * (half - cumulative)) / (counts[classIndex] as number),
    totalPopulation: total,
  };
};

export const medianAgeGroupedInterpolationExample = {
  input: {
    groupBoundaries: [0, 15, 30, 45, 60, 75, 90],
    countsByGroup: [20, 35, 25, 10, 6, 4],
  },
  output: { medianAge: 27.857142857142858, totalPopulation: 100 },
} satisfies ToolExample<
  MedianAgeGroupedInterpolationInput,
  MedianAgeGroupedInterpolationOutput
>;

export const medianAgeGroupedInterpolationTool = createSimpleTool({
  id: "demography/median-age-grouped-interpolation",
  title: "Median Age Grouped Interpolation Calculator",
  description:
    "Compute the median age of a grouped age distribution by linear interpolation inside the median class.",
  inputs: [
    {
      description:
        "Strictly increasing lower and upper bounds of every age group (n+1 values).",
      id: "groupBoundaries",
      kind: "numberList",
      label: "Group boundaries",
    },
    {
      description:
        "Population count of each age group, aligned with the boundaries.",
      id: "countsByGroup",
      kind: "numberList",
      label: "Counts",
    },
  ],
  outputs: [
    {
      description: "Median age in years from L + w(N/2 - F)/f.",
      id: "medianAge",
      kind: "number",
      label: "Median age",
    },
    {
      description: "Total population across all groups.",
      id: "totalPopulation",
      kind: "number",
      label: "Total",
    },
  ],
  calculate: (input) =>
    calculateMedianAgeGroupedInterpolation(
      input as unknown as MedianAgeGroupedInterpolationInput,
    ),
});

export const runMedianAgeGroupedInterpolation =
  medianAgeGroupedInterpolationTool.execute;
export default medianAgeGroupedInterpolationTool;
