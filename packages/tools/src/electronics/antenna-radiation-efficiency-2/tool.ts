import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaRadiationEfficiency2Example = {
  input: { directivityDbi: 14, gainDbi: 12 },
} satisfies ToolExample<{
  readonly directivityDbi: number;
  readonly gainDbi: number;
}>;

export const antennaRadiationEfficiency2Tool = createSimpleTool({
  id: "electronics/antenna-radiation-efficiency-2",
  title: "Antenna Rad Efficiency 2",
  description:
    "Infer antenna radiation efficiency in percent from measured gain and directivity via efficiencyPercent = 10^((gainDbi - directivityDbi) / 10) * 100.",
  inputs: [
    {
      description: "Measured realized or absolute gain.",
      id: "gainDbi",
      kind: "number",
      label: "Gain",
      unit: "dBi",
    },
    {
      description: "Directivity of the same aperture.",
      id: "directivityDbi",
      kind: "number",
      label: "Directivity",
      unit: "dBi",
    },
  ],
  outputs: [
    {
      description: "Radiation efficiency expressed as a percentage.",
      id: "radiationEfficiencyPercent",
      kind: "number",
      label: "Radiation Efficiency",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const gainDbi = input.gainDbi as number;
    const directivityDbi = input.directivityDbi as number;
    if (gainDbi > directivityDbi)
      simpleError(
        "gainDbi",
        "Gain cannot exceed directivity for a passive antenna.",
        "invalid_gain",
      );
    return {
      radiationEfficiencyPercent:
        Math.pow(10, (gainDbi - directivityDbi) / 10) * 100,
    };
  },
});
export const runAntennaRadiationEfficiency2 =
  antennaRadiationEfficiency2Tool.execute;
export default antennaRadiationEfficiency2Tool;
