import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG = Math.PI / 180;

export type BearingCapacityVesicInput = {
  readonly cohesionKpa?: number;
  readonly frictionAngleDeg: number;
  readonly surchargeKpa?: number;
  readonly unitWeightKnPerM3: number;
  readonly footingWidthM: number;
  readonly footingLengthM: number;
  readonly foundationDepthM?: number;
};

export type BearingCapacityVesicOutput = {
  readonly nc: number;
  readonly nq: number;
  readonly nGamma: number;
  readonly ultimateBearingCapacityKpa: number;
};

export const calculateBearingCapacityVesic = (
  input: BearingCapacityVesicInput,
): BearingCapacityVesicOutput => {
  const cohesion = input.cohesionKpa ?? 0;
  const surcharge = input.surchargeKpa ?? 0;
  const depth = input.foundationDepthM ?? 0;
  if (!(cohesion >= 0))
    simpleError(
      "cohesionKpa",
      "Cohesion must be non-negative.",
      "invalid_strength",
    );
  if (!(input.frictionAngleDeg >= 0 && input.frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must lie between 0 and 90 degrees.",
      "invalid_friction_angle",
    );
  if (!(surcharge >= 0))
    simpleError(
      "surchargeKpa",
      "Surcharge must be non-negative.",
      "invalid_stress",
    );
  if (!(input.unitWeightKnPerM3 > 0))
    simpleError(
      "unitWeightKnPerM3",
      "Unit weight must be greater than zero.",
      "invalid_unit_weight",
    );
  if (!(input.footingWidthM > 0))
    simpleError(
      "footingWidthM",
      "Footing width must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.footingLengthM >= input.footingWidthM))
    simpleError(
      "footingLengthM",
      "Footing length must not be smaller than the width.",
      "invalid_geometry",
    );
  const radian = input.frictionAngleDeg * DEG;
  const tanPhi = Math.tan(radian);
  const sinPhi = Math.sin(radian);
  const nq =
    radian === 0
      ? 1
      : Math.tan(Math.PI / 4 + radian / 2) ** 2 * Math.exp(Math.PI * tanPhi);
  const nc = radian === 0 ? Math.PI + 2 : (nq - 1) / Math.tan(radian);
  const nGamma = 2 * (nq + 1) * tanPhi;
  const widthRatio = input.footingWidthM / input.footingLengthM;
  const shapeC = 1 + widthRatio * (nq / nc);
  const shapeQ = 1 + widthRatio * tanPhi;
  const shapeGamma = 1 - 0.4 * widthRatio;
  const depthQ =
    1 + 2 * tanPhi * (1 - sinPhi) ** 2 * (depth / input.footingWidthM);
  const depthC =
    radian === 0
      ? 1 + (2 * (depth / input.footingWidthM)) / (Math.PI + 2)
      : depthQ - (1 - depthQ) / (nc * tanPhi);
  return {
    nc,
    nq,
    nGamma,
    ultimateBearingCapacityKpa:
      cohesion * nc * shapeC * depthC +
      surcharge * shapeQ * depthQ +
      0.5 * input.unitWeightKnPerM3 * input.footingWidthM * nGamma * shapeGamma,
  };
};

export const bearingCapacityVesicExample = {
  input: {
    cohesionKpa: 10,
    frictionAngleDeg: 30,
    surchargeKpa: 20,
    unitWeightKnPerM3: 18,
    footingWidthM: 2,
    footingLengthM: 2,
    foundationDepthM: 1,
  },
  output: {
    nc: 30.139627791519086,
    nq: 18.401122218708668,
    nGamma: 22.402486271104557,
    ultimateBearingCapacityKpa: 837.5436358874383,
  },
} satisfies ToolExample<BearingCapacityVesicInput, BearingCapacityVesicOutput>;

export const bearingCapacityVesicTool = createSimpleTool({
  id: "geology/bearing-capacity-vesic",
  title: "Bearing Capacity Vesic Calculator",
  description:
    "Ultimate bearing capacity with Vesic (1973) shape and depth factors: qu = c*Nc*sc*dc + q*sq*dq + 0.5*gamma*B*Ngamma*sGamma, dGamma = 1. Factors Nq = exp(pi*tan(phi))*tan^2(45 + phi/2), Nc = (Nq - 1)*cot(phi), Ngamma = 2*(Nq + 1)*tan(phi) (Vesic convention). Shape factors sc = 1 + (B/L)*(Nq/Nc), sq = 1 + (B/L)*tan(phi), sGamma = 1 - 0.4*B/L; depth factors dq = 1 + 2*tan(phi)*(1 - sin(phi))^2*Df/B and dc = dq - (1 - dq)/(Nc*tan(phi)). c and q in kPa, gamma in kN/m3, lengths in m.",
  inputs: [
    {
      default: 0,
      description: "Soil cohesion c in kPa.",
      id: "cohesionKpa",
      kind: "number",
      label: "c",
      minimum: 0,
    },
    {
      description: "Friction angle phi in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi",
      minimum: 0,
    },
    {
      default: 0,
      description: "Effective surcharge q at footing base level in kPa.",
      id: "surchargeKpa",
      kind: "number",
      label: "q",
      minimum: 0,
    },
    {
      description: "Bulk unit weight gamma in kN/m3.",
      id: "unitWeightKnPerM3",
      kind: "number",
      label: "gamma",
      minimum: 0,
    },
    {
      description: "Footing width B in m.",
      id: "footingWidthM",
      kind: "number",
      label: "B",
      minimum: 0,
    },
    {
      description: "Footing length L in m (must be at least B).",
      id: "footingLengthM",
      kind: "number",
      label: "L",
      minimum: 0,
    },
    {
      default: 0,
      description: "Foundation embedment depth Df in m below ground surface.",
      id: "foundationDepthM",
      kind: "number",
      label: "Df",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Bearing capacity factor Nc.",
      id: "nc",
      kind: "number",
      label: "Nc",
    },
    {
      description: "Bearing capacity factor Nq.",
      id: "nq",
      kind: "number",
      label: "Nq",
    },
    {
      description: "Third bearing capacity factor Ngamma (Vesic convention).",
      id: "nGamma",
      kind: "number",
      label: "Ngamma",
    },
    {
      description:
        "Ultimate bearing capacity qu in kPa including shape and depth effects.",
      id: "ultimateBearingCapacityKpa",
      kind: "number",
      label: "qu",
    },
  ],
  calculate: (input) =>
    calculateBearingCapacityVesic(
      input as unknown as BearingCapacityVesicInput,
    ),
});

export const runBearingCapacityVesic = bearingCapacityVesicTool.execute;
export default bearingCapacityVesicTool;
