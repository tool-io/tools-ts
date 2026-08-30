import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistorThermalNoiseCurrentInput = Readonly<{
  readonly temperatureKelvin: number;
  readonly bandwidthHz: number;
  readonly resistanceOhms: number;
}>;
export type ResistorThermalNoiseCurrentOutput = Readonly<{
  readonly noiseAmperes: number;
}>;

export const calculateResistorThermalNoiseCurrent = (
  x: ResistorThermalNoiseCurrentInput,
): ResistorThermalNoiseCurrentOutput => {
  if (!Number.isFinite(x.temperatureKelvin) || x.temperatureKelvin < 0)
    simpleError("temperatureKelvin", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bandwidthHz) || x.bandwidthHz < 0)
    simpleError("bandwidthHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.resistanceOhms) || x.resistanceOhms < 0)
    simpleError("resistanceOhms", "Provide a finite number at least 0.");
  const noiseAmperes = Math.sqrt(
    (4 * 1.380649e-23 * x.temperatureKelvin * x.bandwidthHz) / x.resistanceOhms,
  );
  if (!Number.isFinite(noiseAmperes))
    simpleError(
      "noiseAmperes",
      "Inputs produce an undefined or non-finite result.",
    );
  return { noiseAmperes: Object.is(noiseAmperes, -0) ? 0 : noiseAmperes };
};

export const example = {
  input: { temperatureKelvin: 300, bandwidthHz: 1000, resistanceOhms: 1000 },
  output: { noiseAmperes: 1.2871591976131002e-10 },
} satisfies ToolExample<
  ResistorThermalNoiseCurrentInput,
  ResistorThermalNoiseCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/resistor-thermal-noise-current",
  title: "Resistor Thermal Noise Current",
  description:
    "RMS Johnson-Nyquist current noise over an equivalent noise bandwidth; assumes a resistor at thermal equilibrium.",
  inputs: [
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "bandwidthHz",
      kind: "number",
      label: "Bandwidth Hz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "noiseAmperes", kind: "number", label: "Noise Amperes", unit: "A" },
  ],
  calculate: (input) =>
    calculateResistorThermalNoiseCurrent({
      temperatureKelvin: input.temperatureKelvin as number,
      bandwidthHz: input.bandwidthHz as number,
      resistanceOhms: input.resistanceOhms as number,
    }),
});
export const resistorThermalNoiseCurrentTool = tool;
export const runResistorThermalNoiseCurrent = tool.execute;
export default tool;
