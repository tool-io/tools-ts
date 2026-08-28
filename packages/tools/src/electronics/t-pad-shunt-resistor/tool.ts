import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tPadShuntResistorExample = {
  input: { attenuationDb: 6, zOhms: 50 },
  output: { shuntResistorOhms: 66.93104064770615 },
} satisfies ToolExample<
  { readonly attenuationDb: number; readonly zOhms: number },
  { readonly shuntResistorOhms: number }
>;

export const tPadShuntResistorTool = createSimpleTool({
  id: "electronics/t-pad-shunt-resistor",
  title: "T-Pad Shunt Resistor",
  description:
    "Compute the shunt resistor of an unbalanced T-pad attenuator between equal source and load impedances.",
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
      id: "shuntResistorOhms",
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
    return { shuntResistorOhms: (z * 2 * k) / (k * k - 1) };
  },
});
export const runTPadShuntResistor = tPadShuntResistorTool.execute;
export default tPadShuntResistorTool;
