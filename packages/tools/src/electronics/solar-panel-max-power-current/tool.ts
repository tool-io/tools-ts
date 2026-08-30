import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarPanelMaxPowerCurrentInput = Readonly<{
  readonly maxPowerWatts: number;
  readonly maxPowerVolts: number;
}>;
export type SolarPanelMaxPowerCurrentOutput = Readonly<{
  readonly maxPowerAmperes: number;
}>;

export const calculateSolarPanelMaxPowerCurrent = (
  x: SolarPanelMaxPowerCurrentInput,
): SolarPanelMaxPowerCurrentOutput => {
  if (!Number.isFinite(x.maxPowerWatts) || x.maxPowerWatts < 0)
    simpleError("maxPowerWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.maxPowerVolts) || x.maxPowerVolts < 0)
    simpleError("maxPowerVolts", "Provide a finite number at least 0.");
  const maxPowerAmperes = x.maxPowerWatts / x.maxPowerVolts;
  if (!Number.isFinite(maxPowerAmperes))
    simpleError(
      "maxPowerAmperes",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    maxPowerAmperes: Object.is(maxPowerAmperes, -0) ? 0 : maxPowerAmperes,
  };
};

export const example = {
  input: { maxPowerWatts: 100, maxPowerVolts: 20 },
  output: { maxPowerAmperes: 5 },
} satisfies ToolExample<
  SolarPanelMaxPowerCurrentInput,
  SolarPanelMaxPowerCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/solar-panel-max-power-current",
  title: "Solar Panel Max Power Current",
  description:
    "Maximum-power-point current from measured maximum output power and voltage at that same operating point.",
  inputs: [
    {
      id: "maxPowerWatts",
      kind: "number",
      label: "Max Power Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "maxPowerVolts",
      kind: "number",
      label: "Max Power Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maxPowerAmperes",
      kind: "number",
      label: "Max Power Amperes",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateSolarPanelMaxPowerCurrent({
      maxPowerWatts: input.maxPowerWatts as number,
      maxPowerVolts: input.maxPowerVolts as number,
    }),
});
export const solarPanelMaxPowerCurrentTool = tool;
export const runSolarPanelMaxPowerCurrent = tool.execute;
export default tool;
