import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trainedVersion: string;
  readonly taskVersion: string;
  readonly trainingDay: number;
  readonly effectiveDay: number;
  readonly taskDay: number;
};
export type Output = {
  readonly versionMatches: boolean;
  readonly trainingVsEffective: number;
  readonly trainingLeadToTask: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainedVersion: { type: "string", maxLength: 8192 },
    taskVersion: { type: "string", maxLength: 8192 },
    trainingDay: { type: "integer" },
    effectiveDay: { type: "integer" },
    taskDay: { type: "integer" },
  },
  required: [
    "trainedVersion",
    "taskVersion",
    "trainingDay",
    "effectiveDay",
    "taskDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionMatches: { type: "boolean" },
    trainingVsEffective: { type: "integer" },
    trainingLeadToTask: { type: "integer" },
  },
  required: ["versionMatches", "trainingVsEffective", "trainingLeadToTask"],
} as const;
/** Audit supplied training/document version dates without determining qualification or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trainedVersion, taskVersion, trainingDay, effectiveDay, taskDay } =
    request;
  const compute = (): Output => {
    return {
      versionMatches: trainedVersion === taskVersion,
      trainingVsEffective: trainingDay - effectiveDay,
      trainingLeadToTask: taskDay - trainingDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trainedVersion: "v2",
    taskVersion: "v2",
    trainingDay: 110,
    effectiveDay: 100,
    taskDay: 120,
  },
  output: {
    versionMatches: true,
    trainingVsEffective: 10,
    trainingLeadToTask: 10,
  },
} satisfies ToolExample<Input, Output>;
export const trainingVersionEffectiveGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/training-version-effective-gap",
    title: "Training Version Effective Gap Tool",
    description:
      "Audit supplied training/document version dates without determining qualification or compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trainedVersion: { type: "string", maxLength: 8192 },
        taskVersion: { type: "string", maxLength: 8192 },
        trainingDay: { type: "integer" },
        effectiveDay: { type: "integer" },
        taskDay: { type: "integer" },
      },
      required: [
        "trainedVersion",
        "taskVersion",
        "trainingDay",
        "effectiveDay",
        "taskDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionMatches: { type: "boolean" },
        trainingVsEffective: { type: "integer" },
        trainingLeadToTask: { type: "integer" },
      },
      required: ["versionMatches", "trainingVsEffective", "trainingLeadToTask"],
    },
    ports: {
      inputs: [
        {
          id: "trainedVersion",
          label: "Trained Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "taskVersion",
          label: "Task Version",
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
          id: "effectiveDay",
          label: "Effective Day",
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
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "trainingVsEffective",
          label: "Training Vs Effective",
          valueType: { type: "integer" },
        },
        {
          id: "trainingLeadToTask",
          label: "Training Lead To Task",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trainingVersionEffectiveGapTool.execute;
export default trainingVersionEffectiveGapTool;
