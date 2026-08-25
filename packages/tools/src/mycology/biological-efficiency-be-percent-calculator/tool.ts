import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiologicalEfficiencyBePercentCalculatorInput = {
  readonly freshMushroomMassG: number;
  readonly substrateDryMassG: number;
};

export type BiologicalEfficiencyBePercentCalculatorOutput = {
  readonly biologicalEfficiencyPercent: number;
};

export const biologicalEfficiencyBePercentCalculatorExample = {
  input: { freshMushroomMassG: 500, substrateDryMassG: 1000 },
  output: { biologicalEfficiencyPercent: 50 },
} satisfies ToolExample<
  BiologicalEfficiencyBePercentCalculatorInput,
  BiologicalEfficiencyBePercentCalculatorOutput
>;

export const calculateBiologicalEfficiencyBePercentCalculator = (
  input: BiologicalEfficiencyBePercentCalculatorInput,
): BiologicalEfficiencyBePercentCalculatorOutput => {
  if (!Number.isFinite(input.substrateDryMassG) || input.substrateDryMassG <= 0)
    return simpleError(
      "substrateDryMassG",
      "Substrate dry mass must be greater than zero.",
    );
  if (
    !Number.isFinite(input.freshMushroomMassG) ||
    input.freshMushroomMassG < 0
  )
    return simpleError(
      "freshMushroomMassG",
      "Fresh mushroom mass must be finite and non-negative.",
    );
  const biologicalEfficiencyPercent =
    (input.freshMushroomMassG / input.substrateDryMassG) * 100;
  if (!Number.isFinite(biologicalEfficiencyPercent))
    return simpleError(
      "freshMushroomMassG",
      "The biological efficiency is outside the representable range.",
    );
  return { biologicalEfficiencyPercent };
};

export const biologicalEfficiencyBePercentCalculatorTool = createSimpleTool({
  id: "mycology/biological-efficiency-be-percent-calculator",
  title: "Biological Efficiency %",
  description:
    "Compute biological efficiency percent as fresh mushroom mass divided by dry substrate mass times one hundred.",
  inputs: [
    {
      id: "freshMushroomMassG",
      label: "Fresh mushroom mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      id: "substrateDryMassG",
      label: "Substrate dry mass",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "biologicalEfficiencyPercent",
      label: "Biological efficiency percent",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBiologicalEfficiencyBePercentCalculator({
      freshMushroomMassG: input.freshMushroomMassG as number,
      substrateDryMassG: input.substrateDryMassG as number,
    }),
});
export const runBiologicalEfficiencyBePercentCalculator =
  biologicalEfficiencyBePercentCalculatorTool.execute;
export default biologicalEfficiencyBePercentCalculatorTool;
