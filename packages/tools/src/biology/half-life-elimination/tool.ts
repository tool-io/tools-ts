import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const halfLifeEliminationExample = {
  input: { clearanceLPerH: 7, volumeDistributionL: 70 },
  output: { eliminationHalfLifeHours: 6.93 },
} satisfies ToolExample<
  { readonly clearanceLPerH: number; readonly volumeDistributionL: number },
  { readonly eliminationHalfLifeHours: number }
>;

export const halfLifeEliminationTool = createSimpleTool({
  id: "biology/half-life-elimination",
  title: "Elimination Half-Life",
  description:
    "Compute the first-order elimination half-life as 0.693 times the volume of distribution divided by the clearance.",
  inputs: [
    {
      description:
        "Apparent volume of distribution; must be greater than zero.",
      id: "volumeDistributionL",
      label: "Volume of distribution",
      kind: "number",
      unit: "L",
    },
    {
      description: "Total body clearance; must be greater than zero.",
      id: "clearanceLPerH",
      label: "Clearance",
      kind: "number",
      unit: "L/h",
    },
  ],
  outputs: [
    {
      description: "Elimination half-life in hours.",
      id: "eliminationHalfLifeHours",
      label: "Elimination half-life",
      kind: "number",
      unit: "h",
    },
  ],
  calculate: (input) => {
    const volumeDistributionL = input.volumeDistributionL as number;
    const clearanceLPerH = input.clearanceLPerH as number;
    if (!(volumeDistributionL > 0))
      simpleError(
        "volumeDistributionL",
        "The volume of distribution must be greater than zero.",
        "invalid_volume",
      );
    if (!(clearanceLPerH > 0))
      simpleError(
        "clearanceLPerH",
        "The clearance must be greater than zero.",
        "invalid_clearance",
      );
    return {
      eliminationHalfLifeHours: (0.693 * volumeDistributionL) / clearanceLPerH,
    };
  },
});
export const runHalfLifeElimination = halfLifeEliminationTool.execute;
export default halfLifeEliminationTool;
