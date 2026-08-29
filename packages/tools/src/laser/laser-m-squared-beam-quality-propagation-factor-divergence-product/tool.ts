import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MSquaredInput = {
  readonly waistRadiusUm: number;
  readonly divergenceHalfAngleMrad: number;
  readonly wavelengthNm: number;
};

export type MSquaredOutput = {
  readonly mSquared: number;
  readonly beamParameterProductMmMrad: number;
};

/**
 * Beam quality from the divergence product: M² = π·w0·θ/λ with the waist
 * radius w0, far-field half-angle θ, and wavelength in consistent units.
 */
export const mSquaredProduct = (input: MSquaredInput): MSquaredOutput => {
  const { waistRadiusUm, divergenceHalfAngleMrad, wavelengthNm } = input;
  if (!Number.isFinite(waistRadiusUm) || waistRadiusUm <= 0)
    simpleError("waistRadiusUm", "Waist radius must be positive.");
  if (!Number.isFinite(divergenceHalfAngleMrad) || divergenceHalfAngleMrad <= 0)
    simpleError(
      "divergenceHalfAngleMrad",
      "Divergence half-angle must be positive.",
    );
  if (!Number.isFinite(wavelengthNm) || wavelengthNm <= 0)
    simpleError("wavelengthNm", "Wavelength must be positive.");
  const mSquared =
    (Math.PI * waistRadiusUm * divergenceHalfAngleMrad) / wavelengthNm;
  const beamParameterProductMmMrad =
    (waistRadiusUm * divergenceHalfAngleMrad) / 1000;
  if (
    !Number.isFinite(mSquared) ||
    !Number.isFinite(beamParameterProductMmMrad)
  )
    simpleError("waistRadiusUm", "Beam quality product overflowed.");
  if (mSquared < 1 - 1e-9)
    simpleError(
      "divergenceHalfAngleMrad",
      "M² below 1 violates the diffraction limit; check waist, divergence, and wavelength units.",
    );
  return { mSquared, beamParameterProductMmMrad };
};

export const mSquaredExample = {
  input: {
    waistRadiusUm: 50,
    divergenceHalfAngleMrad: 10,
    wavelengthNm: 1064,
  },
  output: {
    mSquared: 1.4763123372132487,
    beamParameterProductMmMrad: 0.5,
  },
} satisfies ToolExample<MSquaredInput, MSquaredOutput>;

export const mSquaredTool = createSimpleTool({
  calculate: (input) =>
    mSquaredProduct({
      divergenceHalfAngleMrad: input.divergenceHalfAngleMrad as number,
      waistRadiusUm: input.waistRadiusUm as number,
      wavelengthNm: input.wavelengthNm as number,
    }),
  description:
    "Compute the M² beam-quality factor and beam-parameter product from waist radius, far-field half-angle divergence, and wavelength.",
  id: "laser/laser-m-squared-beam-quality-propagation-factor-divergence-product",
  inputs: [
    {
      description:
        "Second-moment beam waist radius, paired with a consistently measured far-field divergence.",
      id: "waistRadiusUm",
      kind: "number",
      label: "Waist radius",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Second-moment far-field half-angle divergence.",
      id: "divergenceHalfAngleMrad",
      kind: "number",
      label: "Divergence",
      minimum: Number.MIN_VALUE,
      unit: "mrad",
    },
    {
      description: "Laser wavelength.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description:
        "M² propagation factor (1 for a diffraction-limited Gaussian).",
      id: "mSquared",
      kind: "number",
      label: "M²",
    },
    {
      description: "Beam-parameter product w0·θ.",
      id: "beamParameterProductMmMrad",
      kind: "number",
      label: "BPP",
      unit: "mm·mrad",
    },
  ],
  title: "M² Beam Quality Product",
});
export const runMSquared = mSquaredTool.execute;
export default mSquaredTool;

export { mSquaredExample as example };
