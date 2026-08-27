import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RootLengthDensityInput = {
  readonly rootLengthCm: number;
  readonly soilVolumeCm3: number;
};

export type RootLengthDensityOutput = {
  readonly rootLengthDensity: number;
};

export const rootLengthDensityExample = {
  input: { rootLengthCm: 100, soilVolumeCm3: 40 },
  output: { rootLengthDensity: 2.5 },
} satisfies ToolExample<RootLengthDensityInput, RootLengthDensityOutput>;

export const rootLengthDensityTool = createSimpleTool({
  id: "biology/root-length-density",
  title: "Root Length Density",
  description:
    "Compute root length density RLD in centimetres per cubic centimetre of soil as root length divided by soil core volume.",
  inputs: [
    {
      id: "rootLengthCm",
      kind: "number",
      label: "Root length",
      unit: "cm",
    },
    {
      id: "soilVolumeCm3",
      kind: "number",
      label: "Soil volume",
      unit: "cm³",
    },
  ],
  outputs: [
    {
      id: "rootLengthDensity",
      kind: "number",
      label: "Root length density",
      unit: "cm/cm³",
    },
  ],
  calculate: (input) => {
    const rootLengthCm = input.rootLengthCm as number;
    const soilVolumeCm3 = input.soilVolumeCm3 as number;
    if (!(rootLengthCm > 0))
      simpleError("rootLengthCm", "The root length must be greater than zero.");
    if (!(soilVolumeCm3 > 0))
      simpleError(
        "soilVolumeCm3",
        "The soil volume must be greater than zero.",
      );
    return { rootLengthDensity: rootLengthCm / soilVolumeCm3 };
  },
});
export const runRootLengthDensity = rootLengthDensityTool.execute;
export default rootLengthDensityTool;
