import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VolumePercentInput = {
  readonly volumeComponentML: number;
  readonly volumeSolutionML: number;
};

export type VolumePercentOutput = {
  readonly volumePercent: number;
};

export const volumePercentExample = {
  input: { volumeComponentML: 15, volumeSolutionML: 60 },
  output: { volumePercent: 25 },
} satisfies ToolExample<VolumePercentInput, VolumePercentOutput>;

export const volumePercentTool = createSimpleTool({
  id: "chemistry/volume-percent",
  title: "Volume Percent Calculator",
  description:
    "Compute the volume percent of a component within a total solution volume.",
  inputs: [
    {
      description: "Volume of the component of interest.",
      id: "volumeComponentML",
      kind: "number",
      label: "Component volume",
      unit: "mL",
    },
    {
      description: "Total volume of the solution.",
      id: "volumeSolutionML",
      kind: "number",
      label: "Solution volume",
      unit: "mL",
    },
  ],
  outputs: [
    {
      description: "Volume percent of the component.",
      format: "percent",
      id: "volumePercent",
      kind: "number",
      label: "Volume percent",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const volumeComponentML = input.volumeComponentML as number;
    if (volumeComponentML < 0)
      simpleError(
        "volumeComponentML",
        "The component volume cannot be negative.",
        "invalid_masses",
      );
    const volumeSolutionML = input.volumeSolutionML as number;
    if (!(volumeSolutionML > 0))
      simpleError(
        "volumeSolutionML",
        "The solution volume must be greater than zero.",
        "invalid_masses",
      );
    if (volumeComponentML > volumeSolutionML)
      simpleError(
        "volumeComponentML",
        "The component volume must not exceed the solution volume.",
        "invalid_masses",
      );
    return { volumePercent: (volumeComponentML / volumeSolutionML) * 100 };
  },
});
export const runVolumePercent = volumePercentTool.execute;
export default volumePercentTool;
