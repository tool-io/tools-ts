import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasingBiaxialStressInput = {
  readonly nominalCollapsePressureMegapascals: number;
  readonly yieldStrengthMegapascals: number;
  readonly axialTensileLoadKilonewtons: number;
  readonly crossSectionalAreaSquareMillimetres: number;
};

export type CasingBiaxialStressOutput = {
  readonly axialStressMegapascals: number;
  readonly axialStressToYieldRatio: number;
  readonly deratedCollapsePressureMegapascals: number;
};

export const calculateCasingBiaxialStress = (
  input: CasingBiaxialStressInput,
): CasingBiaxialStressOutput => {
  if (!(input.nominalCollapsePressureMegapascals > 0))
    return simpleError(
      "nominalCollapsePressureMegapascals",
      "Nominal collapse pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(input.yieldStrengthMegapascals > 0))
    return simpleError(
      "yieldStrengthMegapascals",
      "Yield strength must be greater than zero.",
      "invalid_strength",
    );
  if (!(input.crossSectionalAreaSquareMillimetres > 0))
    return simpleError(
      "crossSectionalAreaSquareMillimetres",
      "Cross-sectional area must be greater than zero.",
      "invalid_geometry",
    );
  const axialStress =
    (input.axialTensileLoadKilonewtons * 1000) /
    input.crossSectionalAreaSquareMillimetres;
  const ratio = axialStress / input.yieldStrengthMegapascals;
  if (!(ratio < 1))
    return simpleError(
      "axialTensileLoadKilonewtons",
      "Axial stress must remain below the casing yield strength.",
      "invalid_load",
    );
  return {
    axialStressMegapascals: axialStress,
    axialStressToYieldRatio: ratio,
    deratedCollapsePressureMegapascals:
      input.nominalCollapsePressureMegapascals *
      (Math.sqrt(1 - 0.75 * ratio * ratio) - 0.5 * ratio),
  };
};

export const casingBiaxialStressExample = {
  input: {
    nominalCollapsePressureMegapascals: 40,
    yieldStrengthMegapascals: 551.6,
    axialTensileLoadKilonewtons: 1800,
    crossSectionalAreaSquareMillimetres: 9714,
  },
  output: {
    axialStressMegapascals: 185.2995676343422,
    axialStressToYieldRatio: 0.3359310508236805,
    deratedCollapsePressureMegapascals: 31.551215603389263,
  },
} satisfies ToolExample<CasingBiaxialStressInput, CasingBiaxialStressOutput>;

export const casingBiaxialStressTool = createSimpleTool({
  id: "geology/casing-biaxial-stress",
  title: "Casing Biaxial Stress Calculator",
  description:
    "Derate the nominal collapse pressure of casing for combined axial tension using the API biaxial correction.",
  inputs: [
    {
      description:
        "Nominal collapse pressure without axial load in megapascals.",
      id: "nominalCollapsePressureMegapascals",
      kind: "number",
      label: "Nominal collapse",
    },
    {
      description: "Casing minimum yield strength in megapascals.",
      id: "yieldStrengthMegapascals",
      kind: "number",
      label: "Yield strength",
    },
    {
      description: "Axial tensile load in kilonewtons.",
      id: "axialTensileLoadKilonewtons",
      kind: "number",
      label: "Axial load",
    },
    {
      description: "Casing cross-sectional area in square millimetres.",
      id: "crossSectionalAreaSquareMillimetres",
      kind: "number",
      label: "Area",
    },
  ],
  outputs: [
    {
      description: "Axial stress in megapascals.",
      id: "axialStressMegapascals",
      kind: "number",
      label: "Axial stress",
    },
    {
      description: "Ratio of axial stress to yield strength.",
      id: "axialStressToYieldRatio",
      kind: "number",
      label: "Stress ratio",
    },
    {
      description: "Biaxially corrected collapse pressure in megapascals.",
      id: "deratedCollapsePressureMegapascals",
      kind: "number",
      label: "Corrected collapse",
    },
  ],
  calculate: (input) =>
    calculateCasingBiaxialStress(input as unknown as CasingBiaxialStressInput),
});

export const runCasingBiaxialStress = casingBiaxialStressTool.execute;
export default casingBiaxialStressTool;
