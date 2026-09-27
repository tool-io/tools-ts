import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flourMass: number;
  readonly addedWater: number;
  readonly otherIngredientWater: number;
  readonly flourWater: number;
  readonly includeFlourWater: boolean;
};
export type Output = {
  readonly waterOnBasis: number;
  readonly hydrationPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flourMass: { type: "number", exclusiveMinimum: 0 },
    addedWater: { type: "number", minimum: 0 },
    otherIngredientWater: { type: "number", minimum: 0 },
    flourWater: { type: "number", minimum: 0 },
    includeFlourWater: { type: "boolean" },
  },
  required: [
    "flourMass",
    "addedWater",
    "otherIngredientWater",
    "flourWater",
    "includeFlourWater",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterOnBasis: { type: "number" },
    hydrationPercent: { type: "number" },
  },
  required: ["waterOnBasis", "hydrationPercent"],
} as const;
/** Explicit flour-mass denominator and caller-selected inclusion of flour moisture. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    flourMass,
    addedWater,
    otherIngredientWater,
    flourWater,
    includeFlourWater,
  } = request;
  const compute = (): Output => {
    H.positive(flourMass);
    H.domain(
      addedWater >= 0 &&
        otherIngredientWater >= 0 &&
        flourWater >= 0 &&
        flourWater <= flourMass,
    );
    return {
      waterOnBasis:
        addedWater +
        otherIngredientWater +
        (includeFlourWater ? flourWater : 0),
      hydrationPercent:
        (100 *
          (addedWater +
            otherIngredientWater +
            (includeFlourWater ? flourWater : 0))) /
        flourMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flourMass: 1000,
    addedWater: 600,
    otherIngredientWater: 50,
    flourWater: 100,
    includeFlourWater: false,
  },
  output: { waterOnBasis: 650, hydrationPercent: 65 },
} satisfies ToolExample<Input, Output>;
export const doughHydrationFlourBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/dough-hydration-flour-basis-factor",
    title: "Dough Hydration Flour Basis Factor Tool",
    description:
      "Explicit flour-mass denominator and caller-selected inclusion of flour moisture.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flourMass: { type: "number", exclusiveMinimum: 0 },
        addedWater: { type: "number", minimum: 0 },
        otherIngredientWater: { type: "number", minimum: 0 },
        flourWater: { type: "number", minimum: 0 },
        includeFlourWater: { type: "boolean" },
      },
      required: [
        "flourMass",
        "addedWater",
        "otherIngredientWater",
        "flourWater",
        "includeFlourWater",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterOnBasis: { type: "number" },
        hydrationPercent: { type: "number" },
      },
      required: ["waterOnBasis", "hydrationPercent"],
    },
    ports: {
      inputs: [
        {
          id: "flourMass",
          label: "Flour Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedWater",
          label: "Added Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherIngredientWater",
          label: "Other Ingredient Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flourWater",
          label: "Flour Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeFlourWater",
          label: "Include Flour Water",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "waterOnBasis",
          label: "Water On Basis",
          valueType: { type: "number" },
        },
        {
          id: "hydrationPercent",
          label: "Hydration Percent",
          valueType: { type: "number", unit: "%" },
        },
      ],
    },
  },
  calculate,
});
export const run = doughHydrationFlourBasisFactorTool.execute;
export default doughHydrationFlourBasisFactorTool;
