import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const piPadShuntResistorExample = {
  input: { attenuationDb: 6, zOhms: 50 },
  output: { piShuntResistorOhms: 150.47602375372455 },
} satisfies ToolExample<
  { readonly attenuationDb: number; readonly zOhms: number },
  { readonly piShuntResistorOhms: number }
>;

export const piPadShuntResistorTool = createSimpleTool({
  id: "electronics/pi-pad-shunt-resistor",
  title: "Pi-Pad Shunt Resistor",
  description:
    "Compute each shunt resistor of a pi-pad attenuator between equal source and load impedances.",
  inputs: [
    { id: "zOhms", kind: "number", label: "Impedance", unit: "Ω" },
    {
      id: "attenuationDb",
      kind: "number",
      label: "Attenuation",
      minimum: 0,
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "piShuntResistorOhms",
      kind: "number",
      label: "Shunt resistor",
      unit: "Ω",
    },
  ],
  calculate: (input) => {
    const z = input.zOhms as number;
    if (z <= 0)
      simpleError(
        "zOhms",
        "The impedance must be greater than zero.",
        "invalid_impedance",
      );
    const db = input.attenuationDb as number;
    if (db <= 0)
      simpleError(
        "attenuationDb",
        "The attenuation must be greater than zero decibels.",
        "invalid_attenuation",
      );
    const k = Math.pow(10, db / 20);
    return { piShuntResistorOhms: (z * (k + 1)) / (k - 1) };
  },
});
export const runPiPadShuntResistor = piPadShuntResistorTool.execute;
export default piPadShuntResistorTool;
