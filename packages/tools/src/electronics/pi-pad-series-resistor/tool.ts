import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const piPadSeriesResistorExample = {
  input: { attenuationDb: 6, zOhms: 50 },
  output: { piSeriesResistorOhms: 37.35187703354018 },
} satisfies ToolExample<
  { readonly attenuationDb: number; readonly zOhms: number },
  { readonly piSeriesResistorOhms: number }
>;

export const piPadSeriesResistorTool = createSimpleTool({
  id: "electronics/pi-pad-series-resistor",
  title: "Pi-Pad Series Resistor",
  description:
    "Compute the series resistor of a pi-pad attenuator between equal source and load impedances.",
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
      id: "piSeriesResistorOhms",
      kind: "number",
      label: "Series resistor",
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
    return { piSeriesResistorOhms: (z * (k * k - 1)) / (2 * k) };
  },
});
export const runPiPadSeriesResistor = piPadSeriesResistorTool.execute;
export default piPadSeriesResistorTool;
