import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG = Math.PI / 180;

export type BearingCapacityFactorNgammaInput = {
  readonly frictionAngleDeg: number;
};

export type BearingCapacityFactorNgammaOutput = {
  readonly nGamma: number;
};

export const calculateBearingCapacityFactorNgamma = (
  input: BearingCapacityFactorNgammaInput,
): BearingCapacityFactorNgammaOutput => {
  if (!(input.frictionAngleDeg >= 0 && input.frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must lie between 0 and 90 degrees.",
      "invalid_friction_angle",
    );
  const radian = input.frictionAngleDeg * DEG;
  const tanPhi = Math.tan(radian);
  const nq =
    Math.tan(Math.PI / 4 + radian / 2) ** 2 * Math.exp(Math.PI * tanPhi);
  return { nGamma: 2 * (nq + 1) * tanPhi };
};

export const bearingCapacityFactorNgammaExample = {
  input: { frictionAngleDeg: 30 },
  output: { nGamma: 22.402486271104557 },
} satisfies ToolExample<
  BearingCapacityFactorNgammaInput,
  BearingCapacityFactorNgammaOutput
>;

export const bearingCapacityFactorNgammaTool = createSimpleTool({
  id: "geology/bearing-capacity-factor-ngamma",
  title: "Bearing Capacity Factor Ngamma Calculator",
  description:
    "Unit-weight bearing capacity factor Ngamma = 2 * (Nq + 1) * tan(phi) with Nq = tan^2(45 + phi/2) * exp(pi * tan(phi)); this is the Vesic (1973) convention, which differs from Terzaghi's and Meyerhof's original third factors. Equals 0 at phi = 0.",
  inputs: [
    {
      description: "Friction angle phi in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Unit-weight bearing capacity factor Ngamma (Vesic convention), dimensionless.",
      id: "nGamma",
      kind: "number",
      label: "Ngamma",
    },
  ],
  calculate: (input) =>
    calculateBearingCapacityFactorNgamma(
      input as unknown as BearingCapacityFactorNgammaInput,
    ),
});

export const runBearingCapacityFactorNgamma =
  bearingCapacityFactorNgammaTool.execute;
export default bearingCapacityFactorNgammaTool;
