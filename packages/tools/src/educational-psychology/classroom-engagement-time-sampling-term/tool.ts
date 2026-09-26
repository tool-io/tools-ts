import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly engaged: number;
  readonly observed: number;
  readonly excluded: number;
};
export type Output = {
  readonly eligible: number;
  readonly engagementFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    engaged: { type: "integer", minimum: 0 },
    observed: { type: "integer", minimum: 1 },
    excluded: { type: "integer", minimum: 0 },
  },
  required: ["engaged", "observed", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    engagementFraction: { type: "number" },
  },
  required: ["eligible", "engagementFraction"],
} as const;
/** Engaged intervals divided by eligible observed intervals, assuming mutually exclusive excluded intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { engaged, observed, excluded } = request;
  const compute = (): Output => {
    H.integer(observed, 1);
    H.integer(excluded, 0, observed - 1);
    H.integer(engaged, 0, observed - excluded);
    return {
      eligible: observed - excluded,
      engagementFraction: engaged / (observed - excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { engaged: 12, observed: 20, excluded: 4 },
  output: { eligible: 16, engagementFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const classroomEngagementTimeSamplingTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/classroom-engagement-time-sampling-term",
      title: "Classroom Engagement Time Sampling Term Tool",
      description:
        "Engaged intervals divided by eligible observed intervals, assuming mutually exclusive excluded intervals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          engaged: { type: "integer", minimum: 0 },
          observed: { type: "integer", minimum: 1 },
          excluded: { type: "integer", minimum: 0 },
        },
        required: ["engaged", "observed", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "integer" },
          engagementFraction: { type: "number" },
        },
        required: ["eligible", "engagementFraction"],
      },
      ports: {
        inputs: [
          {
            id: "engaged",
            label: "Engaged",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
          {
            id: "engagementFraction",
            label: "Engagement Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = classroomEngagementTimeSamplingTermTool.execute;
export default classroomEngagementTimeSamplingTermTool;
