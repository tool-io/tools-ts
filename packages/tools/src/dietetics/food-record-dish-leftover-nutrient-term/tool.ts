import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly servedMass: number;
  readonly leftoverMass: number;
  readonly nutrientPerMass: number;
};
export type Output = {
  readonly consumedMass: number;
  readonly consumedNutrient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    servedMass: { type: "number" },
    leftoverMass: { type: "number", minimum: 0 },
    nutrientPerMass: { type: "number", minimum: 0 },
  },
  required: ["servedMass", "leftoverMass", "nutrientPerMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedMass: { type: "number" },
    consumedNutrient: { type: "number" },
  },
  required: ["consumedMass", "consumedNutrient"],
} as const;
/** Calculate food record dish leftover nutrient term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { servedMass, leftoverMass, nutrientPerMass } = request;
  const compute = (): Output => {
    H.domain(
      leftoverMass >= 0 && servedMass >= leftoverMass && nutrientPerMass >= 0,
    );
    return {
      consumedMass: servedMass - leftoverMass,
      consumedNutrient: (servedMass - leftoverMass) * nutrientPerMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { servedMass: 300, leftoverMass: 50, nutrientPerMass: 0.2 },
  output: { consumedMass: 250, consumedNutrient: 50 },
} satisfies ToolExample<Input, Output>;
export const foodRecordDishLeftoverNutrientTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/food-record-dish-leftover-nutrient-term",
    title: "Food Record Dish Leftover Nutrient Term Tool",
    description:
      "Calculate food record dish leftover nutrient term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        servedMass: { type: "number" },
        leftoverMass: { type: "number", minimum: 0 },
        nutrientPerMass: { type: "number", minimum: 0 },
      },
      required: ["servedMass", "leftoverMass", "nutrientPerMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedMass: { type: "number" },
        consumedNutrient: { type: "number" },
      },
      required: ["consumedMass", "consumedNutrient"],
    },
    ports: {
      inputs: [
        {
          id: "servedMass",
          label: "Served Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftoverMass",
          label: "Leftover Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientPerMass",
          label: "Nutrient Per Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "consumedMass",
          label: "Consumed Mass",
          valueType: { type: "number" },
        },
        {
          id: "consumedNutrient",
          label: "Consumed Nutrient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodRecordDishLeftoverNutrientTermTool.execute;
export default foodRecordDishLeftoverNutrientTermTool;
