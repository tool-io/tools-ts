import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyHouseholds: number;
  readonly surveyPeople: number;
  readonly targetHouseholds: number;
  readonly targetPeople: number;
  readonly householdEstimate: number;
};
export type Output = {
  readonly samplePeoplePerHousehold: number;
  readonly targetPeoplePerHousehold: number;
  readonly correctedPersonEstimate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyHouseholds: { type: "integer", minimum: 1 },
    surveyPeople: { type: "integer", minimum: 1 },
    targetHouseholds: { type: "integer", minimum: 1 },
    targetPeople: { type: "integer", minimum: 1 },
    householdEstimate: { type: "number" },
  },
  required: [
    "surveyHouseholds",
    "surveyPeople",
    "targetHouseholds",
    "targetPeople",
    "householdEstimate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplePeoplePerHousehold: { type: "number" },
    targetPeoplePerHousehold: { type: "number" },
    correctedPersonEstimate: { type: "number" },
  },
  required: [
    "samplePeoplePerHousehold",
    "targetPeoplePerHousehold",
    "correctedPersonEstimate",
  ],
} as const;
/** One explicit household/person denominator correction, not a survey estimator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    surveyHouseholds,
    surveyPeople,
    targetHouseholds,
    targetPeople,
    householdEstimate,
  } = request;
  const compute = (): Output => {
    H.integer(surveyHouseholds, 1);
    H.integer(surveyPeople, 1);
    H.integer(targetHouseholds, 1);
    H.integer(targetPeople, 1);
    return {
      samplePeoplePerHousehold: surveyPeople / surveyHouseholds,
      targetPeoplePerHousehold: targetPeople / targetHouseholds,
      correctedPersonEstimate:
        (householdEstimate * surveyPeople * targetHouseholds) /
        (surveyHouseholds * targetPeople),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surveyHouseholds: 100,
    surveyPeople: 400,
    targetHouseholds: 200,
    targetPeople: 600,
    householdEstimate: 0.3,
  },
  output: {
    samplePeoplePerHousehold: 4,
    targetPeoplePerHousehold: 3,
    correctedPersonEstimate: 0.4,
  },
} satisfies ToolExample<Input, Output>;
export const environmentalHealthSurveyHouseholdBaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/environmental-health-survey-household-base",
      title: "Environmental Health Survey Household Base Tool",
      description:
        "One explicit household/person denominator correction, not a survey estimator.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surveyHouseholds: { type: "integer", minimum: 1 },
          surveyPeople: { type: "integer", minimum: 1 },
          targetHouseholds: { type: "integer", minimum: 1 },
          targetPeople: { type: "integer", minimum: 1 },
          householdEstimate: { type: "number" },
        },
        required: [
          "surveyHouseholds",
          "surveyPeople",
          "targetHouseholds",
          "targetPeople",
          "householdEstimate",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          samplePeoplePerHousehold: { type: "number" },
          targetPeoplePerHousehold: { type: "number" },
          correctedPersonEstimate: { type: "number" },
        },
        required: [
          "samplePeoplePerHousehold",
          "targetPeoplePerHousehold",
          "correctedPersonEstimate",
        ],
      },
      ports: {
        inputs: [
          {
            id: "surveyHouseholds",
            label: "Survey Households",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "surveyPeople",
            label: "Survey People",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "targetHouseholds",
            label: "Target Households",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "targetPeople",
            label: "Target People",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "householdEstimate",
            label: "Household Estimate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "samplePeoplePerHousehold",
            label: "Sample People Per Household",
            valueType: { type: "number" },
          },
          {
            id: "targetPeoplePerHousehold",
            label: "Target People Per Household",
            valueType: { type: "number" },
          },
          {
            id: "correctedPersonEstimate",
            label: "Corrected Person Estimate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = environmentalHealthSurveyHouseholdBaseTool.execute;
export default environmentalHealthSurveyHouseholdBaseTool;
