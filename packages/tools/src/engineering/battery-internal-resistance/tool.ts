import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryInternalResistanceInput = Readonly<{
  readonly openCircuitVolts: number;
  readonly loadedVolts: number;
  readonly currentAmperes: number;
}>;
export type BatteryInternalResistanceOutput = Readonly<{
  readonly resistanceOhms: number;
}>;

export const calculateBatteryInternalResistance = (
  x: BatteryInternalResistanceInput,
): BatteryInternalResistanceOutput => {
  if (!Number.isFinite(x.openCircuitVolts) || x.openCircuitVolts < 0)
    simpleError("openCircuitVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.loadedVolts) || x.loadedVolts < 0)
    simpleError("loadedVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.currentAmperes) || x.currentAmperes < 0)
    simpleError("currentAmperes", "Provide a finite number at least 0.");
  if (x.loadedVolts > x.openCircuitVolts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const resistanceOhms =
    (x.openCircuitVolts - x.loadedVolts) / x.currentAmperes;
  if (!Number.isFinite(resistanceOhms))
    simpleError(
      "resistanceOhms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { resistanceOhms: Object.is(resistanceOhms, -0) ? 0 : resistanceOhms };
};

export const example = {
  input: { openCircuitVolts: 12.6, loadedVolts: 12, currentAmperes: 10 },
  output: { resistanceOhms: 0.05999999999999996 },
} satisfies ToolExample<
  BatteryInternalResistanceInput,
  BatteryInternalResistanceOutput
>;

export const tool = createSimpleTool({
  id: "engineering/battery-internal-resistance",
  title: "Battery Internal Resistance",
  description:
    "Apparent battery DC internal resistance from open-circuit and loaded terminal voltages at a measured discharge current.",
  inputs: [
    {
      id: "openCircuitVolts",
      kind: "number",
      label: "Open Circuit Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "loadedVolts",
      kind: "number",
      label: "Loaded Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance Ohms",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateBatteryInternalResistance({
      openCircuitVolts: input.openCircuitVolts as number,
      loadedVolts: input.loadedVolts as number,
      currentAmperes: input.currentAmperes as number,
    }),
});
export const batteryInternalResistanceTool = tool;
export const runBatteryInternalResistance = tool.execute;
export default tool;
