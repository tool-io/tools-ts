import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SystemNoiseTemperatureInput = {
  readonly tAntennaK: number;
  readonly tReceiverK: number;
};

export type SystemNoiseTemperatureOutput = {
  readonly systemNoiseTemperatureK: number;
};

export const systemNoiseTemperatureExample = {
  input: { tAntennaK: 150, tReceiverK: 75 },
  output: { systemNoiseTemperatureK: 225 },
} satisfies ToolExample<
  SystemNoiseTemperatureInput,
  SystemNoiseTemperatureOutput
>;

export const systemNoiseTemperatureTool = createSimpleTool({
  id: "electronics/system-noise-temperature",
  title: "System Noise Temp",
  description:
    "Compute the system noise temperature in kelvin as the sum of the antenna and receiver noise temperatures; both must be non-negative.",
  inputs: [
    {
      id: "tAntennaK",
      label: "Antenna temperature",
      kind: "number",
      unit: "K",
    },
    {
      id: "tReceiverK",
      label: "Receiver temperature",
      kind: "number",
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "systemNoiseTemperatureK",
      label: "System noise temperature",
      kind: "number",
      unit: "K",
    },
  ],
  calculate: (input) => {
    const tAntennaK = input.tAntennaK as number;
    const tReceiverK = input.tReceiverK as number;
    if (!(tAntennaK >= 0))
      simpleError(
        "tAntennaK",
        "Antenna temperature must not be negative.",
        "invalid_temperature",
      );
    if (!(tReceiverK >= 0))
      simpleError(
        "tReceiverK",
        "Receiver temperature must not be negative.",
        "invalid_temperature",
      );
    return {
      systemNoiseTemperatureK: tAntennaK + tReceiverK,
    };
  },
});
export const runSystemNoiseTemperature = systemNoiseTemperatureTool.execute;
export default systemNoiseTemperatureTool;
