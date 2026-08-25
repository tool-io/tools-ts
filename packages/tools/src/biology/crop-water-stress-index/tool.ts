import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CropWaterStressIndexInput = {
  readonly canopyTempC: number;
  readonly dryReferenceTempC: number;
  readonly wetReferenceTempC: number;
};

export type CropWaterStressIndexOutput = {
  readonly cropWaterStressIndex: number;
};

export const cropWaterStressIndexExample = {
  input: { canopyTempC: 28, dryReferenceTempC: 32, wetReferenceTempC: 22 },
  output: { cropWaterStressIndex: 0.6 },
} satisfies ToolExample<CropWaterStressIndexInput, CropWaterStressIndexOutput>;

export const cropWaterStressIndexTool = createSimpleTool({
  id: "biology/crop-water-stress-index",
  title: "CWSI Calculator",
  description:
    "Compute the crop water stress index as (canopy temperature - wet reference temperature) / (dry reference temperature - wet reference temperature), clamped to the range zero through one.",
  inputs: [
    {
      description: "Canopy temperature in degrees Celsius.",
      id: "canopyTempC",
      kind: "number",
      label: "Canopy temperature",
      unit: "°C",
    },
    {
      description:
        "Fully watered dry reference temperature; must exceed the wet reference.",
      id: "dryReferenceTempC",
      kind: "number",
      label: "Dry reference temperature",
      unit: "°C",
    },
    {
      description: "Wet reference temperature in degrees Celsius.",
      id: "wetReferenceTempC",
      kind: "number",
      label: "Wet reference temperature",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Crop water stress index clamped between 0 and 1.",
      id: "cropWaterStressIndex",
      kind: "number",
      label: "Crop water stress index",
    },
  ],
  calculate: (input) => {
    const canopyTempC = input.canopyTempC as number;
    const dryReferenceTempC = input.dryReferenceTempC as number;
    const wetReferenceTempC = input.wetReferenceTempC as number;
    if (!(dryReferenceTempC > wetReferenceTempC))
      simpleError(
        "dryReferenceTempC",
        "The dry reference temperature must be greater than the wet reference temperature.",
        "invalid_references",
      );
    return {
      cropWaterStressIndex: Math.min(
        1,
        Math.max(
          0,
          (canopyTempC - wetReferenceTempC) /
            (dryReferenceTempC - wetReferenceTempC),
        ),
      ),
    };
  },
});
export const runCropWaterStressIndex = cropWaterStressIndexTool.execute;
export default cropWaterStressIndexTool;
