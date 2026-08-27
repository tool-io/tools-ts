import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlopeStabilityFactorOfSafetyInfiniteSlopeInput = {
  readonly slopeAngleDeg: number;
  readonly frictionAngleDeg?: number;
  readonly cohesionKPa?: number;
  readonly unitWeightKNPerM3?: number;
  readonly failureDepthM?: number;
  readonly porePressureRatioRu?: number;
};

export type SlopeStabilityFactorOfSafetyInfiniteSlopeOutput = {
  readonly factorOfSafety: number;
};

export const calculateSlopeStabilityFactorOfSafetyInfiniteSlope = (
  input: SlopeStabilityFactorOfSafetyInfiniteSlopeInput,
): SlopeStabilityFactorOfSafetyInfiniteSlopeOutput => {
  const slopeAngleDeg = input.slopeAngleDeg;
  const frictionAngleDeg = input.frictionAngleDeg ?? 30;
  const cohesionKPa = input.cohesionKPa ?? 0;
  const unitWeightKNPerM3 = input.unitWeightKNPerM3 ?? 18;
  const failureDepthM = input.failureDepthM ?? 1;
  const porePressureRatioRu = input.porePressureRatioRu ?? 0;
  if (!(slopeAngleDeg > 0 && slopeAngleDeg < 90))
    simpleError(
      "slopeAngleDeg",
      "Slope angle must be between 0 and 90 degrees (exclusive).",
      "invalid_slope_angle",
    );
  if (!(frictionAngleDeg >= 0 && frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must be in the range [0, 90) degrees.",
      "invalid_friction_angle",
    );
  if (!(cohesionKPa >= 0))
    simpleError(
      "cohesionKPa",
      "Cohesion must be non-negative.",
      "invalid_cohesion",
    );
  if (!(unitWeightKNPerM3 > 0))
    simpleError(
      "unitWeightKNPerM3",
      "Unit weight must be greater than zero.",
      "invalid_unit_weight",
    );
  if (!(failureDepthM > 0))
    simpleError(
      "failureDepthM",
      "Failure depth must be greater than zero.",
      "invalid_depth",
    );
  if (!(porePressureRatioRu >= 0 && porePressureRatioRu < 1))
    simpleError(
      "porePressureRatioRu",
      "Pore pressure ratio ru must be in the range [0, 1).",
      "invalid_pore_pressure",
    );
  const betaRad = (slopeAngleDeg * Math.PI) / 180;
  const phiRad = (frictionAngleDeg * Math.PI) / 180;
  const drivingShearKPa =
    unitWeightKNPerM3 * failureDepthM * Math.sin(betaRad) * Math.cos(betaRad);
  const resistingShearKPa =
    cohesionKPa +
    unitWeightKNPerM3 *
      failureDepthM *
      Math.cos(betaRad) ** 2 *
      (1 - porePressureRatioRu) *
      Math.tan(phiRad);
  return { factorOfSafety: resistingShearKPa / drivingShearKPa };
};

export const slopeStabilityFactorOfSafetyInfiniteSlopeExample = {
  input: {
    slopeAngleDeg: 35,
    frictionAngleDeg: 28,
    cohesionKPa: 6,
    unitWeightKNPerM3: 19,
    failureDepthM: 3,
    porePressureRatioRu: 0.15,
  },
  output: { factorOfSafety: 0.8694932260287275 },
} satisfies ToolExample<
  SlopeStabilityFactorOfSafetyInfiniteSlopeInput,
  SlopeStabilityFactorOfSafetyInfiniteSlopeOutput
>;

export const slopeStabilityFactorOfSafetyInfiniteSlopeTool = createSimpleTool({
  id: "geology/slope-stability-factor-of-safety-infinite-slope",
  title: "Slope Stability Factor Of Safety Infinite Slope Calculator",
  description:
    "Factor of safety of an infinite slope with a planar failure plane parallel to the slope at depth z: FS = (c' + gamma*z*cos^2(beta)*(1-ru)*tan(phi')) / (gamma*z*sin(beta)*cos(beta)).",
  inputs: [
    {
      description: "Slope angle beta in degrees.",
      id: "slopeAngleDeg",
      kind: "number",
      label: "beta",
    },
    {
      default: 30,
      description: "Effective friction angle phi' in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi'",
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
      default: 18,
      description: "Bulk unit weight gamma in kN/m³.",
      id: "unitWeightKNPerM3",
      kind: "number",
      label: "gamma",
      unit: "kN/m³",
    },
    {
      default: 1,
      description: "Vertical depth to the failure plane in metres.",
      id: "failureDepthM",
      kind: "number",
      label: "z",
      unit: "m",
    },
    {
      default: 0,
      description: "Pore water pressure ratio ru = u / (gamma * z).",
      id: "porePressureRatioRu",
      kind: "number",
      label: "ru",
    },
  ],
  outputs: [
    {
      description: "Factor of safety against plane sliding.",
      id: "factorOfSafety",
      kind: "number",
      label: "FS",
    },
  ],
  calculate: (input) =>
    calculateSlopeStabilityFactorOfSafetyInfiniteSlope(
      input as unknown as SlopeStabilityFactorOfSafetyInfiniteSlopeInput,
    ),
});

export const runSlopeStabilityFactorOfSafetyInfiniteSlope =
  slopeStabilityFactorOfSafetyInfiniteSlopeTool.execute;
export default slopeStabilityFactorOfSafetyInfiniteSlopeTool;
