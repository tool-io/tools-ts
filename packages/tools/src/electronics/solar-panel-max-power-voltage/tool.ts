import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarPanelMaxPowerVoltageInput = Readonly<{
  readonly maxPowerWatts: number;
  readonly maxPowerAmperes: number;
}>;
export type SolarPanelMaxPowerVoltageOutput = Readonly<{
  readonly maxPowerVolts: number;
}>;

export const calculateSolarPanelMaxPowerVoltage = (
  x: SolarPanelMaxPowerVoltageInput,
): SolarPanelMaxPowerVoltageOutput => {
  if (!Number.isFinite(x.maxPowerWatts) || x.maxPowerWatts < 0)
    simpleError("maxPowerWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.maxPowerAmperes) || x.maxPowerAmperes < 0)
    simpleError("maxPowerAmperes", "Provide a finite number at least 0.");
  const maxPowerVolts = x.maxPowerWatts / x.maxPowerAmperes;
  if (!Number.isFinite(maxPowerVolts))
    simpleError(
      "maxPowerVolts",
      "Inputs produce an undefined or non-finite result.",
    );
  return { maxPowerVolts: Object.is(maxPowerVolts, -0) ? 0 : maxPowerVolts };
};

export const example = {
  input: { maxPowerWatts: 100, maxPowerAmperes: 5 },
  output: { maxPowerVolts: 20 },
} satisfies ToolExample<
  SolarPanelMaxPowerVoltageInput,
  SolarPanelMaxPowerVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/solar-panel-max-power-voltage",
  title: "Solar Panel Max Power Voltage",
  description:
    "Maximum-power-point voltage from measured maximum output power and current at that same operating point.",
  inputs: [
    {
      id: "maxPowerWatts",
      kind: "number",
      label: "Max Power Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "maxPowerAmperes",
      kind: "number",
      label: "Max Power Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maxPowerVolts",
      kind: "number",
      label: "Max Power Volts",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateSolarPanelMaxPowerVoltage({
      maxPowerWatts: input.maxPowerWatts as number,
      maxPowerAmperes: input.maxPowerAmperes as number,
    }),
});
export const solarPanelMaxPowerVoltageTool = tool;
export const runSolarPanelMaxPowerVoltage = tool.execute;
export default tool;
