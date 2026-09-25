import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oilAdded: number;
  readonly oilRecovered: number;
  readonly nonfoodLoss: number;
  readonly cookedFoodMass: number;
};
export type Output = {
  readonly absorbedOil: number;
  readonly oilPerFoodMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oilAdded: { type: "number" },
    oilRecovered: { type: "number", minimum: 0 },
    nonfoodLoss: { type: "number", minimum: 0 },
    cookedFoodMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["oilAdded", "oilRecovered", "nonfoodLoss", "cookedFoodMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absorbedOil: { type: "number" },
    oilPerFoodMass: { type: "number" },
  },
  required: ["absorbedOil", "oilPerFoodMass"],
} as const;
/** Calculate recipe oil absorption measured term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oilAdded, oilRecovered, nonfoodLoss, cookedFoodMass } = request;
  const compute = (): Output => {
    H.domain(
      oilRecovered >= 0 &&
        nonfoodLoss >= 0 &&
        oilAdded >= oilRecovered + nonfoodLoss,
    );
    H.positive(cookedFoodMass);
    return {
      absorbedOil: oilAdded - oilRecovered - nonfoodLoss,
      oilPerFoodMass: (oilAdded - oilRecovered - nonfoodLoss) / cookedFoodMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oilAdded: 100,
    oilRecovered: 60,
    nonfoodLoss: 10,
    cookedFoodMass: 500,
  },
  output: { absorbedOil: 30, oilPerFoodMass: 0.06 },
} satisfies ToolExample<Input, Output>;
export const recipeOilAbsorptionMeasuredTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/recipe-oil-absorption-measured-term",
    title: "Recipe Oil Absorption Measured Term Tool",
    description:
      "Calculate recipe oil absorption measured term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oilAdded: { type: "number" },
        oilRecovered: { type: "number", minimum: 0 },
        nonfoodLoss: { type: "number", minimum: 0 },
        cookedFoodMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["oilAdded", "oilRecovered", "nonfoodLoss", "cookedFoodMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absorbedOil: { type: "number" },
        oilPerFoodMass: { type: "number" },
      },
      required: ["absorbedOil", "oilPerFoodMass"],
    },
    ports: {
      inputs: [
        {
          id: "oilAdded",
          label: "Oil Added",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oilRecovered",
          label: "Oil Recovered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonfoodLoss",
          label: "Nonfood Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cookedFoodMass",
          label: "Cooked Food Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absorbedOil",
          label: "Absorbed Oil",
          valueType: { type: "number" },
        },
        {
          id: "oilPerFoodMass",
          label: "Oil Per Food Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recipeOilAbsorptionMeasuredTermTool.execute;
export default recipeOilAbsorptionMeasuredTermTool;
