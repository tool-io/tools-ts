import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intervalObserved: boolean;
  readonly opportunityPresent: boolean;
};
export type Output = { readonly eligibleObservation: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalObserved: { type: "boolean" },
    opportunityPresent: { type: "boolean" },
  },
  required: ["intervalObserved", "opportunityPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleObservation: { type: "boolean" } },
  required: ["eligibleObservation"],
} as const;
/** Combine explicit observation-coverage and opportunity flags for one classroom interval without inferring behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intervalObserved, opportunityPresent } = request;
  const compute = (): Output => {
    return { eligibleObservation: intervalObserved && opportunityPresent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intervalObserved: true, opportunityPresent: true },
  output: { eligibleObservation: true },
} satisfies ToolExample<Input, Output>;
export const classroomObservationIntervalOpportunityFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/classroom-observation-interval-opportunity-flag",
      title: "Classroom Observation Interval Opportunity Flag Tool",
      description:
        "Combine explicit observation-coverage and opportunity flags for one classroom interval without inferring behavior.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intervalObserved: { type: "boolean" },
          opportunityPresent: { type: "boolean" },
        },
        required: ["intervalObserved", "opportunityPresent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { eligibleObservation: { type: "boolean" } },
        required: ["eligibleObservation"],
      },
      ports: {
        inputs: [
          {
            id: "intervalObserved",
            label: "Interval Observed",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "opportunityPresent",
            label: "Opportunity Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "eligibleObservation",
            label: "Eligible Observation",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = classroomObservationIntervalOpportunityFlagTool.execute;
export default classroomObservationIntervalOpportunityFlagTool;
