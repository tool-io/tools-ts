import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasingBurstPressureInput = {
  readonly yieldStrengthMegapascals: number;
  readonly outsideDiameterMillimetres: number;
  readonly wallThicknessMillimetres: number;
};

export type CasingBurstPressureOutput = {
  readonly diameterToWallRatio: number;
  readonly burstPressureMegapascals: number;
};

export const calculateCasingBurstPressure = (
  input: CasingBurstPressureInput,
): CasingBurstPressureOutput => {
  if (!(input.yieldStrengthMegapascals > 0))
    return simpleError(
      "yieldStrengthMegapascals",
      "Yield strength must be greater than zero.",
      "invalid_strength",
    );
  if (!(input.outsideDiameterMillimetres > 0))
    return simpleError(
      "outsideDiameterMillimetres",
      "Outside diameter must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.wallThicknessMillimetres > 0))
    return simpleError(
      "wallThicknessMillimetres",
      "Wall thickness must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.wallThicknessMillimetres < input.outsideDiameterMillimetres / 2))
    return simpleError(
      "wallThicknessMillimetres",
      "Thin-wall approximation requires wall thickness below half the outside diameter.",
      "invalid_geometry",
    );
  const ratio =
    input.outsideDiameterMillimetres / input.wallThicknessMillimetres;
  return {
    diameterToWallRatio: ratio,
    burstPressureMegapascals:
      (0.875 *
        2 *
        input.yieldStrengthMegapascals *
        input.wallThicknessMillimetres) /
      input.outsideDiameterMillimetres,
  };
};

export const casingBurstPressureExample = {
  input: {
    yieldStrengthMegapascals: 551.6,
    outsideDiameterMillimetres: 244.48,
    wallThicknessMillimetres: 13.84,
  },
  output: {
    diameterToWallRatio: 17.664739884393065,
    burstPressureMegapascals: 54.64558246073299,
  },
} satisfies ToolExample<CasingBurstPressureInput, CasingBurstPressureOutput>;

export const casingBurstPressureTool = createSimpleTool({
  id: "geology/casing-burst-pressure",
  title: "Casing Burst Pressure Calculator",
  description:
    "Compute the API-style internal burst resistance of casing using the Barlow formula with a 87.5 percent wall tolerance factor.",
  inputs: [
    {
      description: "Casing minimum yield strength in megapascals.",
      id: "yieldStrengthMegapascals",
      kind: "number",
      label: "Yield strength",
    },
    {
      description: "Outside diameter in millimetres.",
      id: "outsideDiameterMillimetres",
      kind: "number",
      label: "OD",
    },
    {
      description: "Nominal wall thickness in millimetres.",
      id: "wallThicknessMillimetres",
      kind: "number",
      label: "Wall",
    },
  ],
  outputs: [
    {
      description: "Ratio of outside diameter to wall thickness.",
      id: "diameterToWallRatio",
      kind: "number",
      label: "D/t",
    },
    {
      description: "Internal burst pressure in megapascals.",
      id: "burstPressureMegapascals",
      kind: "number",
      label: "Burst pressure",
    },
  ],
  calculate: (input) =>
    calculateCasingBurstPressure(input as unknown as CasingBurstPressureInput),
});

export const runCasingBurstPressure = casingBurstPressureTool.execute;
export default casingBurstPressureTool;
