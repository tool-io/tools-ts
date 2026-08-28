import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const T0_KELVIN = 290;

export const noiseTemperatureExample = {
  input: { noiseFactor: 2 },
} satisfies ToolExample<{
  readonly noiseFactor: number;
}>;

export const noiseTemperatureTool = createSimpleTool({
  id: "electronics/noise-temperature",
  title: "Noise Temperature",
  description:
    "Calculate equivalent input noise temperature from a linear noise factor using the IEEE 290 K reference.",
  inputs: [{ id: "noiseFactor", label: "Noise factor", kind: "number" }],
  outputs: [
    {
      id: "equivalentNoiseTemperatureK",
      label: "Equivalent noise temperature",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const noiseFactor = input.noiseFactor as number;
    if (noiseFactor < 1)
      simpleError(
        "noiseFactor",
        "Noise factor must be at least one.",
        "below_unity",
      );
    return {
      equivalentNoiseTemperatureK: (noiseFactor - 1) * T0_KELVIN,
    };
  },
});
export const runNoiseTemperature = noiseTemperatureTool.execute;
export default noiseTemperatureTool;
