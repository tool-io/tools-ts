import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlausibilityConeInput = {
  readonly highImpactThreshold: number;
  readonly lowPlausibilityThresholdPercent: number;
  readonly scenarioIds: ReadonlyArray<string>;
  readonly scenarioMetrics: ReadonlyArray<ReadonlyArray<number>>;
  readonly wildCardFlags: ReadonlyArray<number>;
};

export type PlausibilityConeOutput = {
  readonly assignments: ReadonlyArray<string>;
  readonly outsideCount: number;
  readonly wildCardOutsideCount: number;
};

export const mapPlausibilityConeBoundaries = (
  input: PlausibilityConeInput,
): PlausibilityConeOutput => {
  for (const [field, value] of [
    ["highImpactThreshold", input.highImpactThreshold],
    ["lowPlausibilityThresholdPercent", input.lowPlausibilityThresholdPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_threshold",
      );
  if (
    !Array.isArray(input.scenarioIds) ||
    !Array.isArray(input.scenarioMetrics) ||
    !Array.isArray(input.wildCardFlags)
  )
    simpleError(
      "",
      "Scenario IDs, metrics, and wild-card flags must be arrays.",
      "cone_data_required",
    );
  if (
    input.scenarioIds.length === 0 ||
    input.scenarioIds.length !== input.scenarioMetrics.length ||
    input.scenarioIds.length !== input.wildCardFlags.length
  )
    simpleError(
      "scenarioMetrics",
      "Each nonempty scenario must have metrics and a wild-card flag.",
      "cone_data_length_mismatch",
    );
  const assignments: string[] = [];
  let outsideCount = 0;
  let wildCardOutsideCount = 0;
  for (const [index, id] of input.scenarioIds.entries()) {
    const metrics = input.scenarioMetrics[index]!;
    const wildCard = input.wildCardFlags[index]!;
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `scenarioIds.${index}`,
        "Scenario IDs must be nonempty strings.",
        "invalid_scenario_id",
      );
    if (!Array.isArray(metrics) || metrics.length !== 2)
      simpleError(
        `scenarioMetrics.${index}`,
        "Each row must contain plausibility percent and impact.",
        "invalid_scenario_metrics",
      );
    const [plausibility, impact] = metrics;
    if (
      !Number.isFinite(plausibility) ||
      plausibility < 0 ||
      plausibility > 100
    )
      simpleError(
        `scenarioMetrics.${index}.0`,
        "Plausibility must be from 0 through 100 percent.",
        "invalid_plausibility",
      );
    if (!Number.isFinite(impact) || impact < 0)
      simpleError(
        `scenarioMetrics.${index}.1`,
        "Impact must be finite and nonnegative.",
        "invalid_impact",
      );
    if (wildCard !== 0 && wildCard !== 1)
      simpleError(
        `wildCardFlags.${index}`,
        "Wild-card flags must be 0 or 1.",
        "invalid_wild_card_flag",
      );
    const outside =
      plausibility <= input.lowPlausibilityThresholdPercent &&
      impact >= input.highImpactThreshold;
    if (outside) {
      outsideCount += 1;
      if (wildCard === 1) wildCardOutsideCount += 1;
    }
    assignments.push(`${id.trim()}: ${outside ? "outside" : "inside"}`);
  }
  return { assignments, outsideCount, wildCardOutsideCount };
};

export const plausibilityConeExample = {
  input: {
    highImpactThreshold: 80,
    lowPlausibilityThresholdPercent: 20,
    scenarioIds: ["Supply", "Demand", "Policy"],
    scenarioMetrics: [
      [10, 90],
      [50, 90],
      [10, 50],
    ],
    wildCardFlags: [1, 0, 1],
  },
  output: {
    assignments: ["Supply: outside", "Demand: inside", "Policy: inside"],
    outsideCount: 1,
    wildCardOutsideCount: 1,
  },
} satisfies ToolExample<PlausibilityConeInput, PlausibilityConeOutput>;

export const plausibilityConeTool = createSimpleTool({
  calculate: (input) =>
    mapPlausibilityConeBoundaries({
      highImpactThreshold: input.highImpactThreshold as number,
      lowPlausibilityThresholdPercent:
        input.lowPlausibilityThresholdPercent as number,
      scenarioIds: input.scenarioIds as string[],
      scenarioMetrics: input.scenarioMetrics as number[][],
      wildCardFlags: input.wildCardFlags as number[],
    }),
  description:
    "Classify scenarios inside or outside a caller-defined low-plausibility, high-impact cone and count outside wild cards.",
  id: "futurology/cone-of-plausibility-wildcard-boundary-map",
  inputs: [
    {
      id: "highImpactThreshold",
      kind: "number",
      label: "High-impact threshold",
      minimum: 0,
    },
    {
      id: "lowPlausibilityThresholdPercent",
      kind: "number",
      label: "Low-plausibility threshold",
      minimum: 0,
      unit: "percent",
    },
    { id: "scenarioIds", kind: "stringList", label: "Scenario IDs" },
    { id: "scenarioMetrics", kind: "matrix", label: "Scenario metrics" },
    { id: "wildCardFlags", kind: "numberList", label: "Wild-card flags" },
  ],
  outputs: [
    { id: "assignments", kind: "stringList", label: "Cone assignments" },
    { id: "outsideCount", kind: "integer", label: "Outside count", minimum: 0 },
    {
      id: "wildCardOutsideCount",
      kind: "integer",
      label: "Outside wild cards",
      minimum: 0,
    },
  ],
  title: "Cone of Plausibility Wildcard Boundary Map",
});

export const runPlausibilityCone = plausibilityConeTool.execute;
export default plausibilityConeTool;
