import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { radiatedPowerW: 8, acceptedPowerW: 10 },
  output: { efficiencyPercent: 80 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/antenna-radiation-efficiency",
  title: "Antenna Radiation Efficiency",
  description:
    "Calculate radiation efficiency as radiated power divided by accepted power ×100. Mismatch loss before power is accepted at the antenna port is not included.",
  inputs: [
    {
      id: "radiatedPowerW",
      kind: "number",
      label: "Radiated power (W)",
      minimum: 0,
    },
    {
      id: "acceptedPowerW",
      kind: "number",
      label: "Accepted power (W)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "efficiencyPercent", kind: "number", label: "Efficiency Percent" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.radiatedPowerW > i.acceptedPowerW)
      simpleError(
        "radiatedPowerW",
        "Radiated power cannot exceed accepted power in a passive antenna.",
      );
    const output = {
      efficiencyPercent: (i.radiatedPowerW / i.acceptedPowerW) * 100,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AntennaRadiationEfficiencyInput = Readonly<typeof example.input>;
export type AntennaRadiationEfficiencyOutput = Readonly<typeof example.output>;
export const antennaRadiationEfficiencyTool = tool;
export const runAntennaRadiationEfficiency = tool.execute;
export default tool;
