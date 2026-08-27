import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DegreeOfSaturationInput = {
  readonly voidVolumeM3: number;
  readonly waterVolumeM3: number;
};

export type DegreeOfSaturationOutput = {
  readonly degreeOfSaturationPercent: number;
};

export const calculateDegreeOfSaturation = (
  input: DegreeOfSaturationInput,
): DegreeOfSaturationOutput => {
  if (!(input.voidVolumeM3 > 0))
    simpleError(
      "voidVolumeM3",
      "Void volume must be greater than zero.",
      "invalid_volume",
    );
  if (!(input.waterVolumeM3 >= 0))
    simpleError(
      "waterVolumeM3",
      "Water volume cannot be negative.",
      "invalid_volume",
    );
  if (input.waterVolumeM3 > input.voidVolumeM3)
    simpleError(
      "waterVolumeM3",
      "Water volume cannot exceed the void volume.",
      "invalid_volume",
    );
  return {
    degreeOfSaturationPercent: (input.waterVolumeM3 / input.voidVolumeM3) * 100,
  };
};

export const degreeOfSaturationExample = {
  input: { voidVolumeM3: 0.5, waterVolumeM3: 0.45 },
  output: { degreeOfSaturationPercent: 90 },
} satisfies ToolExample<DegreeOfSaturationInput, DegreeOfSaturationOutput>;

export const degreeOfSaturationTool = createSimpleTool({
  id: "geology/degree-of-saturation",
  title: "Degree Of Saturation Calculator",
  description:
    "Compute the degree of saturation as the percentage of the void space filled by water.",
  inputs: [
    {
      description: "Total void space volume in cubic meters.",
      id: "voidVolumeM3",
      kind: "number",
      label: "Void volume",
      minimum: 0,
    },
    {
      description: "Pore water volume in cubic meters.",
      id: "waterVolumeM3",
      kind: "number",
      label: "Water volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Degree of saturation expressed in percent of void volume.",
      id: "degreeOfSaturationPercent",
      kind: "number",
      label: "Saturation",
    },
  ],
  calculate: (input) =>
    calculateDegreeOfSaturation(input as unknown as DegreeOfSaturationInput),
});

export const runDegreeOfSaturation = degreeOfSaturationTool.execute;
export default degreeOfSaturationTool;
