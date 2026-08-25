import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type StandardDrinkUnitsInput = {
  readonly abvPercent: number;
  readonly standardDrinkMl?: number;
  readonly volumeMl: number;
};

export type StandardDrinkUnitsOutput = {
  readonly standardDrinks: number;
};

export const standardDrinkUnitsExample = {
  input: {
    abvPercent: 12,
    standardDrinkMl: 17.7,
    volumeMl: 150,
  },
  output: {
    standardDrinks: 1.01694915254,
  },
} satisfies ToolExample<StandardDrinkUnitsInput, StandardDrinkUnitsOutput>;

const US_STANDARD_DRINK_ML_ETHANOL = 17.7;

export const calculateStandardDrinkUnits = (
  input: StandardDrinkUnitsInput,
): StandardDrinkUnitsOutput => {
  const standard = input.standardDrinkMl ?? US_STANDARD_DRINK_ML_ETHANOL;
  if (standard <= 0)
    simpleError(
      "standardDrinkMl",
      "The standard drink size must be positive.",
      "invalid_value",
    );
  const ethanolMl = (input.volumeMl * input.abvPercent) / 100;
  return {
    standardDrinks: roundStatistic(ethanolMl / standard),
  };
};

export const standardDrinkUnitsTool = createSimpleTool({
  calculate: (input) =>
    calculateStandardDrinkUnits(input as unknown as StandardDrinkUnitsInput),
  description:
    "Convert a poured glass into standard drink units from its ethanol content.",
  id: "oenology/standard-drink-units",
  inputs: [
    {
      description: "Alcohol by volume of the pour.",
      id: "abvPercent",
      kind: "number",
      label: "ABV",
      minimum: 0,
      unit: "%",
    },
    {
      default: 17.7,
      description:
        "Pure ethanol per standard drink; the United States guideline is seventeen point seven milliliters.",
      id: "standardDrinkMl",
      kind: "number",
      label: "Standard drink",
      minimum: 0,
      unit: "mL",
    },
    {
      description: "Volume of the pour.",
      id: "volumeMl",
      kind: "number",
      label: "Pour volume",
      minimum: 0,
      unit: "mL",
    },
  ],
  outputs: [
    {
      description: "Standard drinks represented by the pour.",
      id: "standardDrinks",
      kind: "number",
      label: "Standard drinks",
    },
  ],
  title: "Standard Drink Units Calculator",
});
export const runStandardDrinkUnits = standardDrinkUnitsTool.execute;
export default standardDrinkUnitsTool;
