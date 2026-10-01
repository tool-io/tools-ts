import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly importance: number;
  readonly performance: number;
  readonly satisfaction: number;
  readonly maximumScore: number;
  readonly totalImportance: number;
};
export type Output = {
  readonly performanceContribution: number;
  readonly satisfactionContribution: number;
  readonly weightShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    importance: { type: "number", minimum: 0 },
    performance: { type: "number", minimum: 0 },
    satisfaction: { type: "number", minimum: 0 },
    maximumScore: { type: "number", exclusiveMinimum: 0 },
    totalImportance: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "importance",
    "performance",
    "satisfaction",
    "maximumScore",
    "totalImportance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    performanceContribution: { type: "number" },
    satisfactionContribution: { type: "number" },
    weightShare: { type: "number" },
  },
  required: [
    "performanceContribution",
    "satisfactionContribution",
    "weightShare",
  ],
} as const;
/** Calculate activity goal client weight one term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    importance,
    performance,
    satisfaction,
    maximumScore,
    totalImportance,
  } = request;
  const compute = (): Output => {
    H.positive(maximumScore);
    H.positive(totalImportance);
    H.domain(
      importance >= 0 &&
        importance <= totalImportance &&
        performance >= 0 &&
        performance <= maximumScore &&
        satisfaction >= 0 &&
        satisfaction <= maximumScore,
    );
    return {
      performanceContribution:
        (importance * performance) / (maximumScore * totalImportance),
      satisfactionContribution:
        (importance * satisfaction) / (maximumScore * totalImportance),
      weightShare: importance / totalImportance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    importance: 3,
    performance: 6,
    satisfaction: 4,
    maximumScore: 10,
    totalImportance: 12,
  },
  output: {
    performanceContribution: 0.15,
    satisfactionContribution: 0.1,
    weightShare: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const activityGoalClientWeightOneTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/activity-goal-client-weight-one-term",
    title: "Activity Goal Client Weight One Term Tool",
    description:
      "Calculate activity goal client weight one term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        importance: { type: "number", minimum: 0 },
        performance: { type: "number", minimum: 0 },
        satisfaction: { type: "number", minimum: 0 },
        maximumScore: { type: "number", exclusiveMinimum: 0 },
        totalImportance: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "importance",
        "performance",
        "satisfaction",
        "maximumScore",
        "totalImportance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        performanceContribution: { type: "number" },
        satisfactionContribution: { type: "number" },
        weightShare: { type: "number" },
      },
      required: [
        "performanceContribution",
        "satisfactionContribution",
        "weightShare",
      ],
    },
    ports: {
      inputs: [
        {
          id: "importance",
          label: "Importance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "performance",
          label: "Performance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "satisfaction",
          label: "Satisfaction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumScore",
          label: "Maximum Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalImportance",
          label: "Total Importance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "performanceContribution",
          label: "Performance Contribution",
          valueType: { type: "number" },
        },
        {
          id: "satisfactionContribution",
          label: "Satisfaction Contribution",
          valueType: { type: "number" },
        },
        {
          id: "weightShare",
          label: "Weight Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = activityGoalClientWeightOneTermTool.execute;
export default activityGoalClientWeightOneTermTool;
