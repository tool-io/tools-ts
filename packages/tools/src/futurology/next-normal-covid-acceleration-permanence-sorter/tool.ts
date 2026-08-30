import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NextNormalSorterInput = {
  readonly behaviorPersistenceScore: number;
  readonly digitalDependencyScore: number;
  readonly institutionalPersistenceScore: number;
  readonly nextNormalMinimumPercent: number;
  readonly temporaryMaximumPercent: number;
};

export type NextNormalSorterOutput = {
  readonly permanenceScorePercent: number;
  readonly sortedCategory:
    "nextNormal" | "reversibleAcceleration" | "temporaryAcceleration";
  readonly sortingRationale: string;
};

export const sortNextNormalAccelerationPermanence = (
  input: NextNormalSorterInput,
): NextNormalSorterOutput => {
  for (const [field, value] of [
    ["digitalDependencyScore", input.digitalDependencyScore],
    ["behaviorPersistenceScore", input.behaviorPersistenceScore],
    ["institutionalPersistenceScore", input.institutionalPersistenceScore],
    ["temporaryMaximumPercent", input.temporaryMaximumPercent],
    ["nextNormalMinimumPercent", input.nextNormalMinimumPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Permanence values must be finite values from 0 through 100.",
        "permanence_value_out_of_range",
      );
  if (input.nextNormalMinimumPercent <= input.temporaryMaximumPercent)
    simpleError(
      "nextNormalMinimumPercent",
      "The next-normal minimum must be above the temporary maximum.",
      "invalid_permanence_thresholds",
    );
  const permanenceScorePercent =
    (input.digitalDependencyScore +
      input.behaviorPersistenceScore +
      input.institutionalPersistenceScore) /
    3;
  return {
    permanenceScorePercent,
    sortedCategory:
      permanenceScorePercent >= input.nextNormalMinimumPercent
        ? "nextNormal"
        : permanenceScorePercent <= input.temporaryMaximumPercent
          ? "temporaryAcceleration"
          : "reversibleAcceleration",
    sortingRationale:
      "Sort change by the persistence of digital dependency, behavior, and institutions rather than by acceleration alone.",
  };
};

export const nextNormalSorterExample = {
  input: {
    behaviorPersistenceScore: 80,
    digitalDependencyScore: 90,
    institutionalPersistenceScore: 70,
    nextNormalMinimumPercent: 75,
    temporaryMaximumPercent: 50,
  },
  output: {
    permanenceScorePercent: 80,
    sortedCategory: "nextNormal",
    sortingRationale:
      "Sort change by the persistence of digital dependency, behavior, and institutions rather than by acceleration alone.",
  },
} satisfies ToolExample<NextNormalSorterInput, NextNormalSorterOutput>;

export const nextNormalSorterTool = createSimpleTool({
  calculate: (input) =>
    sortNextNormalAccelerationPermanence({
      behaviorPersistenceScore: input.behaviorPersistenceScore as number,
      digitalDependencyScore: input.digitalDependencyScore as number,
      institutionalPersistenceScore:
        input.institutionalPersistenceScore as number,
      nextNormalMinimumPercent: input.nextNormalMinimumPercent as number,
      temporaryMaximumPercent: input.temporaryMaximumPercent as number,
    }),
  description:
    "Sort accelerated change as temporary, reversible, or next-normal using caller-scored digital, behavioral, and institutional persistence.",
  id: "futurology/next-normal-covid-acceleration-permanence-sorter",
  inputs: [
    {
      id: "behaviorPersistenceScore",
      kind: "number",
      label: "Behavior persistence score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "digitalDependencyScore",
      kind: "number",
      label: "Digital dependency score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "institutionalPersistenceScore",
      kind: "number",
      label: "Institutional persistence score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "nextNormalMinimumPercent",
      kind: "number",
      label: "Next-normal minimum percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "temporaryMaximumPercent",
      kind: "number",
      label: "Temporary maximum percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "permanenceScorePercent",
      kind: "number",
      label: "Permanence score percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      enum: ["temporaryAcceleration", "reversibleAcceleration", "nextNormal"],
      id: "sortedCategory",
      kind: "string",
      label: "Permanence category",
    },
    { id: "sortingRationale", kind: "string", label: "Sorting rationale" },
  ],
  title: "Next Normal Covid Acceleration Permanence Sorter",
});

export const runNextNormalSorter = nextNormalSorterTool.execute;
export default nextNormalSorterTool;
