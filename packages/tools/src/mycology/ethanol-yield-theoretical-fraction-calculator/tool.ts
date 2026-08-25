import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EthanolYieldTheoreticalFractionCalculatorInput = {
  readonly ethanolGramsActual: number;
  readonly glucoseGramsConsumed: number;
};

export type EthanolYieldTheoreticalFractionCalculatorOutput = {
  readonly yieldPercentOfTheory: number;
};

export const THEORETICAL_YIELD_GRAMS_PER_GRAM = 0.51;

export const ethanolYieldTheoreticalFractionCalculatorExample = {
  input: { ethanolGramsActual: 8, glucoseGramsConsumed: 20 },
  output: { yieldPercentOfTheory: (8 / 20 / 0.51) * 100 },
} satisfies ToolExample<
  EthanolYieldTheoreticalFractionCalculatorInput,
  EthanolYieldTheoreticalFractionCalculatorOutput
>;

export const ethanolYieldTheoreticalFractionCalculatorTool = createSimpleTool({
  id: "mycology/ethanol-yield-theoretical-fraction-calculator",
  title: "Theoretical Ethanol Yield",
  description:
    "Expresses ethanol production as a percent of the theoretical 0.51 gram-per-gram yield.",
  inputs: [
    {
      id: "ethanolGramsActual",
      kind: "number",
      label: "Ethanol produced",
      minimum: 0,
      unit: "g",
    },
    {
      id: "glucoseGramsConsumed",
      kind: "number",
      label: "Glucose consumed",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "yieldPercentOfTheory",
      kind: "number",
      label: "Yield percent of theory",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) => {
    const ethanolGramsActual = input.ethanolGramsActual as number;
    const glucoseGramsConsumed = input.glucoseGramsConsumed as number;
    if (!(glucoseGramsConsumed > 0))
      simpleError(
        "glucoseGramsConsumed",
        "Glucose consumed must be greater than zero grams.",
        "invalid_masses",
      );
    const yieldPercentOfTheory =
      (ethanolGramsActual /
        glucoseGramsConsumed /
        THEORETICAL_YIELD_GRAMS_PER_GRAM) *
      100;
    if (!Number.isFinite(yieldPercentOfTheory))
      simpleError(
        "ethanolGramsActual",
        "The calculated yield is too large to represent.",
        "invalid_masses",
      );
    return { yieldPercentOfTheory };
  },
});
export const runEthanolYieldTheoreticalFractionCalculator =
  ethanolYieldTheoreticalFractionCalculatorTool.execute;
export default ethanolYieldTheoreticalFractionCalculatorTool;
