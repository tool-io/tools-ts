import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalFractionationInput = {
  readonly bulkPartitionCoefficient: number;
  readonly fractionLiquidRemaining: number;
  readonly initialConcentrationPpm: number;
};

export type CrystalFractionationOutput = {
  readonly residualConcentrationPpm: number;
};

export const calculateCrystalFractionation = (
  input: CrystalFractionationInput,
): CrystalFractionationOutput => {
  if (!(input.initialConcentrationPpm > 0))
    simpleError(
      "initialConcentrationPpm",
      "Initial concentration must be greater than zero.",
      "invalid_concentration",
    );
  if (!(
    input.fractionLiquidRemaining > 0 && input.fractionLiquidRemaining <= 1
  ))
    simpleError(
      "fractionLiquidRemaining",
      "Fraction of liquid remaining must lie between 0 (exclusive) and 1 (inclusive).",
      "invalid_fraction",
    );
  if (!(input.bulkPartitionCoefficient >= 0))
    simpleError(
      "bulkPartitionCoefficient",
      "Bulk partition coefficient must be non-negative.",
      "invalid_partition",
    );
  return {
    residualConcentrationPpm:
      input.initialConcentrationPpm *
      Math.pow(
        input.fractionLiquidRemaining,
        input.bulkPartitionCoefficient - 1,
      ),
  };
};

export const crystalFractionationExample = {
  input: {
    bulkPartitionCoefficient: 2,
    fractionLiquidRemaining: 0.5,
    initialConcentrationPpm: 50,
  },
  output: { residualConcentrationPpm: 25 },
} satisfies ToolExample<CrystalFractionationInput, CrystalFractionationOutput>;

export const crystalFractionationTool = createSimpleTool({
  id: "geology/crystal-fractionation",
  title: "Crystal Fractionation Calculator",
  description:
    "Rayleigh fractional crystallization C_l = C_0 * F^(D-1) with F the fraction of liquid remaining and D the bulk partition coefficient; concentrations in ppm.",
  inputs: [
    {
      description: "Initial melt concentration in ppm.",
      id: "initialConcentrationPpm",
      kind: "number",
      label: "C0",
      minimum: 0,
    },
    {
      description:
        "Fraction of liquid remaining F, between 0 (exclusive) and 1.",
      id: "fractionLiquidRemaining",
      kind: "number",
      label: "F",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Bulk partition coefficient D (dimensionless).",
      id: "bulkPartitionCoefficient",
      kind: "number",
      label: "D",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Residual liquid concentration in ppm.",
      id: "residualConcentrationPpm",
      kind: "number",
      label: "Cl",
    },
  ],
  calculate: (input) =>
    calculateCrystalFractionation(
      input as unknown as CrystalFractionationInput,
    ),
});

export const runCrystalFractionation = crystalFractionationTool.execute;
export default crystalFractionationTool;
