import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossWeight: number;
  readonly inedibleWeight: number;
  readonly suppliedNutrientPerWeight: number;
  readonly nutrientIsEdibleBasis: boolean;
};
export type Output = {
  readonly edibleWeight: number;
  readonly nutrientEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossWeight: { type: "number", minimum: 0 },
    inedibleWeight: { type: "number", minimum: 0 },
    suppliedNutrientPerWeight: { type: "number" },
    nutrientIsEdibleBasis: { type: "boolean" },
  },
  required: [
    "grossWeight",
    "inedibleWeight",
    "suppliedNutrientPerWeight",
    "nutrientIsEdibleBasis",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleWeight: { type: "number" },
    nutrientEquivalent: { type: "number" },
  },
  required: ["edibleWeight", "nutrientEquivalent"],
} as const;
/** Apply a supplied edible/gross weight basis without inferring dietary adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    grossWeight,
    inedibleWeight,
    suppliedNutrientPerWeight,
    nutrientIsEdibleBasis,
  } = request;
  const compute = (): Output => {
    H.domain(
      grossWeight >= 0 && inedibleWeight >= 0 && inedibleWeight <= grossWeight,
    );
    return {
      edibleWeight: grossWeight - inedibleWeight,
      nutrientEquivalent:
        (nutrientIsEdibleBasis ? grossWeight - inedibleWeight : grossWeight) *
        suppliedNutrientPerWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossWeight: 10,
    inedibleWeight: 2,
    suppliedNutrientPerWeight: 100,
    nutrientIsEdibleBasis: true,
  },
  output: { edibleWeight: 8, nutrientEquivalent: 800 },
} satisfies ToolExample<Input, Output>;
export const foodBasketInedibleWeightBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-basket-inedible-weight-base",
    title: "Food Basket Inedible Weight Base Tool",
    description:
      "Apply a supplied edible/gross weight basis without inferring dietary adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossWeight: { type: "number", minimum: 0 },
        inedibleWeight: { type: "number", minimum: 0 },
        suppliedNutrientPerWeight: { type: "number" },
        nutrientIsEdibleBasis: { type: "boolean" },
      },
      required: [
        "grossWeight",
        "inedibleWeight",
        "suppliedNutrientPerWeight",
        "nutrientIsEdibleBasis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edibleWeight: { type: "number" },
        nutrientEquivalent: { type: "number" },
      },
      required: ["edibleWeight", "nutrientEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "grossWeight",
          label: "Gross Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inedibleWeight",
          label: "Inedible Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNutrientPerWeight",
          label: "Supplied Nutrient Per Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientIsEdibleBasis",
          label: "Nutrient Is Edible Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "edibleWeight",
          label: "Edible Weight",
          valueType: { type: "number" },
        },
        {
          id: "nutrientEquivalent",
          label: "Nutrient Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodBasketInedibleWeightBaseTool.execute;
export default foodBasketInedibleWeightBaseTool;
