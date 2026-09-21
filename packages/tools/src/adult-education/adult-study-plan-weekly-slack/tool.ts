import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableHours: readonly number[];
  readonly commitments: readonly number[];
  readonly studyTarget: number;
};
export type Output = {
  readonly netAvailable: number;
  readonly slack: number;
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHours: { type: "array", maxItems: 256, items: { type: "number" } },
    commitments: { type: "array", maxItems: 256, items: { type: "number" } },
    studyTarget: { type: "number", minimum: 0 },
  },
  required: ["availableHours", "commitments", "studyTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netAvailable: { type: "number" },
    slack: { type: "number" },
    feasible: { type: "boolean" },
  },
  required: ["netAvailable", "slack", "feasible"],
} as const;
/** Calculate adult study plan weekly slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableHours, commitments, studyTarget } = request;
  const compute = (): Output => {
    H.domain(
      availableHours.every((x) => x >= 0) &&
        commitments.every((x) => x >= 0) &&
        studyTarget >= 0,
    );
    return {
      netAvailable:
        availableHours.reduce((a, b) => a + b, 0) -
        commitments.reduce((a, b) => a + b, 0),
      slack:
        availableHours.reduce((a, b) => a + b, 0) -
        commitments.reduce((a, b) => a + b, 0) -
        studyTarget,
      feasible:
        availableHours.reduce((a, b) => a + b, 0) >=
        commitments.reduce((a, b) => a + b, 0) + studyTarget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableHours: [2, 3, 4], commitments: [1, 2], studyTarget: 5 },
  output: { netAvailable: 6, slack: 1, feasible: true },
} satisfies ToolExample<Input, Output>;
export const adultStudyPlanWeeklySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/adult-study-plan-weekly-slack",
    title: "Adult Study Plan Weekly Slack Tool",
    description:
      "Calculate adult study plan weekly slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableHours: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        commitments: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        studyTarget: { type: "number", minimum: 0 },
      },
      required: ["availableHours", "commitments", "studyTarget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netAvailable: { type: "number" },
        slack: { type: "number" },
        feasible: { type: "boolean" },
      },
      required: ["netAvailable", "slack", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "availableHours",
          label: "Available Hours",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "commitments",
          label: "Commitments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "studyTarget",
          label: "Study Target",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netAvailable",
          label: "Net Available",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = adultStudyPlanWeeklySlackTool.execute;
export default adultStudyPlanWeeklySlackTool;
