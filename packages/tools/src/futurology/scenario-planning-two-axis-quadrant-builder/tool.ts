import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScenarioQuadrantInput = {
  readonly scenarioIds: ReadonlyArray<string>;
  readonly xMidpoint: number;
  readonly xValues: ReadonlyArray<number>;
  readonly yMidpoint: number;
  readonly yValues: ReadonlyArray<number>;
};

export type ScenarioQuadrantOutput = {
  readonly assignments: ReadonlyArray<string>;
  readonly quadrantCounts: ReadonlyArray<number>;
};

export const buildScenarioQuadrants = (
  input: ScenarioQuadrantInput,
): ScenarioQuadrantOutput => {
  if (
    !Array.isArray(input.scenarioIds) ||
    !Array.isArray(input.xValues) ||
    !Array.isArray(input.yValues) ||
    input.scenarioIds.length === 0
  )
    simpleError(
      "",
      "Scenario IDs, x-values, and y-values must be nonempty arrays.",
      "scenario_data_required",
    );
  if (
    input.scenarioIds.length !== input.xValues.length ||
    input.scenarioIds.length !== input.yValues.length
  )
    simpleError(
      "xValues",
      "Each scenario must have one x-value and y-value.",
      "scenario_data_length_mismatch",
    );
  for (const [field, value] of [
    ["xMidpoint", input.xMidpoint],
    ["yMidpoint", input.yMidpoint],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(field, `${field} must be finite.`, "invalid_midpoint");
  const assignments: string[] = [];
  const quadrantCounts = [0, 0, 0, 0];
  for (const [index, id] of input.scenarioIds.entries()) {
    const x = input.xValues[index]!;
    const y = input.yValues[index]!;
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `scenarioIds.${index}`,
        "Scenario IDs must be nonempty strings.",
        "invalid_scenario_id",
      );
    if (!Number.isFinite(x) || !Number.isFinite(y))
      simpleError(
        `xValues.${index}`,
        "Scenario coordinates must be finite.",
        "invalid_scenario_coordinate",
      );
    const quadrant =
      x >= input.xMidpoint
        ? y >= input.yMidpoint
          ? 0
          : 1
        : y >= input.yMidpoint
          ? 2
          : 3;
    quadrantCounts[quadrant] += 1;
    assignments.push(`${id.trim()}: Q${quadrant + 1}`);
  }
  return { assignments, quadrantCounts };
};

export const scenarioQuadrantExample = {
  input: {
    scenarioIds: ["Growth", "Stability", "Resilience"],
    xMidpoint: 0,
    xValues: [2, -1, 0],
    yMidpoint: 10,
    yValues: [12, 8, 10],
  },
  output: {
    assignments: ["Growth: Q1", "Stability: Q4", "Resilience: Q1"],
    quadrantCounts: [2, 0, 0, 1],
  },
} satisfies ToolExample<ScenarioQuadrantInput, ScenarioQuadrantOutput>;

export const scenarioQuadrantTool = createSimpleTool({
  calculate: (input) =>
    buildScenarioQuadrants({
      scenarioIds: input.scenarioIds as string[],
      xMidpoint: input.xMidpoint as number,
      xValues: input.xValues as number[],
      yMidpoint: input.yMidpoint as number,
      yValues: input.yValues as number[],
    }),
  description:
    "Assign scenarios to four caller-defined two-axis quadrants using explicit midpoint thresholds and return quadrant counts.",
  id: "futurology/scenario-planning-two-axis-quadrant-builder",
  inputs: [
    { id: "scenarioIds", kind: "stringList", label: "Scenario IDs" },
    { id: "xMidpoint", kind: "number", label: "X midpoint" },
    { id: "xValues", kind: "numberList", label: "X values" },
    { id: "yMidpoint", kind: "number", label: "Y midpoint" },
    { id: "yValues", kind: "numberList", label: "Y values" },
  ],
  outputs: [
    {
      id: "assignments",
      kind: "stringList",
      label: "Scenario quadrant assignments",
    },
    { id: "quadrantCounts", kind: "numberList", label: "Quadrant counts" },
  ],
  title: "Scenario Planning Two-Axis Quadrant Builder",
});

export const runScenarioQuadrant = scenarioQuadrantTool.execute;
export default scenarioQuadrantTool;
