import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NdYagThresholdInversionInput = {
  readonly rodLengthMm: number;
  readonly sigmaCm2?: number;
  readonly internalLossPerCm?: number;
  readonly rearR?: number;
  readonly outputR?: number;
  readonly lambdaNm?: number;
};

export type NdYagThresholdInversionOutput = {
  readonly thresholdInversionPerCm3: number;
  readonly storedEnergyDensityJPerCm3: number;
};

/** Product of Planck's constant and the speed of light, in joule centimetres. */
export const HC_J_CM = 1.98644586e-23;

/**
 * Round-trip gain equals loss at threshold:
 *   sigma * dN * L = alpha_i * L + ln(1 / sqrt(R1 * R2))
 * so the required inversion density is
 *   dN = [alpha_i + ln(1 / (R1 R2)) / (2 L)] / sigma.
 */
export const ndYagThresholdInversionPerCm3 = (
  rodLengthMm: number,
  sigmaCm2: number,
  internalLossPerCm: number,
  rearR: number,
  outputR: number,
): number => {
  if (rodLengthMm <= 0)
    simpleError("rodLengthMm", "Gain length must be positive.");
  if (sigmaCm2 <= 0)
    simpleError("sigmaCm2", "Emission cross-section must be positive.");
  if (rearR <= 0 || rearR > 1 || outputR <= 0 || outputR > 1)
    simpleError("rearR", "Mirror reflectivities must lie in (0, 1].");
  if (internalLossPerCm < 0)
    simpleError("internalLossPerCm", "Internal loss cannot be negative.");
  const lengthCm = rodLengthMm / 10;
  const mirrorLoss = Math.log(1 / (rearR * outputR)) / (2 * lengthCm);
  return (internalLossPerCm + mirrorLoss) / sigmaCm2;
};

export const computeNdYagThresholdInversion = (
  input: NdYagThresholdInversionInput,
): NdYagThresholdInversionOutput => {
  const lambdaNm = input.lambdaNm ?? 1064;
  if (lambdaNm <= 0)
    simpleError("lambdaNm", "Lasing wavelength must be positive.");
  const inversionPerCm3 = ndYagThresholdInversionPerCm3(
    input.rodLengthMm,
    input.sigmaCm2 ?? 2.8e-19,
    input.internalLossPerCm ?? 0.005,
    input.rearR ?? 1,
    input.outputR ?? 0.9,
  );
  const wavelengthCm = lambdaNm * 1e-7;
  const photonEnergyJ = HC_J_CM / wavelengthCm;
  const storedEnergyDensityJPerCm3 = inversionPerCm3 * photonEnergyJ;
  if (![inversionPerCm3, storedEnergyDensityJPerCm3].every(Number.isFinite))
    simpleError("sigmaCm2", "The threshold result exceeds the numeric range.");
  return {
    thresholdInversionPerCm3: inversionPerCm3,
    storedEnergyDensityJPerCm3,
  };
};

export const ndYagThresholdInversionExample = {
  input: { rodLengthMm: 100 },
  output: {
    thresholdInversionPerCm3: (0.005 + Math.log(1 / (1 * 0.9)) / 20) / 2.8e-19,
    storedEnergyDensityJPerCm3:
      ((0.005 + Math.log(1 / (1 * 0.9)) / 20) / 2.8e-19) *
      (1.98644586e-23 / 1064e-7),
  },
} satisfies ToolExample<
  NdYagThresholdInversionInput,
  NdYagThresholdInversionOutput
>;

export const ndYagThresholdInversionTool = createSimpleTool({
  calculate: (input) =>
    computeNdYagThresholdInversion({
      internalLossPerCm: input.internalLossPerCm as number,
      lambdaNm: input.lambdaNm as number,
      outputR: input.outputR as number,
      rearR: input.rearR as number,
      rodLengthMm: input.rodLengthMm as number,
      sigmaCm2: input.sigmaCm2 as number,
    }),
  description:
    "Solve the four-level round-trip gain condition of a Nd:YAG cavity for the threshold population inversion and its stored energy density.",
  id: "laser/laser-nd-yag-four-level-rate-equation-threshold-inversion-computation",
  inputs: [
    {
      default: 100,
      description: "Gain length of the rod.",
      id: "rodLengthMm",
      kind: "number",
      label: "Rod length",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 1064,
      description: "Lasing wavelength.",
      id: "lambdaNm",
      kind: "number",
      label: "Wavelength",
      minimum: 0,
      unit: "nm",
    },
    {
      default: 0.005,
      description: "Internal loss per centimetre of the crystal.",
      id: "internalLossPerCm",
      kind: "number",
      label: "Internal loss",
      minimum: 0,
      unit: "cm⁻¹",
    },
    {
      default: 2.8e-19,
      description: "Stimulated emission cross-section of the transition.",
      id: "sigmaCm2",
      kind: "number",
      label: "Sigma_e",
      minimum: 0,
      unit: "cm²",
    },
    {
      default: 1,
      description: "Rear high reflector.",
      id: "rearR",
      kind: "number",
      label: "R_rear",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0.9,
      description: "Output coupler reflectivity.",
      id: "outputR",
      kind: "number",
      label: "R_output",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Population inversion density at laser threshold.",
      id: "thresholdInversionPerCm3",
      kind: "number",
      label: "ΔN_th",
      unit: "cm⁻³",
    },
    {
      description: "Stored energy density held by that inversion.",
      id: "storedEnergyDensityJPerCm3",
      kind: "number",
      label: "Stored energy density",
      unit: "J/cm³",
    },
  ],
  title: "Nd:YAG Threshold Inversion Computation",
});
export const runNdYagThresholdInversion = ndYagThresholdInversionTool.execute;
export default ndYagThresholdInversionTool;

export { ndYagThresholdInversionExample as example };
