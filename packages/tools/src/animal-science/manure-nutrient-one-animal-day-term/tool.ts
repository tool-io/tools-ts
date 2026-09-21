import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly animals: number;
  readonly days: number;
  readonly manurePerAnimalDay: number;
  readonly nutrientFraction: number;
  readonly retainedFraction: number;
};
export type Output = {
  readonly manureMass: number;
  readonly retainedNutrient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    animals: { type: "integer", minimum: 0 },
    days: { type: "number", minimum: 0 },
    manurePerAnimalDay: { type: "number", minimum: 0 },
    nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "animals",
    "days",
    "manurePerAnimalDay",
    "nutrientFraction",
    "retainedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manureMass: { type: "number" },
    retainedNutrient: { type: "number" },
  },
  required: ["manureMass", "retainedNutrient"],
} as const;
/** Calculate manure nutrient one animal day term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    animals,
    days,
    manurePerAnimalDay,
    nutrientFraction,
    retainedFraction,
  } = request;
  const compute = (): Output => {
    H.integer(animals, 0);
    H.domain(days >= 0 && manurePerAnimalDay >= 0);
    H.probability(nutrientFraction);
    H.probability(retainedFraction);
    return {
      manureMass: animals * days * manurePerAnimalDay,
      retainedNutrient:
        animals *
        days *
        manurePerAnimalDay *
        nutrientFraction *
        retainedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    animals: 10,
    days: 5,
    manurePerAnimalDay: 20,
    nutrientFraction: 0.01,
    retainedFraction: 0.8,
  },
  output: { manureMass: 1000, retainedNutrient: 8 },
} satisfies ToolExample<Input, Output>;
export const manureNutrientOneAnimalDayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/manure-nutrient-one-animal-day-term",
    title: "Manure Nutrient One Animal Day Term Tool",
    description:
      "Calculate manure nutrient one animal day term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        animals: { type: "integer", minimum: 0 },
        days: { type: "number", minimum: 0 },
        manurePerAnimalDay: { type: "number", minimum: 0 },
        nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
        retainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "animals",
        "days",
        "manurePerAnimalDay",
        "nutrientFraction",
        "retainedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manureMass: { type: "number" },
        retainedNutrient: { type: "number" },
      },
      required: ["manureMass", "retainedNutrient"],
    },
    ports: {
      inputs: [
        {
          id: "animals",
          label: "Animals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "manurePerAnimalDay",
          label: "Manure Per Animal Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientFraction",
          label: "Nutrient Fraction",
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
        {
          id: "manureMass",
          label: "Manure Mass",
          valueType: { type: "number" },
        },
        {
          id: "retainedNutrient",
          label: "Retained Nutrient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = manureNutrientOneAnimalDayTermTool.execute;
export default manureNutrientOneAnimalDayTermTool;
