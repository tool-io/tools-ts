import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FbgShiftInput = {
  readonly braggWavelengthNm: number;
  readonly strainMicrostrain?: number;
  readonly tempChangeC?: number;
};

export type FbgShiftOutput = {
  readonly wavelengthShiftPm: number;
  readonly newWavelengthNm: number;
};

/** Silica photoelastic constant and combined thermo-optic/expansion coefficient. */
export const FBG_PHOTOELASTIC = 0.22;
export const FBG_THERMAL_EXPANSION_PER_C = 0.55e-6;
export const FBG_THERMO_OPTIC_PER_C = 8.6e-6;
export const FBG_THERMO_COEFF_PER_C =
  FBG_THERMAL_EXPANSION_PER_C + FBG_THERMO_OPTIC_PER_C;

/**
 * Fiber Bragg grating pitch shift: Δλ = λ0·((1 − pe)·ε + (α + ξ)·ΔT),
 * with strain ε dimensionless and ΔT in °C.
 */
export const fbgPitchShift = (input: FbgShiftInput): FbgShiftOutput => {
  const { braggWavelengthNm } = input;
  const strainMicrostrain = input.strainMicrostrain ?? 0;
  const tempChangeC = input.tempChangeC ?? 0;
  if (!Number.isFinite(braggWavelengthNm) || braggWavelengthNm <= 0)
    simpleError("braggWavelengthNm", "Bragg wavelength must be positive.");
  if (!Number.isFinite(strainMicrostrain))
    simpleError("strainMicrostrain", "Strain must be a finite number.");
  if (!Number.isFinite(tempChangeC))
    simpleError("tempChangeC", "Temperature change must be a finite number.");
  const strain = strainMicrostrain * 1e-6;
  const fractional =
    (1 - FBG_PHOTOELASTIC) * strain + FBG_THERMO_COEFF_PER_C * tempChangeC;
  if (!Number.isFinite(fractional))
    simpleError("strainMicrostrain", "Fractional shift overflowed.");
  const wavelengthShiftPm = braggWavelengthNm * fractional * 1000;
  const newWavelengthNm = braggWavelengthNm * (1 + fractional);
  if (!Number.isFinite(wavelengthShiftPm) || !Number.isFinite(newWavelengthNm))
    simpleError("braggWavelengthNm", "Shifted wavelength overflowed.");
  return { wavelengthShiftPm, newWavelengthNm };
};

export const fbgShiftExample = {
  input: { braggWavelengthNm: 1550, strainMicrostrain: 1000, tempChangeC: 0 },
  output: { wavelengthShiftPm: 1209, newWavelengthNm: 1551.209 },
} satisfies ToolExample<FbgShiftInput, FbgShiftOutput>;

export const fbgShiftTool = createSimpleTool({
  calculate: (input) =>
    fbgPitchShift({
      braggWavelengthNm: input.braggWavelengthNm as number,
      strainMicrostrain:
        (input.strainMicrostrain as number | undefined) ?? undefined,
      tempChangeC: (input.tempChangeC as number | undefined) ?? undefined,
    }),
  description:
    "Compute fiber Bragg grating wavelength shift from axial strain and temperature change using the silica photoelastic and thermo-optic coefficients.",
  id: "laser/laser-fiber-bragg-grating-strain-temperature-pitch-shift-formula-calculator",
  inputs: [
    {
      description: "Unstrained Bragg wavelength at the reference temperature.",
      id: "braggWavelengthNm",
      kind: "number",
      label: "Bragg wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      default: 0,
      description: "Axial strain in microstrain (negative for compression).",
      id: "strainMicrostrain",
      kind: "number",
      label: "Strain",
      unit: "µε",
    },
    {
      default: 0,
      description: "Temperature change from the reference in °C.",
      id: "tempChangeC",
      kind: "number",
      label: "ΔT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Wavelength shift in picometers (negative for blue shift).",
      id: "wavelengthShiftPm",
      kind: "number",
      label: "Shift",
      unit: "pm",
    },
    {
      description: "Shifted Bragg wavelength.",
      id: "newWavelengthNm",
      kind: "number",
      label: "New wavelength",
      unit: "nm",
    },
  ],
  title: "FBG Strain-Temperature Shift",
});
export const runFbgShift = fbgShiftTool.execute;
export default fbgShiftTool;

export { fbgShiftExample as example };
