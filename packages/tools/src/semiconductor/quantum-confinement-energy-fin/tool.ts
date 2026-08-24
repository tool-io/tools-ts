import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const ELECTRON_MASS_KG = 9.1093837015e-31;
const REDUCED_PLANCK_J_S = 1.054571817e-34;

export type FinQuantumConfinementInput = {
  readonly effectiveMassRatio: number;
  readonly finWidthNm: number;
};

export type FinQuantumConfinementOutput = {
  readonly confinementMilliEv: number;
};

export const calculateFinQuantumConfinement = (
  input: FinQuantumConfinementInput,
): FinQuantumConfinementOutput => {
  if (!Number.isFinite(input.finWidthNm) || input.finWidthNm <= 0)
    simpleError("finWidthNm", "Fin width must be positive.");
  if (
    !Number.isFinite(input.effectiveMassRatio) ||
    input.effectiveMassRatio <= 0
  )
    simpleError("effectiveMassRatio", "Effective-mass ratio must be positive.");
  const widthM = input.finWidthNm * 1e-9;
  const confinementJoules =
    (Math.PI ** 2 * REDUCED_PLANCK_J_S ** 2) /
    (2 * ELECTRON_MASS_KG * input.effectiveMassRatio * widthM ** 2);
  const confinementMilliEv = (confinementJoules / ELEMENTARY_CHARGE_C) * 1000;
  if (!Number.isFinite(confinementMilliEv) || confinementMilliEv <= 0)
    simpleError(
      "finWidthNm",
      "Confinement energy is outside the representable range.",
      "numeric_range",
    );
  return { confinementMilliEv };
};

export const finQuantumConfinementExample = {
  input: { effectiveMassRatio: 0.19, finWidthNm: 5 },
  output: { confinementMilliEv: 79.16424466440749 },
} satisfies ToolExample<
  FinQuantumConfinementInput,
  FinQuantumConfinementOutput
>;

export const finQuantumConfinementTool = createSimpleTool({
  id: "semiconductor/quantum-confinement-energy-fin",
  title: "Fin Quantum Confinement Calculator",
  description:
    "Calculate the ground-state energy of one-dimensional confinement in an infinite square well using the fin width and carrier effective mass.",
  inputs: [
    {
      description: "Fin width treated as the width of an infinite square well.",
      id: "finWidthNm",
      kind: "number",
      label: "Fin width",
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
        "Lowest infinite-well subband energy above the unconfined band edge.",
      format: "energy-meV",
      id: "confinementMilliEv",
      kind: "number",
      label: "Confinement energy",
      minimum: Number.MIN_VALUE,
      unit: "meV",
    },
  ],
  calculate: (input) =>
    calculateFinQuantumConfinement({
      effectiveMassRatio: input.effectiveMassRatio as number,
      finWidthNm: input.finWidthNm as number,
    }),
});
export const runFinQuantumConfinement = finQuantumConfinementTool.execute;
export default finQuantumConfinementTool;
