import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasingCollapsePressureInput = {
  readonly yieldStrengthMegapascals: number;
  readonly outsideDiameterMillimetres: number;
  readonly wallThicknessMillimetres: number;
};

export type CasingCollapsePressureOutput = {
  readonly diameterToWallRatio: number;
  readonly collapsePressureMegapascals: number;
};

export const calculateCasingCollapsePressure = (
  input: CasingCollapsePressureInput,
): CasingCollapsePressureOutput => {
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
    collapsePressureMegapascals:
      (2 * input.yieldStrengthMegapascals * input.wallThicknessMillimetres) /
      input.outsideDiameterMillimetres,
  };
};

export const casingCollapsePressureExample = {
  input: {
    yieldStrengthMegapascals: 551.6,
    outsideDiameterMillimetres: 244.48,
    wallThicknessMillimetres: 13.84,
  },
  output: {
    diameterToWallRatio: 17.664739884393065,
    collapsePressureMegapascals: 62.4520942408377,
  },
} satisfies ToolExample<
  CasingCollapsePressureInput,
  CasingCollapsePressureOutput
>;

export const casingCollapsePressureTool = createSimpleTool({
  id: "geology/casing-collapse-pressure",
  title: "Casing Collapse Pressure Calculator",
  description:
    "Compute the thin-wall external collapse resistance of casing from yield strength, outside diameter and wall thickness.",
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
      description: "Wall thickness in millimetres.",
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
      description: "Collapse pressure in megapascals.",
      id: "collapsePressureMegapascals",
      kind: "number",
      label: "Collapse pressure",
    },
  ],
  calculate: (input) =>
    calculateCasingCollapsePressure(
      input as unknown as CasingCollapsePressureInput,
    ),
});

export const runCasingCollapsePressure = casingCollapsePressureTool.execute;
export default casingCollapsePressureTool;
