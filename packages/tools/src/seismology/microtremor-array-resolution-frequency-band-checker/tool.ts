import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const microtremorArrayResolutionFrequencyBandCheckerExample = {
  input: {
    minRadiusKm: 0.05,
    maxRadiusKm: 2,
    phaseVelocityKmS: 0.6,
    targetFrequencyHz: 1,
  },
  output: {
    wavelengthKm: 0.6,
    bandResolvedByAperture: true,
    bandResolvedBySpacing: true,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const microtremorArrayResolutionFrequencyBandCheckerTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ minRadiusKm, maxRadiusKm, phaseVelocityKmS, targetFrequencyHz }) => {
        if (minRadiusKm < 0)
          simpleError("minRadiusKm", "Minimum spacing cannot be negative.");
        if (maxRadiusKm <= 0)
          simpleError("maxRadiusKm", "Array aperture must be positive.");
        if (minRadiusKm > maxRadiusKm)
          simpleError(
            "minRadiusKm",
            "Minimum spacing cannot exceed the array aperture.",
          );
        if (phaseVelocityKmS <= 0)
          simpleError("phaseVelocityKmS", "Phase velocity must be positive.");
        if (targetFrequencyHz <= 0)
          simpleError("targetFrequencyHz", "Frequency must be positive.");
        const wavelengthKm = phaseVelocityKmS / targetFrequencyHz;
        return {
          wavelengthKm,
          bandResolvedByAperture: maxRadiusKm >= wavelengthKm,
          bandResolvedBySpacing: minRadiusKm <= wavelengthKm / 2,
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Check that array aperture brackets the wavenumbers of the target frequency band for SPAC/f-k dispersion work.",
    id: "seismology/microtremor-array-resolution-frequency-band-checker",
    inputs: [
      {
        minimum: 0,
        description: "Smallest station spacing.",
        id: "minRadiusKm",
        kind: "number",
        label: "r_min",
        unit: "km",
      },
      {
        minimum: 0,
        description: "Array aperture.",
        id: "maxRadiusKm",
        kind: "number",
        label: "r_max",
        unit: "km",
      },
      {
        minimum: 0,
        description: "Approximate Rayleigh phase speed.",
        id: "phaseVelocityKmS",
        kind: "number",
        label: "c",
        unit: "km/s",
      },
      {
        minimum: 0,
        description: "Target frequency.",
        id: "targetFrequencyHz",
        kind: "number",
        label: "f",
        unit: "Hz",
      },
    ],
    outputs: [
      {
        description: "Target wavelength.",
        id: "wavelengthKm",
        kind: "number",
        label: "λ",
        unit: "km",
      },
      {
        description: "Whether aperture covers about one wavelength.",
        id: "bandResolvedByAperture",
        kind: "boolean",
        label: "r_max ok?",
      },
      {
        description: "Whether spacing is below half a wavelength.",
        id: "bandResolvedBySpacing",
        kind: "boolean",
        label: "r_min ok?",
      },
    ],
    title: "Microtremor Array Resolution Frequency Band Checker",
  });
export const runMicrotremorArrayResolutionFrequencyBandChecker =
  microtremorArrayResolutionFrequencyBandCheckerTool.execute;
export { microtremorArrayResolutionFrequencyBandCheckerExample as example };
export default microtremorArrayResolutionFrequencyBandCheckerTool;
