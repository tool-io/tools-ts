import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const SILICON_EPSILON_F_PER_CM = 11.7 * 8.854187817e-14;

export const mosfetDepletionChargeExample = {
  input: { dopingPerCm3: 1e17, surfacePotentialV: 0.6 },
  output: { depletionChargeNCm2: 0.00014112797687969807 },
} satisfies ToolExample<
  MosfetDepletionChargeInput,
  MosfetDepletionChargeOutput
>;

export type MosfetDepletionChargeInput = {
  readonly dopingPerCm3: number;
  readonly surfacePotentialV: number;
};
export type MosfetDepletionChargeOutput = {
  readonly depletionChargeNCm2: number;
};

export const calculateMosfetDepletionCharge = (
  input: MosfetDepletionChargeInput,
): MosfetDepletionChargeOutput => {
  if (!Number.isFinite(input.dopingPerCm3) || input.dopingPerCm3 <= 0)
    simpleError(
      "dopingPerCm3",
      "Doping and surface potential must be positive.",
      "invalid_input",
    );
  if (!Number.isFinite(input.surfacePotentialV) || input.surfacePotentialV <= 0)
    simpleError("surfacePotentialV", "Surface potential must be positive.");
  const qdep =
    Math.sqrt(
      2 *
        ELEMENTARY_CHARGE_C *
        SILICON_EPSILON_F_PER_CM *
        input.dopingPerCm3 *
        input.surfacePotentialV,
    ) * 1000;
  if (!Number.isFinite(qdep) || qdep <= 0)
    simpleError(
      "dopingPerCm3",
      "The depletion charge is outside the representable range.",
      "numeric_range",
    );
  return { depletionChargeNCm2: qdep };
};

export const mosfetDepletionChargeTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetDepletionCharge({
      dopingPerCm3: input.dopingPerCm3 as number,
      surfacePotentialV: input.surfacePotentialV as number,
    }),
  description:
    "Compute the depletion charge per unit area at the onset of strong inversion.",
  id: "semiconductor/mosfet-depletion-charge",
  inputs: [
    {
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "NA",
      unit: "cm^-3",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Surface potential at threshold.",
      format: "voltage-v",
      id: "surfacePotentialV",
      kind: "number",
      label: "phi_s",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "depletionChargeNCm2",
      kind: "number",
      label: "Qdep magnitude",
      minimum: Number.MIN_VALUE,
      unit: "nC/cm²",
    },
  ],
  title: "MOSFET Depletion Charge Calculator",
});
export const runMosfetDepletionCharge = mosfetDepletionChargeTool.execute;
export default mosfetDepletionChargeTool;
