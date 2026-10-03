import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleWeight: number;
  readonly respondingWeight: number;
  readonly validWeight: number;
  readonly populationTotal: number;
};
export type Output = {
  readonly responseShare: number;
  readonly validShare: number;
  readonly expandedValid: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleWeight: { type: "number", exclusiveMinimum: 0 },
    respondingWeight: { type: "number", exclusiveMinimum: 0 },
    validWeight: { type: "number", minimum: 0 },
    populationTotal: { type: "number", minimum: 0 },
  },
  required: [
    "eligibleWeight",
    "respondingWeight",
    "validWeight",
    "populationTotal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseShare: { type: "number" },
    validShare: { type: "number" },
    expandedValid: { type: "number" },
  },
  required: ["responseShare", "validShare", "expandedValid"],
} as const;
/** Calculate health survey weighted response one group from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleWeight, respondingWeight, validWeight, populationTotal } =
    request;
  const compute = (): Output => {
    H.positive(eligibleWeight);
    H.domain(
      respondingWeight > 0 &&
        respondingWeight <= eligibleWeight &&
        validWeight >= 0 &&
        validWeight <= respondingWeight &&
        populationTotal >= 0,
    );
    return {
      responseShare: respondingWeight / eligibleWeight,
      validShare: validWeight / respondingWeight,
      expandedValid: (populationTotal * validWeight) / eligibleWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleWeight: 200,
    respondingWeight: 160,
    validWeight: 120,
    populationTotal: 1000,
  },
  output: { responseShare: 0.8, validShare: 0.75, expandedValid: 600 },
} satisfies ToolExample<Input, Output>;
export const healthSurveyWeightedResponseOneGroupTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/health-survey-weighted-response-one-group",
      title: "Health Survey Weighted Response One Group Tool",
      description:
        "Calculate health survey weighted response one group from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleWeight: { type: "number", exclusiveMinimum: 0 },
          respondingWeight: { type: "number", exclusiveMinimum: 0 },
          validWeight: { type: "number", minimum: 0 },
          populationTotal: { type: "number", minimum: 0 },
        },
        required: [
          "eligibleWeight",
          "respondingWeight",
          "validWeight",
          "populationTotal",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseShare: { type: "number" },
          validShare: { type: "number" },
          expandedValid: { type: "number" },
        },
        required: ["responseShare", "validShare", "expandedValid"],
      },
      ports: {
        inputs: [
          {
            id: "eligibleWeight",
            label: "Eligible Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "respondingWeight",
            label: "Responding Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "validWeight",
            label: "Valid Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "populationTotal",
            label: "Population Total",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "responseShare",
            label: "Response Share",
            valueType: { type: "number" },
          },
          {
            id: "validShare",
            label: "Valid Share",
            valueType: { type: "number" },
          },
          {
            id: "expandedValid",
            label: "Expanded Valid",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthSurveyWeightedResponseOneGroupTool.execute;
export default healthSurveyWeightedResponseOneGroupTool;
