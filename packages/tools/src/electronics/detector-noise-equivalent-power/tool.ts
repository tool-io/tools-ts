import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetectorNoiseEquivalentPowerInput = Readonly<{
  readonly noiseAmperesPerRootHz: number;
  readonly responsivityAmperesPerWatt: number;
}>;
export type DetectorNoiseEquivalentPowerOutput = Readonly<{
  readonly nepWattsPerRootHz: number;
}>;

export const calculateDetectorNoiseEquivalentPower = (
  x: DetectorNoiseEquivalentPowerInput,
): DetectorNoiseEquivalentPowerOutput => {
  if (!Number.isFinite(x.noiseAmperesPerRootHz) || x.noiseAmperesPerRootHz < 0)
    simpleError("noiseAmperesPerRootHz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.responsivityAmperesPerWatt) ||
    x.responsivityAmperesPerWatt < 0
  )
    simpleError(
      "responsivityAmperesPerWatt",
      "Provide a finite number at least 0.",
    );
  const nepWattsPerRootHz =
    x.noiseAmperesPerRootHz / x.responsivityAmperesPerWatt;
  if (!Number.isFinite(nepWattsPerRootHz))
    simpleError(
      "nepWattsPerRootHz",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    nepWattsPerRootHz: Object.is(nepWattsPerRootHz, -0) ? 0 : nepWattsPerRootHz,
  };
};

export const example = {
  input: { noiseAmperesPerRootHz: 1e-12, responsivityAmperesPerWatt: 0.5 },
  output: { nepWattsPerRootHz: 2e-12 },
} satisfies ToolExample<
  DetectorNoiseEquivalentPowerInput,
  DetectorNoiseEquivalentPowerOutput
>;

export const tool = createSimpleTool({
  id: "electronics/detector-noise-equivalent-power",
  title: "Detector Noise Equivalent Power",
  description:
    "Detector noise-equivalent optical power for 1 Hz bandwidth from input-referred current-noise density and responsivity.",
  inputs: [
    {
      id: "noiseAmperesPerRootHz",
      kind: "number",
      label: "Noise Amperes Per Root Hz",
      unit: "A/√Hz",
      minimum: 0,
    },
    {
      id: "responsivityAmperesPerWatt",
      kind: "number",
      label: "Responsivity Amperes Per Watt",
      unit: "A/W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nepWattsPerRootHz",
      kind: "number",
      label: "Nep Watts Per Root Hz",
      unit: "W/√Hz",
    },
  ],
  calculate: (input) =>
    calculateDetectorNoiseEquivalentPower({
      noiseAmperesPerRootHz: input.noiseAmperesPerRootHz as number,
      responsivityAmperesPerWatt: input.responsivityAmperesPerWatt as number,
    }),
});
export const detectorNoiseEquivalentPowerTool = tool;
export const runDetectorNoiseEquivalentPower = tool.execute;
export default tool;
