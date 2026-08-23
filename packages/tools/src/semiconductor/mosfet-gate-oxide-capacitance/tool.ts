import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const EPS_OX_F_PER_CM = 3.9 * 8.8541878188e-14;

export type MosfetGateOxideCapacitanceInput = {
  readonly oxideThicknessNm: number;
};

export type MosfetGateOxideCapacitanceOutput = {
  readonly coxFfPerUm2: number;
};

export const mosfetGateOxideCapacitanceExample = {
  input: { oxideThicknessNm: 2 },
  output: { coxFfPerUm2: 17.26566624666 },
} satisfies ToolExample<
  MosfetGateOxideCapacitanceInput,
  MosfetGateOxideCapacitanceOutput
>;

export const calculateMosfetGateOxideCapacitance = (
  input: MosfetGateOxideCapacitanceInput,
): MosfetGateOxideCapacitanceOutput => {
  if (!Number.isFinite(input.oxideThicknessNm) || input.oxideThicknessNm <= 0)
    simpleError(
      "oxideThicknessNm",
      "Oxide thickness must be a finite positive number.",
      "invalid_thickness",
    );
  const toxCm = input.oxideThicknessNm * 1e-7;
  const coxFPerCm2 = EPS_OX_F_PER_CM / toxCm;
  const coxFfPerUm2 = coxFPerCm2 * 1e7;
  // Check overflow
  if (!Number.isFinite(coxFfPerUm2) || coxFfPerUm2 <= 0)
    simpleError(
      "oxideThicknessNm",
      "Gate capacitance is outside the positive finite numeric range.",
      "numeric_range",
    );
  return { coxFfPerUm2 };
};

export const mosfetGateOxideCapacitanceTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetGateOxideCapacitance({
      oxideThicknessNm: input.oxideThicknessNm as number,
    }),
  description:
    "Compute ideal SiO₂ gate oxide capacitance per unit area from thickness using Cox = εox/tox and εox = 3.9·ε0.",
  id: "semiconductor/mosfet-gate-oxide-capacitance",
  inputs: [
    {
      description: "Average gate oxide thickness. Must be greater than 0 nm.",
      format: "length",
      id: "oxideThicknessNm",
      kind: "number",
      label: "tox",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Ideal parallel-plate SiO₂ gate capacitance per unit area.",
      format: "capacitance-ff-um2",
      id: "coxFfPerUm2",
      kind: "number",
      label: "Cox",
      minimum: Number.MIN_VALUE,
      unit: "fF/µm²",
    },
  ],
  title: "MOSFET SiO₂ Gate Oxide Capacitance Calculator",
});
export const runMosfetGateOxideCapacitance =
  mosfetGateOxideCapacitanceTool.execute;
export default mosfetGateOxideCapacitanceTool;
