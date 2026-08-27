import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodSpecificGravityInput = {
  readonly ovenDryMassG: number;
  readonly waterDisplacementVolumeCm3: number;
};

export type WoodSpecificGravityOutput = {
  readonly specificGravity: number;
};

export const woodSpecificGravityExample = {
  input: { ovenDryMassG: 600, waterDisplacementVolumeCm3: 750 },
  output: { specificGravity: 0.8 },
} satisfies ToolExample<WoodSpecificGravityInput, WoodSpecificGravityOutput>;

export const woodSpecificGravityTool = createSimpleTool({
  id: "biology/wood-specific-gravity",
  title: "Wood Specific Gravity",
  description:
    "Compute wood specific gravity as oven dry mass divided by water displacement volume in cubic centimetres.",
  inputs: [
    {
      id: "ovenDryMassG",
      kind: "number",
      label: "Oven dry mass",
      unit: "g",
    },
    {
      id: "waterDisplacementVolumeCm3",
      kind: "number",
      label: "Water displacement volume",
      unit: "cm³",
    },
  ],
  outputs: [
    {
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
    },
  ],
  calculate: (input) => {
    const ovenDryMassG = input.ovenDryMassG as number;
    const waterDisplacementVolumeCm3 =
      input.waterDisplacementVolumeCm3 as number;
    if (!(ovenDryMassG > 0))
      simpleError(
        "ovenDryMassG",
        "The oven dry mass must be greater than zero.",
      );
    if (!(waterDisplacementVolumeCm3 > 0))
      simpleError(
        "waterDisplacementVolumeCm3",
        "The water displacement volume must be greater than zero.",
      );
    return { specificGravity: ovenDryMassG / waterDisplacementVolumeCm3 };
  },
});
export const runWoodSpecificGravity = woodSpecificGravityTool.execute;
export default woodSpecificGravityTool;
