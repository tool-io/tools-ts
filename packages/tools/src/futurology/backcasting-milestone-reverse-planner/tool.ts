import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BackcastingMilestoneInput = {
  readonly changePerStep: number;
  readonly currentValue: number;
  readonly currentYear: number;
  readonly steps: number;
  readonly targetValue: number;
  readonly targetYear: number;
};

export type BackcastingMilestoneOutput = {
  readonly finalTargetValue: number;
  readonly gapToTarget: number;
  readonly projectedValues: ReadonlyArray<number>;
};

export const planBackcastingMilestones = (
  input: BackcastingMilestoneInput,
): BackcastingMilestoneOutput => {
  for (const [field, value] of [
    ["currentValue", input.currentValue],
    ["targetValue", input.targetValue],
    ["changePerStep", input.changePerStep],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(field, `${field} must be finite.`, "finite_value_required");
  for (const [field, value] of [
    ["currentYear", input.currentYear],
    ["targetYear", input.targetYear],
  ] as const)
    if (!Number.isSafeInteger(value))
      simpleError(field, `${field} must be a whole year.`, "invalid_year");
  if (
    !Number.isSafeInteger(input.steps) ||
    input.steps < 1 ||
    input.steps > 100
  )
    simpleError(
      "steps",
      "Steps must be a whole number from 1 through 100.",
      "invalid_step_count",
    );
  if (input.targetYear <= input.currentYear)
    simpleError(
      "targetYear",
      "Backcasting requires a target year after the current year.",
      "invalid_target_year",
    );
  const projectedValues: number[] = [];
  for (let step = 0; step <= input.steps; step += 1) {
    const value = input.currentValue + input.changePerStep * step;
    if (!Number.isFinite(value))
      simpleError(
        "changePerStep",
        "A projected milestone is outside the representable numeric range.",
        "result_not_finite",
      );
    projectedValues.push(value === 0 ? 0 : value);
  }
  const finalTargetValue = projectedValues[projectedValues.length - 1]!;
  return {
    finalTargetValue,
    gapToTarget: input.targetValue - finalTargetValue,
    projectedValues,
  };
};

export const backcastingMilestoneExample = {
  input: {
    changePerStep: 10,
    currentValue: 100,
    currentYear: 2026,
    steps: 5,
    targetValue: 150,
    targetYear: 2031,
  },
  output: {
    finalTargetValue: 150,
    gapToTarget: 0,
    projectedValues: [100, 110, 120, 130, 140, 150],
  },
} satisfies ToolExample<BackcastingMilestoneInput, BackcastingMilestoneOutput>;

export const backcastingMilestoneTool = createSimpleTool({
  calculate: (input) =>
    planBackcastingMilestones({
      changePerStep: input.changePerStep as number,
      currentValue: input.currentValue as number,
      currentYear: input.currentYear as number,
      steps: input.steps as number,
      targetValue: input.targetValue as number,
      targetYear: input.targetYear as number,
    }),
  description:
    "Generate a bounded linear milestone path from a current value and step change, then report the gap to a caller-supplied target.",
  id: "futurology/backcasting-milestone-reverse-planner",
  inputs: [
    { id: "changePerStep", kind: "number", label: "Change per step" },
    { id: "currentValue", kind: "number", label: "Current value" },
    { id: "currentYear", kind: "integer", label: "Current year" },
    { id: "steps", kind: "integer", label: "Steps", maximum: 100, minimum: 1 },
    { id: "targetValue", kind: "number", label: "Target value" },
    { id: "targetYear", kind: "integer", label: "Target year" },
  ],
  outputs: [
    { id: "finalTargetValue", kind: "number", label: "Projected final value" },
    { id: "gapToTarget", kind: "number", label: "Gap to target" },
    {
      id: "projectedValues",
      kind: "numberList",
      label: "Projected milestone values",
    },
  ],
  title: "Backcasting Milestone Reverse Planner",
});

export const runBackcastingMilestone = backcastingMilestoneTool.execute;
export default backcastingMilestoneTool;
