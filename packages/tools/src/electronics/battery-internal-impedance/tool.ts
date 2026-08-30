import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryInternalImpedanceInput = Readonly<{
  readonly openCircuitVolts: number;
  readonly loadedVolts: number;
  readonly loadAmperes: number;
}>;
export type BatteryInternalImpedanceOutput = Readonly<{
  readonly internalOhms: number;
}>;

export const calculateBatteryInternalImpedance = (
  x: BatteryInternalImpedanceInput,
): BatteryInternalImpedanceOutput => {
  if (!Number.isFinite(x.openCircuitVolts) || x.openCircuitVolts < 0)
    simpleError("openCircuitVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.loadedVolts) || x.loadedVolts < 0)
    simpleError("loadedVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.loadAmperes) || x.loadAmperes < 0)
    simpleError("loadAmperes", "Provide a finite number at least 0.");
  if (x.loadedVolts > x.openCircuitVolts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const internalOhms = (x.openCircuitVolts - x.loadedVolts) / x.loadAmperes;
  if (!Number.isFinite(internalOhms))
    simpleError(
      "internalOhms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { internalOhms: Object.is(internalOhms, -0) ? 0 : internalOhms };
};

export const example = {
  input: { openCircuitVolts: 12.6, loadedVolts: 12.1, loadAmperes: 10 },
  output: { internalOhms: 0.05 },
} satisfies ToolExample<
  BatteryInternalImpedanceInput,
  BatteryInternalImpedanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-internal-impedance",
  title: "Battery Internal Impedance",
  description:
    "Estimate DC battery internal resistance from the voltage drop between two load-current operating points measured over a short interval.",
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
      id: "loadAmperes",
      kind: "number",
      label: "Load Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "internalOhms", kind: "number", label: "Internal Ohms", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateBatteryInternalImpedance({
      openCircuitVolts: input.openCircuitVolts as number,
      loadedVolts: input.loadedVolts as number,
      loadAmperes: input.loadAmperes as number,
    }),
});
export const batteryInternalImpedanceTool = tool;
export const runBatteryInternalImpedance = tool.execute;
export default tool;
