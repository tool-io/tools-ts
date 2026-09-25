import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wholeMass: number;
  readonly drainedMass: number;
  readonly totalNutrient: number;
  readonly drainedRetainedFraction: number;
};
export type Output = {
  readonly drainedYield: number;
  readonly drainedConcentration: number;
  readonly wholeConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeMass: { type: "number", exclusiveMinimum: 0 },
    drainedMass: { type: "number", exclusiveMinimum: 0 },
    totalNutrient: { type: "number", minimum: 0 },
    drainedRetainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "wholeMass",
    "drainedMass",
    "totalNutrient",
    "drainedRetainedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drainedYield: { type: "number" },
    drainedConcentration: { type: "number" },
    wholeConcentration: { type: "number" },
  },
  required: ["drainedYield", "drainedConcentration", "wholeConcentration"],
} as const;
/** Calculate nutrition label drained whole basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wholeMass, drainedMass, totalNutrient, drainedRetainedFraction } =
    request;
  const compute = (): Output => {
    H.positive(wholeMass);
    H.positive(drainedMass);
    H.domain(drainedMass <= wholeMass && totalNutrient >= 0);
    H.probability(drainedRetainedFraction);
    return {
      drainedYield: drainedMass / wholeMass,
      drainedConcentration:
        (totalNutrient * drainedRetainedFraction) / drainedMass,
      wholeConcentration: totalNutrient / wholeMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wholeMass: 500,
    drainedMass: 300,
    totalNutrient: 50,
    drainedRetainedFraction: 0.9,
  },
  output: {
    drainedYield: 0.6,
    drainedConcentration: 0.15,
    wholeConcentration: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const nutritionLabelDrainedWholeBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrition-label-drained-whole-basis",
    title: "Nutrition Label Drained Whole Basis Tool",
    description:
      "Calculate nutrition label drained whole basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeMass: { type: "number", exclusiveMinimum: 0 },
        drainedMass: { type: "number", exclusiveMinimum: 0 },
        totalNutrient: { type: "number", minimum: 0 },
        drainedRetainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "wholeMass",
        "drainedMass",
        "totalNutrient",
        "drainedRetainedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drainedYield: { type: "number" },
        drainedConcentration: { type: "number" },
        wholeConcentration: { type: "number" },
      },
      required: ["drainedYield", "drainedConcentration", "wholeConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "wholeMass",
          label: "Whole Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainedMass",
          label: "Drained Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalNutrient",
          label: "Total Nutrient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainedRetainedFraction",
          label: "Drained Retained Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "drainedYield",
          label: "Drained Yield",
          valueType: { type: "number" },
        },
        {
          id: "drainedConcentration",
          label: "Drained Concentration",
          valueType: { type: "number" },
        },
        {
          id: "wholeConcentration",
          label: "Whole Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutritionLabelDrainedWholeBasisTool.execute;
export default nutritionLabelDrainedWholeBasisTool;
