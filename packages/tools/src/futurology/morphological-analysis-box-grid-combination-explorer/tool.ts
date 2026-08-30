import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MorphologicalCombinationInput = {
  readonly dimensionLabels: ReadonlyArray<string>;
  readonly maximumCombinations: number;
  readonly optionCounts: ReadonlyArray<number>;
};

export type MorphologicalCombinationOutput = {
  readonly dimensionCount: number;
  readonly totalCombinations: number;
};

export const countMorphologicalCombinations = (
  input: MorphologicalCombinationInput,
): MorphologicalCombinationOutput => {
  if (
    !Array.isArray(input.dimensionLabels) ||
    !Array.isArray(input.optionCounts)
  )
    simpleError(
      "",
      "Dimension labels and option counts must be arrays.",
      "dimension_data_required",
    );
  if (
    input.dimensionLabels.length === 0 ||
    input.dimensionLabels.length !== input.optionCounts.length
  )
    simpleError(
      "optionCounts",
      "Each nonempty dimension must have one option count.",
      "dimension_data_length_mismatch",
    );
  if (
    !Number.isSafeInteger(input.maximumCombinations) ||
    input.maximumCombinations < 1
  )
    simpleError(
      "maximumCombinations",
      "Maximum combinations must be a positive whole number.",
      "invalid_combination_limit",
    );
  for (const [index, label] of input.dimensionLabels.entries())
    if (typeof label !== "string" || label.trim() === "")
      simpleError(
        `dimensionLabels.${index}`,
        "Dimension labels must be nonempty strings.",
        "invalid_dimension_label",
      );
  let totalCombinations = 1;
  for (const [index, count] of input.optionCounts.entries()) {
    if (!Number.isSafeInteger(count) || count < 1)
      simpleError(
        `optionCounts.${index}`,
        "Option counts must be positive whole numbers.",
        "invalid_option_count",
      );
    totalCombinations *= count;
    if (
      !Number.isSafeInteger(totalCombinations) ||
      totalCombinations > input.maximumCombinations
    )
      simpleError(
        `optionCounts.${index}`,
        `The combination total exceeds the explicit limit of ${input.maximumCombinations}.`,
        "combination_limit_exceeded",
      );
  }
  return { dimensionCount: input.dimensionLabels.length, totalCombinations };
};

export const morphologicalCombinationExample = {
  input: {
    dimensionLabels: ["Energy", "Mobility", "Ownership"],
    maximumCombinations: 100,
    optionCounts: [3, 4, 2],
  },
  output: { dimensionCount: 3, totalCombinations: 24 },
} satisfies ToolExample<
  MorphologicalCombinationInput,
  MorphologicalCombinationOutput
>;

export const morphologicalCombinationTool = createSimpleTool({
  calculate: (input) =>
    countMorphologicalCombinations({
      dimensionLabels: input.dimensionLabels as string[],
      maximumCombinations: input.maximumCombinations as number,
      optionCounts: input.optionCounts as number[],
    }),
  description:
    "Multiply caller-supplied option counts to count morphological-box combinations and reject totals above an explicit safe limit.",
  id: "futurology/morphological-analysis-box-grid-combination-explorer",
  inputs: [
    { id: "dimensionLabels", kind: "stringList", label: "Dimension labels" },
    {
      description: "Explicit maximum combination total accepted by the tool.",
      id: "maximumCombinations",
      kind: "integer",
      label: "Maximum combinations",
      minimum: 1,
    },
    { id: "optionCounts", kind: "numberList", label: "Option counts" },
  ],
  outputs: [
    { id: "dimensionCount", kind: "integer", label: "Dimensions", minimum: 1 },
    {
      id: "totalCombinations",
      kind: "integer",
      label: "Total combinations",
      minimum: 1,
    },
  ],
  title: "Morphological Analysis Box Grid Combination Explorer",
});

export const runMorphologicalCombination = morphologicalCombinationTool.execute;
export default morphologicalCombinationTool;
