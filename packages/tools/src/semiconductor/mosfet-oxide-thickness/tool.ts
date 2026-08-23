import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const EPS_OX_F_PER_CM = 3.9 * 8.8541878188e-14;

export type MosfetOxideThicknessInput = {
  readonly coxFfPerUm2: number;
};

export type MosfetOxideThicknessOutput = {
  readonly oxideThicknessNm: number;
};

export const mosfetOxideThicknessExample = {
  input: { coxFfPerUm2: 17.26 },
  output: { oxideThicknessNm: 2.000656575511008 },
} satisfies ToolExample<MosfetOxideThicknessInput, MosfetOxideThicknessOutput>;

export const calculateMosfetOxideThickness = (
  input: MosfetOxideThicknessInput,
): MosfetOxideThicknessOutput => {
  if (!Number.isFinite(input.coxFfPerUm2) || input.coxFfPerUm2 <= 0)
    simpleError(
      "coxFfPerUm2",
      "Gate oxide capacitance must be a finite positive number.",
      "invalid_capacitance",
    );
  const toxNm = (EPS_OX_F_PER_CM / (input.coxFfPerUm2 * 1e-7)) * 1e7;
  if (!Number.isFinite(toxNm) || toxNm <= 0)
    simpleError(
      "coxFfPerUm2",
      "Oxide thickness is outside the positive finite numeric range.",
      "numeric_range",
    );
  return { oxideThicknessNm: toxNm };
};

export const mosfetOxideThicknessTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetOxideThickness({
      coxFfPerUm2: input.coxFfPerUm2 as number,
    }),
  description:
    "Compute the equivalent SiO₂ gate oxide thickness from capacitance per unit area using εox = 3.9·ε0.",
  id: "semiconductor/mosfet-oxide-thickness",
  inputs: [
    {
      description:
        "Gate oxide capacitance per unit area. Must be greater than 0 fF/µm².",
      format: "capacitance-ff-um2",
      id: "coxFfPerUm2",
      kind: "number",
      label: "Cox",
      minimum: Number.MIN_VALUE,
      unit: "fF/µm²",
    },
  ],
  outputs: [
    {
      description:
        "Equivalent SiO₂ thickness for an ideal parallel-plate gate dielectric.",
      format: "length",
      id: "oxideThicknessNm",
      kind: "number",
      label: "tox",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "MOSFET SiO₂ Oxide Thickness Calculator",
});
export const runMosfetOxideThickness = mosfetOxideThicknessTool.execute;
export default mosfetOxideThicknessTool;
