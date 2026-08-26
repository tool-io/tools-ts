import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const halfLifeBiologyExample = {
  input: { clearanceLPerH: 7, volumeDistributionL: 70 },
} satisfies ToolExample<{
  readonly clearanceLPerH: number;
  readonly volumeDistributionL: number;
}>;

export const halfLifeBiologyTool = createSimpleTool({
  id: "biology/half-life-biology",
  title: "Biological Half-Life",
  description:
    "Compute the elimination half-life from volume of distribution and clearance.",
  inputs: [
    {
      id: "volumeDistributionL",
      label: "Volume of distribution",
      kind: "number",
      unit: "L",
    },
    {
      id: "clearanceLPerH",
      label: "Clearance",
      kind: "number",
      unit: "L/h",
    },
  ],
  outputs: [
    { id: "halfLifeHours", label: "Half-life", kind: "number", unit: "h" },
  ],
  calculate: (input) => {
    const volumeDistributionL = input.volumeDistributionL as number;
    const clearanceLPerH = input.clearanceLPerH as number;
    if (volumeDistributionL <= 0)
      simpleError(
        "volumeDistributionL",
        "Volume of distribution must be greater than zero.",
        "invalid_volume",
      );
    if (clearanceLPerH <= 0)
      simpleError(
        "clearanceLPerH",
        "Clearance must be greater than zero.",
        "invalid_clearance",
      );
    return {
      halfLifeHours: (Math.LN2 * volumeDistributionL) / clearanceLPerH,
    };
  },
});
export const runHalfLifeBiology = halfLifeBiologyTool.execute;
export default halfLifeBiologyTool;
