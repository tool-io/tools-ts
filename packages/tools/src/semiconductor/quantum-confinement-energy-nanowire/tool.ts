import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const ELECTRON_MASS_KG = 9.1093837015e-31;
const REDUCED_PLANCK_J_S = 1.054571817e-34;
const FIRST_BESSEL_J0_ZERO = 2.404825557695773;

export type NanowireQuantumConfinementInput = {
  readonly diameterNm: number;
  readonly effectiveMassRatio: number;
};

export type NanowireQuantumConfinementOutput = {
  readonly confinementMilliEv: number;
};

export const calculateNanowireQuantumConfinement = (
  input: NanowireQuantumConfinementInput,
): NanowireQuantumConfinementOutput => {
  if (!Number.isFinite(input.diameterNm) || input.diameterNm <= 0)
    simpleError("diameterNm", "Nanowire diameter must be positive.");
  if (
    !Number.isFinite(input.effectiveMassRatio) ||
    input.effectiveMassRatio <= 0
  )
    simpleError("effectiveMassRatio", "Effective-mass ratio must be positive.");
  const diameterM = input.diameterNm * 1e-9;
  const confinementJoules =
    (2 * REDUCED_PLANCK_J_S ** 2 * FIRST_BESSEL_J0_ZERO ** 2) /
    (ELECTRON_MASS_KG * input.effectiveMassRatio * diameterM ** 2);
  const confinementMilliEv = (confinementJoules / ELEMENTARY_CHARGE_C) * 1000;
  if (!Number.isFinite(confinementMilliEv) || confinementMilliEv <= 0)
    simpleError(
      "diameterNm",
      "Confinement energy is outside the representable range.",
      "numeric_range",
    );
  return { confinementMilliEv };
};

export const nanowireQuantumConfinementExample = {
  input: { diameterNm: 10, effectiveMassRatio: 0.067 },
  output: { confinementMilliEv: 131.54528397745645 },
} satisfies ToolExample<
  NanowireQuantumConfinementInput,
  NanowireQuantumConfinementOutput
>;

export const nanowireQuantumConfinementTool = createSimpleTool({
  id: "semiconductor/quantum-confinement-energy-nanowire",
  title: "Cylindrical Nanowire Quantum Confinement Calculator",
  description:
    "Calculate the radial ground-state confinement energy of a circular hard-wall nanowire from its diameter and carrier effective mass using the first zero of J₀.",
  inputs: [
    {
      description: "Diameter of the circular hard-wall nanowire cross-section.",
      id: "diameterNm",
      kind: "number",
      label: "Diameter",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Carrier effective mass divided by the free-electron mass.",
      format: "ratio",
      id: "effectiveMassRatio",
      kind: "number",
      label: "Effective-mass ratio",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description:
        "Lowest radial subband energy above the unconfined band edge.",
      format: "energy-meV",
      id: "confinementMilliEv",
      kind: "number",
      label: "Confinement energy",
      minimum: Number.MIN_VALUE,
      unit: "meV",
    },
  ],
  calculate: (input) =>
    calculateNanowireQuantumConfinement({
      diameterNm: input.diameterNm as number,
      effectiveMassRatio: input.effectiveMassRatio as number,
    }),
});
export const runNanowireQuantumConfinement =
  nanowireQuantumConfinementTool.execute;
export default nanowireQuantumConfinementTool;
