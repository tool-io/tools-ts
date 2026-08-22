import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContingencyFuelPercentageInput = {
  readonly contingencyPercent?: number;
  readonly tripFuelKg: number;
};

export type ContingencyFuelPercentageOutput = {
  readonly contingencyFuelKg: number;
};

const DEFAULT_CONTINGENCY_PERCENT = 5;

export const contingencyFuelPercentageExample = {
  input: { contingencyPercent: 5, tripFuelKg: 8000 },
  output: { contingencyFuelKg: 400 },
} satisfies ToolExample<
  ContingencyFuelPercentageInput,
  ContingencyFuelPercentageOutput
>;

export const calculateContingencyFuelPercentage = (
  input: ContingencyFuelPercentageInput,
): ContingencyFuelPercentageOutput => {
  const percent = input.contingencyPercent ?? DEFAULT_CONTINGENCY_PERCENT;
  if (input.tripFuelKg <= 0)
    simpleError(
      "tripFuelKg",
      "The trip fuel must be positive.",
      "invalid_fuel",
    );
  if (percent < 0 || percent > 20)
    simpleError(
      "contingencyPercent",
      "The contingency percentage must be between 0 and 20.",
      "invalid_percent",
    );
  return { contingencyFuelKg: (input.tripFuelKg * percent) / 100 };
};

export const contingencyFuelPercentageTool = createSimpleTool({
  calculate: (input) =>
    calculateContingencyFuelPercentage(
      input as unknown as ContingencyFuelPercentageInput,
    ),
  description:
    "Compute the contingency allowance as a percentage of the planned trip fuel.",
  id: "aviation/contingency-fuel-percentage",
  inputs: [
    {
      description: "Fuel planned for the route.",
      id: "tripFuelKg",
      kind: "number",
      label: "Trip fuel",
      unit: "kg",
    },
    {
      default: 5,
      description:
        "Allowance percentage; five percent is a common planning figure and twenty is a typical ceiling.",
      id: "contingencyPercent",
      kind: "number",
      label: "Contingency percentage",
      maximum: 20,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Contingency fuel allowance.",
      format: "weight-kg",
      id: "contingencyFuelKg",
      kind: "number",
      label: "Contingency fuel",
      unit: "kg",
    },
  ],
  title: "Contingency Fuel Percentage Calculator",
});
export const runContingencyFuelPercentage =
  contingencyFuelPercentageTool.execute;
export default contingencyFuelPercentageTool;
