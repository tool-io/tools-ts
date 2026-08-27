import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG = Math.PI / 180;

export type BearingCapacityMeyerhofInput = {
  readonly cohesionKpa?: number;
  readonly frictionAngleDeg: number;
  readonly surchargeKpa?: number;
  readonly unitWeightKnPerM3: number;
  readonly footingWidthM: number;
};

export type BearingCapacityMeyerhofOutput = {
  readonly nc: number;
  readonly nq: number;
  readonly nGamma: number;
  readonly ultimateBearingCapacityKpa: number;
};

export const calculateBearingCapacityMeyerhof = (
  input: BearingCapacityMeyerhofInput,
): BearingCapacityMeyerhofOutput => {
  const cohesion = input.cohesionKpa ?? 0;
  const surcharge = input.surchargeKpa ?? 0;
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
  const radian = input.frictionAngleDeg * DEG;
  const tanPhi = Math.tan(radian);
  const nq =
    radian === 0
      ? 1
      : Math.tan(Math.PI / 4 + radian / 2) ** 2 * Math.exp(Math.PI * tanPhi);
  const nc = radian === 0 ? Math.PI + 2 : (nq - 1) / Math.tan(radian);
  const nGamma = (nq - 1) * Math.tan(1.4 * radian);
  return {
    nc,
    nq,
    nGamma,
    ultimateBearingCapacityKpa:
      cohesion * nc +
      surcharge * nq +
      0.5 * input.unitWeightKnPerM3 * input.footingWidthM * nGamma,
  };
};

export const bearingCapacityMeyerhofExample = {
  input: {
    cohesionKpa: 10,
    frictionAngleDeg: 30,
    surchargeKpa: 20,
    unitWeightKnPerM3: 18,
    footingWidthM: 2,
  },
  output: {
    nc: 30.139627791519086,
    nq: 18.401122218708668,
    nGamma: 15.668040821046285,
    ultimateBearingCapacityKpa: 951.4434570681974,
  },
} satisfies ToolExample<
  BearingCapacityMeyerhofInput,
  BearingCapacityMeyerhofOutput
>;

export const bearingCapacityMeyerhofTool = createSimpleTool({
  id: "geology/bearing-capacity-meyerhof",
  title: "Bearing Capacity Meyerhof Calculator",
  description:
    "Ultimate bearing capacity of a shallow strip footing on the Meyerhof (1963) base equation qu = c*Nc + q*Nq + 0.5*gamma*B*Ngamma with Nq = exp(pi*tan(phi))*tan^2(45 + phi/2), Nc = (Nq - 1)*cot(phi) and Meyerhof's Ngamma = (Nq - 1)*tan(1.4*phi). Base equation only: no shape or depth correction factors applied. c and q in kPa, gamma in kN/m3, B in m.",
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
      description:
        "Third bearing capacity factor Ngamma (Meyerhof convention).",
      id: "nGamma",
      kind: "number",
      label: "Ngamma",
    },
    {
      description: "Ultimate bearing capacity qu in kPa.",
      id: "ultimateBearingCapacityKpa",
      kind: "number",
      label: "qu",
    },
  ],
  calculate: (input) =>
    calculateBearingCapacityMeyerhof(
      input as unknown as BearingCapacityMeyerhofInput,
    ),
});

export const runBearingCapacityMeyerhof = bearingCapacityMeyerhofTool.execute;
export default bearingCapacityMeyerhofTool;
