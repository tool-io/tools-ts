import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MohrCircleCenterInput = {
  readonly sigma1MPa: number;
  readonly sigma3MPa: number;
};

export type MohrCircleCenterOutput = {
  readonly centerNormalStressMPa: number;
};

export const calculateMohrCircleCenter = (
  input: MohrCircleCenterInput,
): MohrCircleCenterOutput => {
  const { sigma1MPa, sigma3MPa } = input;
  if (!(sigma1MPa >= sigma3MPa))
    simpleError(
      "sigma3MPa",
      "The major principal stress must be greater than or equal to the minor principal stress.",
      "invalid_stress",
    );
  return { centerNormalStressMPa: (sigma1MPa + sigma3MPa) / 2 };
};

export const mohrCircleCenterExample = {
  input: { sigma1MPa: 120, sigma3MPa: 40 },
  output: { centerNormalStressMPa: 80 },
} satisfies ToolExample<MohrCircleCenterInput, MohrCircleCenterOutput>;

export const mohrCircleCenterTool = createSimpleTool({
  id: "geology/mohr-circle-center",
  title: "Mohr Circle Center Calculator",
  description:
    "Center of the Mohr circle for two principal stresses: sigma_center = (sigma_1 + sigma_3) / 2 on the normal-stress axis.",
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
      description: "Normal stress at the circle center in megapascals.",
      id: "centerNormalStressMPa",
      kind: "number",
      label: "Center",
      unit: "MPa",
    },
  ],
  calculate: (input) =>
    calculateMohrCircleCenter(input as unknown as MohrCircleCenterInput),
});

export const runMohrCircleCenter = mohrCircleCenterTool.execute;
export default mohrCircleCenterTool;
