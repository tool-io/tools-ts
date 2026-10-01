import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completed: number;
  readonly attempted: number;
  readonly totalSteps: number;
  readonly assistedCompleted: number;
  readonly countAssisted: boolean;
};
export type Output = {
  readonly counted: number;
  readonly completion: number;
  readonly attemptedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completed: { type: "integer", minimum: 0 },
    attempted: { type: "integer", minimum: 0 },
    totalSteps: { type: "integer", minimum: 1 },
    assistedCompleted: { type: "integer", minimum: 0 },
    countAssisted: { type: "boolean" },
  },
  required: [
    "completed",
    "attempted",
    "totalSteps",
    "assistedCompleted",
    "countAssisted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counted: { type: "integer" },
    completion: { type: "number" },
    attemptedShare: { type: "number" },
  },
  required: ["counted", "completion", "attemptedShare"],
} as const;
/** Calculate occupational task step completion share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completed, attempted, totalSteps, assistedCompleted, countAssisted } =
    request;
  const compute = (): Output => {
    H.integer(totalSteps, 1);
    H.integer(attempted, 0, totalSteps);
    H.integer(completed, 0, attempted);
    H.integer(assistedCompleted, 0, completed);
    return {
      counted: completed - (countAssisted ? 0 : assistedCompleted),
      completion:
        (completed - (countAssisted ? 0 : assistedCompleted)) / totalSteps,
      attemptedShare: attempted / totalSteps,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    completed: 8,
    attempted: 10,
    totalSteps: 12,
    assistedCompleted: 3,
    countAssisted: false,
  },
  output: {
    counted: 5,
    completion: 0.4166666666666667,
    attemptedShare: 0.8333333333333334,
  },
} satisfies ToolExample<Input, Output>;
export const occupationalTaskStepCompletionShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-therapy/occupational-task-step-completion-share",
      title: "Occupational Task Step Completion Share Tool",
      description:
        "Calculate occupational task step completion share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completed: { type: "integer", minimum: 0 },
          attempted: { type: "integer", minimum: 0 },
          totalSteps: { type: "integer", minimum: 1 },
          assistedCompleted: { type: "integer", minimum: 0 },
          countAssisted: { type: "boolean" },
        },
        required: [
          "completed",
          "attempted",
          "totalSteps",
          "assistedCompleted",
          "countAssisted",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counted: { type: "integer" },
          completion: { type: "number" },
          attemptedShare: { type: "number" },
        },
        required: ["counted", "completion", "attemptedShare"],
      },
      ports: {
        inputs: [
          {
            id: "completed",
            label: "Completed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attempted",
            label: "Attempted",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalSteps",
            label: "Total Steps",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assistedCompleted",
            label: "Assisted Completed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "countAssisted",
            label: "Count Assisted",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "counted", label: "Counted", valueType: { type: "integer" } },
          {
            id: "completion",
            label: "Completion",
            valueType: { type: "number" },
          },
          {
            id: "attemptedShare",
            label: "Attempted Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = occupationalTaskStepCompletionShareTool.execute;
export default occupationalTaskStepCompletionShareTool;
