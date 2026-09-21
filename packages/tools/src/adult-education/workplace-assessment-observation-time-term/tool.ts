import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tasks: number;
  readonly observationMinutes: number;
  readonly briefingMinutes: number;
  readonly feedbackMinutes: number;
  readonly assessors: number;
};
export type Output = {
  readonly sessionMinutes: number;
  readonly assessorPersonMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tasks: { type: "integer", minimum: 0 },
    observationMinutes: { type: "number", minimum: 0 },
    briefingMinutes: { type: "number", minimum: 0 },
    feedbackMinutes: { type: "number", minimum: 0 },
    assessors: { type: "integer", minimum: 1 },
  },
  required: [
    "tasks",
    "observationMinutes",
    "briefingMinutes",
    "feedbackMinutes",
    "assessors",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number" },
    assessorPersonMinutes: { type: "number" },
  },
  required: ["sessionMinutes", "assessorPersonMinutes"],
} as const;
/** Calculate workplace assessment observation time term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    tasks,
    observationMinutes,
    briefingMinutes,
    feedbackMinutes,
    assessors,
  } = request;
  const compute = (): Output => {
    H.integer(tasks, 0);
    H.integer(assessors, 1);
    H.domain(
      observationMinutes >= 0 && briefingMinutes >= 0 && feedbackMinutes >= 0,
    );
    return {
      sessionMinutes:
        tasks * observationMinutes + briefingMinutes + feedbackMinutes,
      assessorPersonMinutes:
        assessors *
        (tasks * observationMinutes + briefingMinutes + feedbackMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tasks: 3,
    observationMinutes: 10,
    briefingMinutes: 5,
    feedbackMinutes: 10,
    assessors: 2,
  },
  output: { sessionMinutes: 45, assessorPersonMinutes: 90 },
} satisfies ToolExample<Input, Output>;
export const workplaceAssessmentObservationTimeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/workplace-assessment-observation-time-term",
      title: "Workplace Assessment Observation Time Term Tool",
      description:
        "Calculate workplace assessment observation time term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tasks: { type: "integer", minimum: 0 },
          observationMinutes: { type: "number", minimum: 0 },
          briefingMinutes: { type: "number", minimum: 0 },
          feedbackMinutes: { type: "number", minimum: 0 },
          assessors: { type: "integer", minimum: 1 },
        },
        required: [
          "tasks",
          "observationMinutes",
          "briefingMinutes",
          "feedbackMinutes",
          "assessors",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionMinutes: { type: "number" },
          assessorPersonMinutes: { type: "number" },
        },
        required: ["sessionMinutes", "assessorPersonMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "tasks",
            label: "Tasks",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observationMinutes",
            label: "Observation Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "briefingMinutes",
            label: "Briefing Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "feedbackMinutes",
            label: "Feedback Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "assessors",
            label: "Assessors",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "assessorPersonMinutes",
            label: "Assessor Person Minutes",
            valueType: { type: "number", unit: "min" },
          },
        ],
      },
    },
    calculate,
  });
export const run = workplaceAssessmentObservationTimeTermTool.execute;
export default workplaceAssessmentObservationTimeTermTool;
