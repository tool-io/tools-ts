import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly eligibilityFraction: number;
  readonly uptakeFraction: number;
  readonly adherenceFraction: number;
};
export type Output = {
  readonly eligible: number;
  readonly starts: number;
  readonly adherent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 0 },
    eligibilityFraction: { type: "number", minimum: 0, maximum: 1 },
    uptakeFraction: { type: "number", minimum: 0, maximum: 1 },
    adherenceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "population",
    "eligibilityFraction",
    "uptakeFraction",
    "adherenceFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "number" },
    starts: { type: "number" },
    adherent: { type: "number" },
  },
  required: ["eligible", "starts", "adherent"],
} as const;
/** Sequential expected population counts without integer rounding; no intervention eligibility or clinical adherence rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, eligibilityFraction, uptakeFraction, adherenceFraction } =
    request;
  const compute = (): Output => {
    H.integer(population, 0);
    H.probability(eligibilityFraction);
    H.probability(uptakeFraction);
    H.probability(adherenceFraction);
    return {
      eligible: population * eligibilityFraction,
      starts: population * eligibilityFraction * uptakeFraction,
      adherent:
        population * eligibilityFraction * uptakeFraction * adherenceFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    population: 10000,
    eligibilityFraction: 0.2,
    uptakeFraction: 0.5,
    adherenceFraction: 0.8,
  },
  output: { eligible: 2000, starts: 1000, adherent: 800 },
} satisfies ToolExample<Input, Output>;
export const interventionUptakeEligiblePopulationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/intervention-uptake-eligible-population-factor",
      title: "Intervention Uptake Eligible Population Factor Tool",
      description:
        "Sequential expected population counts without integer rounding; no intervention eligibility or clinical adherence rule is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          population: { type: "integer", minimum: 0 },
          eligibilityFraction: { type: "number", minimum: 0, maximum: 1 },
          uptakeFraction: { type: "number", minimum: 0, maximum: 1 },
          adherenceFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "population",
          "eligibilityFraction",
          "uptakeFraction",
          "adherenceFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "number" },
          starts: { type: "number" },
          adherent: { type: "number" },
        },
        required: ["eligible", "starts", "adherent"],
      },
      ports: {
        inputs: [
          {
            id: "population",
            label: "Population",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "eligibilityFraction",
            label: "Eligibility Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "uptakeFraction",
            label: "Uptake Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "adherenceFraction",
            label: "Adherence Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "number" } },
          { id: "starts", label: "Starts", valueType: { type: "number" } },
          { id: "adherent", label: "Adherent", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = interventionUptakeEligiblePopulationFactorTool.execute;
export default interventionUptakeEligiblePopulationFactorTool;
