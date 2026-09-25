import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawMass: number;
  readonly cookedMass: number;
  readonly rawNutrientPerMass: number;
  readonly retainedFraction: number;
};
export type Output = {
  readonly massYield: number;
  readonly cookedNutrientPerMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawMass: { type: "number", exclusiveMinimum: 0 },
    cookedMass: { type: "number", exclusiveMinimum: 0 },
    rawNutrientPerMass: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["rawMass", "cookedMass", "rawNutrientPerMass", "retainedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massYield: { type: "number" },
    cookedNutrientPerMass: { type: "number" },
  },
  required: ["massYield", "cookedNutrientPerMass"],
} as const;
/** Calculate nutrition database cooked raw yield from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawMass, cookedMass, rawNutrientPerMass, retainedFraction } = request;
  const compute = (): Output => {
    H.positive(rawMass);
    H.positive(cookedMass);
    H.domain(rawNutrientPerMass >= 0);
    H.probability(retainedFraction);
    return {
      massYield: cookedMass / rawMass,
      cookedNutrientPerMass:
        (rawMass * rawNutrientPerMass * retainedFraction) / cookedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rawMass: 100,
    cookedMass: 80,
    rawNutrientPerMass: 0.2,
    retainedFraction: 0.9,
  },
  output: { massYield: 0.8, cookedNutrientPerMass: 0.225 },
} satisfies ToolExample<Input, Output>;
export const nutritionDatabaseCookedRawYieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrition-database-cooked-raw-yield",
    title: "Nutrition Database Cooked Raw Yield Tool",
    description:
      "Calculate nutrition database cooked raw yield from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawMass: { type: "number", exclusiveMinimum: 0 },
        cookedMass: { type: "number", exclusiveMinimum: 0 },
        rawNutrientPerMass: { type: "number", minimum: 0 },
        retainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "rawMass",
        "cookedMass",
        "rawNutrientPerMass",
        "retainedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massYield: { type: "number" },
        cookedNutrientPerMass: { type: "number" },
      },
      required: ["massYield", "cookedNutrientPerMass"],
    },
    ports: {
      inputs: [
        {
          id: "rawMass",
          label: "Raw Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cookedMass",
          label: "Cooked Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rawNutrientPerMass",
          label: "Raw Nutrient Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "massYield", label: "Mass Yield", valueType: { type: "number" } },
        {
          id: "cookedNutrientPerMass",
          label: "Cooked Nutrient Per Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutritionDatabaseCookedRawYieldTool.execute;
export default nutritionDatabaseCookedRawYieldTool;
