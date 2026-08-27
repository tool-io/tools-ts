import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MohrCoulombShearStrengthInput = {
  readonly normalStressKPa: number;
  readonly cohesionKPa?: number;
  readonly frictionAngleDeg?: number;
};

export type MohrCoulombShearStrengthOutput = {
  readonly shearStrengthKPa: number;
};

export const calculateMohrCoulombShearStrength = (
  input: MohrCoulombShearStrengthInput,
): MohrCoulombShearStrengthOutput => {
  const { normalStressKPa } = input;
  const cohesionKPa = input.cohesionKPa ?? 0;
  const frictionAngleDeg = input.frictionAngleDeg ?? 30;
  if (!(normalStressKPa >= 0))
    simpleError(
      "normalStressKPa",
      "Normal stress must be non-negative.",
      "invalid_stress",
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
  return {
    shearStrengthKPa:
      cohesionKPa +
      normalStressKPa * Math.tan((frictionAngleDeg * Math.PI) / 180),
  };
};

export const mohrCoulombShearStrengthExample = {
  input: { normalStressKPa: 100, cohesionKPa: 10, frictionAngleDeg: 30 },
  output: { shearStrengthKPa: 67.73502691896257 },
} satisfies ToolExample<
  MohrCoulombShearStrengthInput,
  MohrCoulombShearStrengthOutput
>;

export const mohrCoulombShearStrengthTool = createSimpleTool({
  id: "geology/mohr-coulomb-shear-strength",
  title: "Mohr Coulomb Shear Strength Calculator",
  description:
    "Mohr-Coulomb shear strength tau_f = c' + sigma_n' * tan(phi') for given effective normal stress, cohesion and friction angle.",
  inputs: [
    {
      description:
        "Effective normal stress on the failure plane in kilopascals.",
      id: "normalStressKPa",
      kind: "number",
      label: "sigma_n'",
      unit: "kPa",
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
      default: 30,
      description: "Effective friction angle phi' in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi'",
    },
  ],
  outputs: [
    {
      description: "Shear strength at failure in kilopascals.",
      id: "shearStrengthKPa",
      kind: "number",
      label: "tau_f",
      unit: "kPa",
    },
  ],
  calculate: (input) =>
    calculateMohrCoulombShearStrength(
      input as unknown as MohrCoulombShearStrengthInput,
    ),
});

export const runMohrCoulombShearStrength = mohrCoulombShearStrengthTool.execute;
export default mohrCoulombShearStrengthTool;
