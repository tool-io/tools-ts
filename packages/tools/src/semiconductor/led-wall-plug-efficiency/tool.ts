import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedWallPlugEfficiencyInput = {
  readonly electricalPowerMW: number;
  readonly opticalPowerMW: number;
};

export type LedWallPlugEfficiencyOutput = {
  readonly wallPlugEfficiencyPercent: number;
};

export const ledWallPlugEfficiencyExample = {
  input: {
    electricalPowerMW: 100,
    opticalPowerMW: 30,
  },
  output: { wallPlugEfficiencyPercent: 30 },
} satisfies ToolExample<
  LedWallPlugEfficiencyInput,
  LedWallPlugEfficiencyOutput
>;

export const ledWallPlugEfficiencyTool = createSimpleTool({
  id: "semiconductor/led-wall-plug-efficiency",
  title: "LED Wall Plug Efficiency Calculator",
  description:
    "Compute LED wall plug efficiency as the ratio of emitted optical power to consumed electrical power.",
  inputs: [
    {
      description: "Emitted optical output power.",
      id: "opticalPowerMW",
      kind: "number",
      label: "Optical power",
      minimum: 0,
      unit: "mW",
    },
    {
      description: "Consumed electrical input power.",
      id: "electricalPowerMW",
      kind: "number",
      label: "Electrical power",
      minimum: Number.MIN_VALUE,
      unit: "mW",
    },
  ],
  outputs: [
    {
      description: "Optical output power divided by electrical input power.",
      format: "percent",
      id: "wallPlugEfficiencyPercent",
      kind: "number",
      label: "Wall plug efficiency",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) => {
    const optical = input.opticalPowerMW as number;
    const electrical = input.electricalPowerMW as number;
    if (!(optical >= 0))
      simpleError(
        "opticalPowerMW",
        "Optical power must be nonnegative.",
        "invalid_optical_power",
      );
    if (!(electrical > 0))
      simpleError(
        "electricalPowerMW",
        "Electrical power must be positive.",
        "invalid_electrical_power",
      );
    if (optical > electrical)
      simpleError(
        "opticalPowerMW",
        "Optical output power cannot exceed electrical input power.",
        "invalid_power_balance",
      );
    return {
      wallPlugEfficiencyPercent: (optical / electrical) * 100,
    };
  },
});
export const runLedWallPlugEfficiency = ledWallPlugEfficiencyTool.execute;
export default ledWallPlugEfficiencyTool;
