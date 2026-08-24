import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EuvPhotonShotNoiseInput = {
  readonly expectedPhotonCountPerPoint: number;
};

export type EuvPhotonShotNoiseOutput = {
  readonly shotNoisePercent: number;
};

export const euvPhotonShotNoiseExample = {
  input: { expectedPhotonCountPerPoint: 10000 },
  output: { shotNoisePercent: 1 },
} satisfies ToolExample<EuvPhotonShotNoiseInput, EuvPhotonShotNoiseOutput>;

export const calculateEuvPhotonShotNoise = (
  input: EuvPhotonShotNoiseInput,
): EuvPhotonShotNoiseOutput => {
  if (
    !Number.isFinite(input.expectedPhotonCountPerPoint) ||
    input.expectedPhotonCountPerPoint <= 0
  )
    simpleError(
      "expectedPhotonCountPerPoint",
      "Expected photon count must be a finite number greater than zero.",
      "invalid_photon_count",
    );
  const shotNoisePercent = 100 / Math.sqrt(input.expectedPhotonCountPerPoint);
  if (!Number.isFinite(shotNoisePercent) || shotNoisePercent <= 0)
    simpleError(
      "expectedPhotonCountPerPoint",
      "The relative shot noise cannot be represented for this photon count.",
      "numeric_overflow",
    );
  return { shotNoisePercent };
};

export const euvPhotonShotNoiseTool = createSimpleTool({
  calculate: (input) =>
    calculateEuvPhotonShotNoise({
      expectedPhotonCountPerPoint: input.expectedPhotonCountPerPoint as number,
    }),
  description:
    "Calculate the one-standard-deviation relative photon-counting noise for an EUV exposure under an independent Poisson arrival model.",
  id: "semiconductor/euv-photon-shot-noise",
  inputs: [
    {
      description:
        "Expected detected photon count in one measurement or exposure element. A Poisson mean may be fractional.",
      id: "expectedPhotonCountPerPoint",
      kind: "number",
      label: "Expected photons per point",
      minimum: Number.MIN_VALUE,
      unit: "photons",
    },
  ],
  outputs: [
    {
      description:
        "One-sigma relative count noise, 100 / sqrt(N), as a percentage.",
      id: "shotNoisePercent",
      kind: "number",
      label: "Relative shot noise",
      minimum: Number.MIN_VALUE,
      unit: "%",
    },
  ],
  title: "EUV Photon Shot Noise Calculator",
});
export const runEuvPhotonShotNoise = euvPhotonShotNoiseTool.execute;
export default euvPhotonShotNoiseTool;
