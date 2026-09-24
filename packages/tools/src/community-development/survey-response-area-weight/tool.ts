import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responses: number;
  readonly neighborhoodBasis: number;
  readonly totalBasis: number;
  readonly neighborhoodBasisUnit: string;
  readonly totalBasisUnit: string;
};
export type Output = {
  readonly allocationShare: number;
  readonly weightedResponses: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responses: { type: "integer", minimum: 0 },
    neighborhoodBasis: { type: "number", minimum: 0 },
    totalBasis: { type: "number", exclusiveMinimum: 0 },
    neighborhoodBasisUnit: { type: "string", maxLength: 8192 },
    totalBasisUnit: { type: "string", maxLength: 8192 },
  },
  required: [
    "responses",
    "neighborhoodBasis",
    "totalBasis",
    "neighborhoodBasisUnit",
    "totalBasisUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocationShare: { type: "number" },
    weightedResponses: { type: "number" },
  },
  required: ["allocationShare", "weightedResponses"],
} as const;
/** Compute one explicitly supplied area/population allocation contribution without demographic inference or survey design-weight estimation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    responses,
    neighborhoodBasis,
    totalBasis,
    neighborhoodBasisUnit,
    totalBasisUnit,
  } = request;
  const compute = (): Output => {
    H.integer(responses, 0);
    H.positive(totalBasis);
    H.domain(
      neighborhoodBasis >= 0 &&
        neighborhoodBasis <= totalBasis &&
        neighborhoodBasisUnit.length > 0 &&
        neighborhoodBasisUnit === totalBasisUnit,
    );
    return {
      allocationShare: neighborhoodBasis / totalBasis,
      weightedResponses: responses * (neighborhoodBasis / totalBasis),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responses: 20,
    neighborhoodBasis: 2,
    totalBasis: 10,
    neighborhoodBasisUnit: "km2",
    totalBasisUnit: "km2",
  },
  output: { allocationShare: 0.2, weightedResponses: 4 },
} satisfies ToolExample<Input, Output>;
export const surveyResponseAreaWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/survey-response-area-weight",
    title: "Survey Response Area Weight Tool",
    description:
      "Compute one explicitly supplied area/population allocation contribution without demographic inference or survey design-weight estimation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responses: { type: "integer", minimum: 0 },
        neighborhoodBasis: { type: "number", minimum: 0 },
        totalBasis: { type: "number", exclusiveMinimum: 0 },
        neighborhoodBasisUnit: { type: "string", maxLength: 8192 },
        totalBasisUnit: { type: "string", maxLength: 8192 },
      },
      required: [
        "responses",
        "neighborhoodBasis",
        "totalBasis",
        "neighborhoodBasisUnit",
        "totalBasisUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocationShare: { type: "number" },
        weightedResponses: { type: "number" },
      },
      required: ["allocationShare", "weightedResponses"],
    },
    ports: {
      inputs: [
        {
          id: "responses",
          label: "Responses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "neighborhoodBasis",
          label: "Neighborhood Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBasis",
          label: "Total Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "neighborhoodBasisUnit",
          label: "Neighborhood Basis Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "totalBasisUnit",
          label: "Total Basis Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "allocationShare",
          label: "Allocation Share",
          valueType: { type: "number" },
        },
        {
          id: "weightedResponses",
          label: "Weighted Responses",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyResponseAreaWeightTool.execute;
export default surveyResponseAreaWeightTool;
