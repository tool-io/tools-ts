import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarrierToNoiseRatioInput = {
  readonly carrierPowerDbm: number;
  readonly noisePowerDbm: number;
};

export type CarrierToNoiseRatioOutput = {
  readonly carrierToNoiseDb: number;
};

export const carrierToNoiseRatioExample = {
  input: { carrierPowerDbm: -50, noisePowerDbm: -105 },
  output: { carrierToNoiseDb: 55 },
} satisfies ToolExample<CarrierToNoiseRatioInput, CarrierToNoiseRatioOutput>;

export const carrierToNoiseRatioTool = createSimpleTool({
  id: "electronics/carrier-to-noise-ratio",
  title: "C/N Ratio dB",
  description:
    "Compute the carrier-to-noise ratio in decibels as the carrier power minus the noise power, both in dBm.",
  inputs: [
    {
      id: "carrierPowerDbm",
      label: "Carrier power",
      kind: "number",
      unit: "dBm",
    },
    { id: "noisePowerDbm", label: "Noise power", kind: "number", unit: "dBm" },
  ],
  outputs: [
    {
      id: "carrierToNoiseDb",
      label: "Carrier-to-noise ratio",
      kind: "number",
      unit: "dB",
    },
  ],
  calculate: (input) => {
    const carrierPowerDbm = input.carrierPowerDbm as number;
    const noisePowerDbm = input.noisePowerDbm as number;
    if (!Number.isFinite(carrierPowerDbm))
      simpleError(
        "carrierPowerDbm",
        "Carrier power must be finite.",
        "invalid_level",
      );
    if (!Number.isFinite(noisePowerDbm))
      simpleError(
        "noisePowerDbm",
        "Noise power must be finite.",
        "invalid_level",
      );
    return {
      carrierToNoiseDb: carrierPowerDbm - noisePowerDbm,
    };
  },
});
export const runCarrierToNoiseRatio = carrierToNoiseRatioTool.execute;
export default carrierToNoiseRatioTool;
