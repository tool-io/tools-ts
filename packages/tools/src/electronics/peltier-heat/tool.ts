import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    seebeckVPerK: 0.05,
    currentA: 2,
    coldTemperatureK: 293,
    hotTemperatureK: 313,
    resistanceOhm: 1,
    thermalConductanceWPerK: 0.4,
  },
  output: { coldSideHeatW: 19.3 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/peltier-heat",
  title: "Peltier Cold-Side Heat",
  description:
    "Estimate thermoelectric cooler heat absorbed at the cold side as αITc−½I²R−K(Th−Tc). Supply module-level Seebeck coefficient, electrical resistance, and thermal conductance; positive output means cooling.",
  inputs: [
    {
      id: "seebeckVPerK",
      kind: "number",
      label: "Module Seebeck coefficient (V/K)",
    },
    { id: "currentA", kind: "number", label: "Current (A)" },
    {
      id: "coldTemperatureK",
      kind: "number",
      label: "Cold-side temperature (K)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "hotTemperatureK",
      kind: "number",
      label: "Hot-side temperature (K)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "resistanceOhm",
      kind: "number",
      label: "Electrical resistance (Ω)",
      minimum: 0,
    },
    {
      id: "thermalConductanceWPerK",
      kind: "number",
      label: "Thermal conductance (W/K)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "coldSideHeatW", kind: "number", label: "Cold Side Heat W" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      coldSideHeatW:
        i.seebeckVPerK * i.currentA * i.coldTemperatureK -
        0.5 * i.currentA * i.currentA * i.resistanceOhm -
        i.thermalConductanceWPerK * (i.hotTemperatureK - i.coldTemperatureK),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PeltierHeatInput = Readonly<typeof example.input>;
export type PeltierHeatOutput = Readonly<typeof example.output>;
export const peltierHeatTool = tool;
export const runPeltierHeat = tool.execute;
export default tool;
