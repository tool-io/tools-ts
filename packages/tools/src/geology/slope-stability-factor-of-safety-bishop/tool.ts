import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlopeStabilityFactorOfSafetyBishopInput = {
  readonly sliceAnglesDeg: readonly number[];
  readonly sliceWeightsKN: readonly number[];
  readonly sliceWidthM?: number;
  readonly cohesionKPa?: number;
  readonly frictionAngleDeg?: number;
  readonly porePressureRatioRu?: number;
};

export type SlopeStabilityFactorOfSafetyBishopOutput = {
  readonly factorOfSafety: number;
};

const DEG_TO_RAD = Math.PI / 180;

export const calculateSlopeStabilityFactorOfSafetyBishop = (
  input: SlopeStabilityFactorOfSafetyBishopInput,
): SlopeStabilityFactorOfSafetyBishopOutput => {
  const anglesDeg = input.sliceAnglesDeg;
  const weightsKN = input.sliceWeightsKN;
  const widthM = input.sliceWidthM ?? 1;
  const cohesionKPa = input.cohesionKPa ?? 0;
  const frictionAngleDeg = input.frictionAngleDeg ?? 25;
  const porePressureRatioRu = input.porePressureRatioRu ?? 0;
  if (anglesDeg.length !== weightsKN.length)
    simpleError(
      "sliceWeightsKN",
      "Slice angle and weight lists must have the same length.",
      "invalid_slices",
    );
  if (anglesDeg.length === 0)
    simpleError(
      "sliceAnglesDeg",
      "At least one slice is required.",
      "invalid_slices",
    );
  if (!(widthM > 0))
    simpleError(
      "sliceWidthM",
      "Slice width must be greater than zero.",
      "invalid_width",
    );
  if (!(cohesionKPa >= 0))
    simpleError(
      "cohesionKPa",
      "Cohesion must be non-negative.",
      "invalid_cohesion",
    );
  if (!(frictionAngleDeg >= 0 && frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must be in the range [0, 90) degrees.",
      "invalid_friction_angle",
    );
  if (!(porePressureRatioRu >= 0 && porePressureRatioRu < 1))
    simpleError(
      "porePressureRatioRu",
      "Pore pressure ratio ru must be in the range [0, 1).",
      "invalid_pore_pressure",
    );
  for (const weight of weightsKN)
    if (!(weight >= 0))
      simpleError(
        "sliceWeightsKN",
        "Slice weights must be non-negative.",
        "invalid_slices",
      );
  let drivingMoment = 0;
  for (let i = 0; i < anglesDeg.length; i += 1) {
    const alphaRad = anglesDeg[i] * DEG_TO_RAD;
    if (!(anglesDeg[i] > -90 && anglesDeg[i] < 90))
      simpleError(
        "sliceAnglesDeg",
        "Slice base inclinations must be between -90 and 90 degrees.",
        "invalid_slices",
      );
    drivingMoment += weightsKN[i] * Math.sin(alphaRad);
  }
  if (!(drivingMoment > 0))
    simpleError(
      "sliceAnglesDeg",
      "Slices must produce a net driving force (positive sum of W*sin(alpha)).",
      "invalid_slices",
    );
  const tanPhi = Math.tan(frictionAngleDeg * DEG_TO_RAD);
  let factorOfSafety = 1;
  let converged = false;
  for (let iteration = 0; iteration < 200; iteration += 1) {
    let resistingSum = 0;
    for (let i = 0; i < anglesDeg.length; i += 1) {
      const alphaRad = anglesDeg[i] * DEG_TO_RAD;
      const mAlpha =
        Math.cos(alphaRad) + (tanPhi * Math.sin(alphaRad)) / factorOfSafety;
      if (!(mAlpha > 0))
        simpleError(
          "sliceAnglesDeg",
          "Slice geometry produces a non-positive m-alpha term.",
          "invalid_slices",
        );
      resistingSum +=
        (cohesionKPa * widthM +
          weightsKN[i] * (1 - porePressureRatioRu) * tanPhi) /
        mAlpha;
    }
    const next = resistingSum / drivingMoment;
    if (!Number.isFinite(next))
      simpleError(
        "sliceWeightsKN",
        "The Bishop iteration diverged for these slices.",
        "invalid_slices",
      );
    if (Math.abs(next - factorOfSafety) < 1e-12) {
      factorOfSafety = next;
      converged = true;
      break;
    }
    factorOfSafety = next;
  }
  if (!converged)
    simpleError(
      "sliceAnglesDeg",
      "The Bishop iteration did not converge for these slices.",
      "non_convergent_slices",
    );
  return { factorOfSafety };
};

export const slopeStabilityFactorOfSafetyBishopExample = {
  input: {
    sliceAnglesDeg: [10, 25],
    sliceWeightsKN: [500, 400],
    sliceWidthM: 2,
    cohesionKPa: 8,
    frictionAngleDeg: 24,
    porePressureRatioRu: 0,
  },
  output: { factorOfSafety: 1.6471439323576116 },
} satisfies ToolExample<
  SlopeStabilityFactorOfSafetyBishopInput,
  SlopeStabilityFactorOfSafetyBishopOutput
>;

export const slopeStabilityFactorOfSafetyBishopTool = createSimpleTool({
  id: "geology/slope-stability-factor-of-safety-bishop",
  title: "Slope Stability Factor Of Safety Bishop Calculator",
  description:
    "Bishop simplified method of slices with uniform slice width and pore pressure ratio ru: FS solves FS = sum[(c'b + W(1-ru)tan(phi'))/m_alpha] / sum[W sin(alpha)] with m_alpha = cos(alpha) + tan(phi')sin(alpha)/FS.",
  inputs: [
    {
      description: "Base inclination angles alpha of the slices in degrees.",
      id: "sliceAnglesDeg",
      kind: "numberList",
      label: "alpha_i",
    },
    {
      description: "Slice weights W in kilonewtons.",
      id: "sliceWeightsKN",
      kind: "numberList",
      label: "W_i",
      unit: "kN",
    },
    {
      default: 1,
      description: "Common slice width b in metres.",
      id: "sliceWidthM",
      kind: "number",
      label: "b",
      unit: "m",
    },
    {
      default: 0,
      description: "Effective cohesion c' in kilopascals.",
      id: "cohesionKPa",
      kind: "number",
      label: "c'",
      unit: "kPa",
    },
    {
      default: 25,
      description: "Effective friction angle phi' in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi'",
    },
    {
      default: 0,
      description: "Pore water pressure ratio ru.",
      id: "porePressureRatioRu",
      kind: "number",
      label: "ru",
    },
  ],
  outputs: [
    {
      description: "Factor of safety from the Bishop simplified iteration.",
      id: "factorOfSafety",
      kind: "number",
      label: "FS",
    },
  ],
  calculate: (input) =>
    calculateSlopeStabilityFactorOfSafetyBishop(
      input as unknown as SlopeStabilityFactorOfSafetyBishopInput,
    ),
});

export const runSlopeStabilityFactorOfSafetyBishop =
  slopeStabilityFactorOfSafetyBishopTool.execute;
export default slopeStabilityFactorOfSafetyBishopTool;
