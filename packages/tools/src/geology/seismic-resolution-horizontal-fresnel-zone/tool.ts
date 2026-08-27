import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicResolutionHorizontalFresnelZoneInput = {
  readonly velocityMPers: number;
  readonly dominantFrequencyHz: number;
  readonly zeroOffsetTimeS: number;
};

export type SeismicResolutionHorizontalFresnelZoneOutput = {
  readonly fresnelZoneRadiusM: number;
  readonly fresnelZoneWidthM: number;
  readonly wavelengthM: number;
};

export const calculateSeismicResolutionHorizontalFresnelZone = (
  input: SeismicResolutionHorizontalFresnelZoneInput,
): SeismicResolutionHorizontalFresnelZoneOutput => {
  if (!(input.velocityMPers > 0))
    return simpleError(
      "velocityMPers",
      "Velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.dominantFrequencyHz > 0))
    return simpleError(
      "dominantFrequencyHz",
      "Dominant frequency must be greater than zero.",
      "invalid_frequency",
    );
  if (!(input.zeroOffsetTimeS > 0))
    return simpleError(
      "zeroOffsetTimeS",
      "Zero-offset time must be greater than zero.",
      "invalid_time",
    );
  const wavelengthM = input.velocityMPers / input.dominantFrequencyHz;
  const fresnelZoneRadiusM =
    (input.velocityMPers / 2) *
    Math.sqrt(input.zeroOffsetTimeS / input.dominantFrequencyHz);
  return {
    fresnelZoneRadiusM,
    fresnelZoneWidthM: 2 * fresnelZoneRadiusM,
    wavelengthM,
  };
};

export const seismicResolutionHorizontalFresnelZoneExample = {
  input: { velocityMPers: 3000, dominantFrequencyHz: 30, zeroOffsetTimeS: 1.0 },
  output: {
    fresnelZoneRadiusM: 273.861278752583,
    fresnelZoneWidthM: 547.722557505166,
    wavelengthM: 100,
  },
} satisfies ToolExample<
  SeismicResolutionHorizontalFresnelZoneInput,
  SeismicResolutionHorizontalFresnelZoneOutput
>;

export const seismicResolutionHorizontalFresnelZoneTool = createSimpleTool({
  id: "geology/seismic-resolution-horizontal-fresnel-zone",
  title: "Seismic Resolution Horizontal Fresnel Zone Calculator",
  description:
    "First Fresnel zone radius r = (V/2) sqrt(t0 / f) governing horizontal seismic resolution, with velocity in meters per second, zero-offset two-way time t0 in seconds and dominant frequency f in hertz.",
  inputs: [
    {
      description: "Average P-wave velocity in meters per second.",
      id: "velocityMPers",
      kind: "number",
      label: "V",
      minimum: 0,
    },
    {
      description: "Dominant frequency in hertz.",
      id: "dominantFrequencyHz",
      kind: "number",
      label: "f",
      minimum: 0,
    },
    {
      description: "Zero-offset two-way time to the reflector in seconds.",
      id: "zeroOffsetTimeS",
      kind: "number",
      label: "t0",
    },
  ],
  outputs: [
    {
      description: "First Fresnel zone radius in meters.",
      id: "fresnelZoneRadiusM",
      kind: "number",
      label: "Fresnel radius",
    },
    {
      description: "Full Fresnel zone width in meters.",
      id: "fresnelZoneWidthM",
      kind: "number",
      label: "Fresnel width",
    },
    {
      description: "Dominant wavelength in meters.",
      id: "wavelengthM",
      kind: "number",
      label: "lambda",
    },
  ],
  calculate: (input) =>
    calculateSeismicResolutionHorizontalFresnelZone(
      input as unknown as SeismicResolutionHorizontalFresnelZoneInput,
    ),
});

export const runSeismicResolutionHorizontalFresnelZone =
  seismicResolutionHorizontalFresnelZoneTool.execute;
export default seismicResolutionHorizontalFresnelZoneTool;
