import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WildCardRegisterInput = {
  readonly highImpactThreshold: number;
  readonly lowProbabilityThresholdPercent: number;
  readonly wildCardIds: ReadonlyArray<string>;
  readonly wildCardMetrics: ReadonlyArray<ReadonlyArray<number>>;
};

export type WildCardRegisterOutput = {
  readonly candidateCount: number;
  readonly candidateIds: ReadonlyArray<string>;
  readonly lowProbabilityHighImpactCount: number;
};

export const registerWildCards = (
  input: WildCardRegisterInput,
): WildCardRegisterOutput => {
  for (const [field, value] of [
    ["highImpactThreshold", input.highImpactThreshold],
    ["lowProbabilityThresholdPercent", input.lowProbabilityThresholdPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_threshold",
      );
  if (
    !Array.isArray(input.wildCardIds) ||
    !Array.isArray(input.wildCardMetrics)
  )
    simpleError(
      "",
      "Wild-card IDs and metrics must be arrays.",
      "wild_card_data_required",
    );
  if (
    input.wildCardIds.length === 0 ||
    input.wildCardIds.length !== input.wildCardMetrics.length
  )
    simpleError(
      "wildCardMetrics",
      "Each nonempty wild-card ID must have one metric row.",
      "wild_card_data_length_mismatch",
    );
  const candidateIds: string[] = [];
  let lowProbabilityHighImpactCount = 0;
  for (const [index, id] of input.wildCardIds.entries()) {
    const metrics = input.wildCardMetrics[index]!;
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `wildCardIds.${index}`,
        "Wild-card IDs must be nonempty strings.",
        "invalid_wild_card_id",
      );
    if (!Array.isArray(metrics) || metrics.length !== 2)
      simpleError(
        `wildCardMetrics.${index}`,
        "Each row must contain probability percent and impact.",
        "invalid_wild_card_metrics",
      );
    const [probabilityPercent, impact] = metrics;
    if (
      !Number.isFinite(probabilityPercent) ||
      probabilityPercent < 0 ||
      probabilityPercent > 100
    )
      simpleError(
        `wildCardMetrics.${index}.0`,
        "Probability must be from 0 through 100 percent.",
        "invalid_probability",
      );
    if (!Number.isFinite(impact) || impact < 0)
      simpleError(
        `wildCardMetrics.${index}.1`,
        "Impact must be finite and nonnegative.",
        "invalid_impact",
      );
    if (
      probabilityPercent <= input.lowProbabilityThresholdPercent &&
      impact >= input.highImpactThreshold
    ) {
      candidateIds.push(id.trim());
      lowProbabilityHighImpactCount += 1;
    }
  }
  return {
    candidateCount: candidateIds.length,
    candidateIds,
    lowProbabilityHighImpactCount,
  };
};

export const wildCardRegisterExample = {
  input: {
    highImpactThreshold: 80,
    lowProbabilityThresholdPercent: 20,
    wildCardIds: ["Supply shock", "Demand shift", "Minor delay"],
    wildCardMetrics: [
      [10, 90],
      [25, 95],
      [5, 20],
    ],
  },
  output: {
    candidateCount: 1,
    candidateIds: ["Supply shock"],
    lowProbabilityHighImpactCount: 1,
  },
} satisfies ToolExample<WildCardRegisterInput, WildCardRegisterOutput>;

export const wildCardRegisterTool = createSimpleTool({
  calculate: (input) =>
    registerWildCards({
      highImpactThreshold: input.highImpactThreshold as number,
      lowProbabilityThresholdPercent:
        input.lowProbabilityThresholdPercent as number,
      wildCardIds: input.wildCardIds as string[],
      wildCardMetrics: input.wildCardMetrics as number[][],
    }),
  description:
    "Classify caller-supplied events as low-probability, high-impact wild cards using explicit probability and impact thresholds.",
  id: "futurology/wild-cards-low-probability-high-impact-register",
  inputs: [
    {
      id: "highImpactThreshold",
      kind: "number",
      label: "High-impact threshold",
      minimum: 0,
    },
    {
      id: "lowProbabilityThresholdPercent",
      kind: "number",
      label: "Low-probability threshold",
      minimum: 0,
      unit: "percent",
    },
    { id: "wildCardIds", kind: "stringList", label: "Wild-card IDs" },
    {
      description: "Rows ordered as probability percent and impact.",
      id: "wildCardMetrics",
      kind: "matrix",
      label: "Wild-card metrics",
    },
  ],
  outputs: [
    {
      id: "candidateCount",
      kind: "integer",
      label: "Wild-card candidates",
      minimum: 0,
    },
    { id: "candidateIds", kind: "stringList", label: "Candidate IDs" },
    {
      id: "lowProbabilityHighImpactCount",
      kind: "integer",
      label: "Low-probability high-impact count",
      minimum: 0,
    },
  ],
  title: "Wild Cards Low Probability High Impact Register",
});

export const runWildCardRegister = wildCardRegisterTool.execute;
export default wildCardRegisterTool;
