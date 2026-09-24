import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledVisits: number;
  readonly missedVisits: number;
  readonly suppliedPerVisitProbability: number;
};
export type Output = {
  readonly completedVisits: number;
  readonly conditionalAtLeastOne: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledVisits: { type: "integer", minimum: 0 },
    missedVisits: { type: "integer", minimum: 0 },
    suppliedPerVisitProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["scheduledVisits", "missedVisits", "suppliedPerVisitProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedVisits: { type: "integer" },
    conditionalAtLeastOne: { type: "number" },
  },
  required: ["completedVisits", "conditionalAtLeastOne"],
} as const;
/** Count supplied completed visits and an explicit independent equal-probability detection scenario; no survey design or species detectability is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledVisits, missedVisits, suppliedPerVisitProbability } =
    request;
  const compute = (): Output => {
    H.integer(scheduledVisits, 0);
    H.integer(missedVisits, 0, scheduledVisits);
    H.probability(suppliedPerVisitProbability);
    return {
      completedVisits: scheduledVisits - missedVisits,
      conditionalAtLeastOne:
        1 -
        (1 - suppliedPerVisitProbability) ** (scheduledVisits - missedVisits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledVisits: 3,
    missedVisits: 1,
    suppliedPerVisitProbability: 0.5,
  },
  output: { completedVisits: 2, conditionalAtLeastOne: 0.75 },
} satisfies ToolExample<Input, Output>;
export const surveyVisitDetectionOpportunityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/survey-visit-detection-opportunity",
    title: "Survey Visit Detection Opportunity Tool",
    description:
      "Count supplied completed visits and an explicit independent equal-probability detection scenario; no survey design or species detectability is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledVisits: { type: "integer", minimum: 0 },
        missedVisits: { type: "integer", minimum: 0 },
        suppliedPerVisitProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "scheduledVisits",
        "missedVisits",
        "suppliedPerVisitProbability",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedVisits: { type: "integer" },
        conditionalAtLeastOne: { type: "number" },
      },
      required: ["completedVisits", "conditionalAtLeastOne"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledVisits",
          label: "Scheduled Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missedVisits",
          label: "Missed Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedPerVisitProbability",
          label: "Supplied Per Visit Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "completedVisits",
          label: "Completed Visits",
          valueType: { type: "integer" },
        },
        {
          id: "conditionalAtLeastOne",
          label: "Conditional At Least One",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyVisitDetectionOpportunityTool.execute;
export default surveyVisitDetectionOpportunityTool;
