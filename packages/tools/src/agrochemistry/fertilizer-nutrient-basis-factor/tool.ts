import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedMass: number;
  readonly suppliedNutrientFraction: number;
  readonly suppliedOxideToElementFactor: number;
  readonly reportElement: boolean;
};
export type Output = {
  readonly nutrientMass: number;
  readonly reportedEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedMass: { type: "number", minimum: 0 },
    suppliedNutrientFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedOxideToElementFactor: { type: "number", exclusiveMinimum: 0 },
    reportElement: { type: "boolean" },
  },
  required: [
    "reportedMass",
    "suppliedNutrientFraction",
    "suppliedOxideToElementFactor",
    "reportElement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nutrientMass: { type: "number" },
    reportedEquivalent: { type: "number" },
  },
  required: ["nutrientMass", "reportedEquivalent"],
} as const;
/** Apply supplied nutrient-label/oxide factors without choosing composition, fertilizer rates or application guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedMass,
    suppliedNutrientFraction,
    suppliedOxideToElementFactor,
    reportElement,
  } = request;
  const compute = (): Output => {
    H.domain(reportedMass >= 0);
    H.probability(suppliedNutrientFraction);
    H.positive(suppliedOxideToElementFactor);
    return {
      nutrientMass: reportedMass * suppliedNutrientFraction,
      reportedEquivalent:
        reportedMass *
        suppliedNutrientFraction *
        (reportElement ? suppliedOxideToElementFactor : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedMass: 100,
    suppliedNutrientFraction: 0.2,
    suppliedOxideToElementFactor: 0.5,
    reportElement: true,
  },
  output: { nutrientMass: 20, reportedEquivalent: 10 },
} satisfies ToolExample<Input, Output>;
export const fertilizerNutrientBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/fertilizer-nutrient-basis-factor",
    title: "Fertilizer Nutrient Basis Factor Tool",
    description:
      "Apply supplied nutrient-label/oxide factors without choosing composition, fertilizer rates or application guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedMass: { type: "number", minimum: 0 },
        suppliedNutrientFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedOxideToElementFactor: { type: "number", exclusiveMinimum: 0 },
        reportElement: { type: "boolean" },
      },
      required: [
        "reportedMass",
        "suppliedNutrientFraction",
        "suppliedOxideToElementFactor",
        "reportElement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nutrientMass: { type: "number" },
        reportedEquivalent: { type: "number" },
      },
      required: ["nutrientMass", "reportedEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "reportedMass",
          label: "Reported Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNutrientFraction",
          label: "Supplied Nutrient Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOxideToElementFactor",
          label: "Supplied Oxide To Element Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportElement",
          label: "Report Element",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "nutrientMass",
          label: "Nutrient Mass",
          valueType: { type: "number" },
        },
        {
          id: "reportedEquivalent",
          label: "Reported Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fertilizerNutrientBasisFactorTool.execute;
export default fertilizerNutrientBasisFactorTool;
