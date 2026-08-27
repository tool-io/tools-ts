import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MohrCircleRadiusInput = {
  readonly sigma1MPa: number;
  readonly sigma3MPa: number;
};

export type MohrCircleRadiusOutput = {
  readonly radiusMPa: number;
};

export const calculateMohrCircleRadius = (
  input: MohrCircleRadiusInput,
): MohrCircleRadiusOutput => {
  const { sigma1MPa, sigma3MPa } = input;
  if (!(sigma1MPa >= sigma3MPa))
    simpleError(
      "sigma3MPa",
      "The major principal stress must be greater than or equal to the minor principal stress.",
      "invalid_stress",
    );
  return { radiusMPa: (sigma1MPa - sigma3MPa) / 2 };
};

export const mohrCircleRadiusExample = {
  input: { sigma1MPa: 120, sigma3MPa: 40 },
  output: { radiusMPa: 40 },
} satisfies ToolExample<MohrCircleRadiusInput, MohrCircleRadiusOutput>;

export const mohrCircleRadiusTool = createSimpleTool({
  id: "geology/mohr-circle-radius",
  title: "Mohr Circle Radius Calculator",
  description:
    "Radius of the Mohr circle for two principal stresses: R = (sigma_1 - sigma_3) / 2, also the maximum shear stress.",
  inputs: [
    {
      description: "Major principal stress in megapascals.",
      id: "sigma1MPa",
      kind: "number",
      label: "sigma_1",
      unit: "MPa",
    },
    {
      description: "Minor principal stress in megapascals.",
      id: "sigma3MPa",
      kind: "number",
      label: "sigma_3",
      unit: "MPa",
    },
  ],
  outputs: [
    {
      description: "Circle radius (maximum shear stress) in megapascals.",
      id: "radiusMPa",
      kind: "number",
      label: "R",
      unit: "MPa",
    },
  ],
  calculate: (input) =>
    calculateMohrCircleRadius(input as unknown as MohrCircleRadiusInput),
});

export const runMohrCircleRadius = mohrCircleRadiusTool.execute;
export default mohrCircleRadiusTool;
