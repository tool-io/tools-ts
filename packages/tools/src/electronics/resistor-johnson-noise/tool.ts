import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const K_BOLTZMANN_J_PER_K = 1.380649e-23;

export const resistorJohnsonNoiseExample = {
  input: { bandwidthHz: 1000000, resistanceOhms: 50, temperatureK: 290 },
  output: { noiseVoltageNv: 894.8611177160398 },
} satisfies ToolExample<
  {
    readonly bandwidthHz: number;
    readonly resistanceOhms: number;
    readonly temperatureK: number;
  },
  { readonly noiseVoltageNv: number }
>;

export const resistorJohnsonNoiseTool = createSimpleTool({
  calculate: (input) => {
    const t = input.temperatureK as number;
    const r = input.resistanceOhms as number;
    const bw = input.bandwidthHz as number;
    if (!(t > 0))
      simpleError(
        "temperatureK",
        "Temperature must be positive.",
        "invalid_temperature",
      );
    if (!(r > 0))
      simpleError(
        "resistanceOhms",
        "Resistance must be positive.",
        "invalid_resistance",
      );
    if (!(bw > 0))
      simpleError(
        "bandwidthHz",
        "Bandwidth must be positive.",
        "invalid_bandwidth",
      );
    return {
      noiseVoltageNv: Math.sqrt(4 * K_BOLTZMANN_J_PER_K * t * r * bw) * 1e9,
    };
  },
  description:
    "Compute the RMS Johnson-Nyquist noise voltage of a resistor in nanovolts over a measurement bandwidth.",
  id: "electronics/resistor-johnson-noise",
  inputs: [
    { id: "temperatureK", kind: "number", label: "Temperature", unit: "K" },
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "Ω" },
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
  ],
  outputs: [
    {
      id: "noiseVoltageNv",
      kind: "number",
      label: "Noise voltage",
      unit: "nV",
    },
  ],
  title: "Johnson Noise",
});
export const runResistorJohnsonNoise = resistorJohnsonNoiseTool.execute;
export default resistorJohnsonNoiseTool;
