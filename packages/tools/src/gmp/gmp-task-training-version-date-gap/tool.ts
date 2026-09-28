import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskVersion: string;
  readonly trainedVersion: string;
  readonly trainingDay: number;
  readonly taskDay: number;
};
export type Output = {
  readonly sameVersion: boolean;
  readonly daysSinceTraining: number;
  readonly trainingAfterTask: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskVersion: { type: "string", maxLength: 8192 },
    trainedVersion: { type: "string", maxLength: 8192 },
    trainingDay: { type: "integer" },
    taskDay: { type: "integer" },
  },
  required: ["taskVersion", "trainedVersion", "trainingDay", "taskDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameVersion: { type: "boolean" },
    daysSinceTraining: { type: "integer" },
    trainingAfterTask: { type: "boolean" },
  },
  required: ["sameVersion", "daysSinceTraining", "trainingAfterTask"],
} as const;
/** Audit supplied task/training version and date metadata without determining personnel qualification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskVersion, trainedVersion, trainingDay, taskDay } = request;
  const compute = (): Output => {
    return {
      sameVersion: taskVersion === trainedVersion,
      daysSinceTraining: taskDay - trainingDay,
      trainingAfterTask: trainingDay > taskDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskVersion: "v2",
    trainedVersion: "v1",
    trainingDay: 100,
    taskDay: 130,
  },
  output: {
    sameVersion: false,
    daysSinceTraining: 30,
    trainingAfterTask: false,
  },
} satisfies ToolExample<Input, Output>;
export const gmpTaskTrainingVersionDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-task-training-version-date-gap",
    title: "GMP Task Training Version Date Gap Tool",
    description:
      "Audit supplied task/training version and date metadata without determining personnel qualification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskVersion: { type: "string", maxLength: 8192 },
        trainedVersion: { type: "string", maxLength: 8192 },
        trainingDay: { type: "integer" },
        taskDay: { type: "integer" },
      },
      required: ["taskVersion", "trainedVersion", "trainingDay", "taskDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameVersion: { type: "boolean" },
        daysSinceTraining: { type: "integer" },
        trainingAfterTask: { type: "boolean" },
      },
      required: ["sameVersion", "daysSinceTraining", "trainingAfterTask"],
    },
    ports: {
      inputs: [
        {
          id: "taskVersion",
          label: "Task Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainedVersion",
          label: "Trained Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainingDay",
          label: "Training Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "taskDay",
          label: "Task Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sameVersion",
          label: "Same Version",
          valueType: { type: "boolean" },
        },
        {
          id: "daysSinceTraining",
          label: "Days Since Training",
          valueType: { type: "integer" },
        },
        {
          id: "trainingAfterTask",
          label: "Training After Task",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpTaskTrainingVersionDateGapTool.execute;
export default gmpTaskTrainingVersionDateGapTool;
