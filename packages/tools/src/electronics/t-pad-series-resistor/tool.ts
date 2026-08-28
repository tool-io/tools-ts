import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tPadSeriesResistorExample = {
  input: { attenuationDb: 6, zOhms: 50 },
  output: { seriesResistorOhms: 16.613942458312202 },
} satisfies ToolExample<
  { readonly attenuationDb: number; readonly zOhms: number },
  { readonly seriesResistorOhms: number }
>;

export const tPadSeriesResistorTool = createSimpleTool({
  id: "electronics/t-pad-series-resistor",
  title: "T-Pad Series Resistor",
  description:
    "Compute each series resistor of an unbalanced T-pad attenuator between equal source and load impedances.",
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
      id: "seriesResistorOhms",
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
    return { seriesResistorOhms: (z * (k - 1)) / (k + 1) };
  },
});
export const runTPadSeriesResistor = tPadSeriesResistorTool.execute;
export default tPadSeriesResistorTool;
