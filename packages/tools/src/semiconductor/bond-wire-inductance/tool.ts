import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BondWireInductanceInput = {
  readonly lengthMm: number;
  readonly wireDiameterMm: number;
};

export type BondWireInductanceOutput = {
  readonly inductanceNh: number;
};

export const bondWireInductanceExample = {
  input: { lengthMm: 1, wireDiameterMm: 0.025 },
  output: { inductanceNh: 0.8650347630467654 },
} satisfies ToolExample<BondWireInductanceInput, BondWireInductanceOutput>;

export const calculateBondWireInductance = (
  input: BondWireInductanceInput,
): BondWireInductanceOutput => {
  const l = input.lengthMm;
  const d = input.wireDiameterMm;

  if (!Number.isFinite(l) || l <= 0)
    simpleError(
      "lengthMm",
      "Bond wire length must be a finite positive number.",
      "invalid_length",
    );
  if (!Number.isFinite(d) || d <= 0)
    simpleError(
      "wireDiameterMm",
      "Bond wire diameter must be a finite positive number.",
      "invalid_diameter",
    );

  const logTerm = Math.log(4) + Math.log(l) - Math.log(d);
  if (!Number.isFinite(logTerm))
    simpleError("wireDiameterMm", "Logarithm overflowed.", "numeric_overflow");

  const geometryTerm = logTerm - 0.75;
  if (geometryTerm <= 0)
    simpleError(
      "wireDiameterMm",
      "Wire geometry is outside the model domain and would produce non-positive inductance.",
      "invalid_geometry",
    );
  const inductanceNh = 0.2 * l * geometryTerm;
  if (!Number.isFinite(inductanceNh))
    simpleError(
      "lengthMm",
      "Inductance could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return { inductanceNh: inductanceNh === 0 ? 0 : inductanceNh };
};

export const bondWireInductanceTool = createSimpleTool({
  calculate: (input) =>
    calculateBondWireInductance({
      lengthMm: input.lengthMm as number,
      wireDiameterMm: input.wireDiameterMm as number,
    }),
  description:
    "Estimate the parasitic inductance of an isolated round bond wire as 0.2·l·(ln(4·l/d)-0.75) nH where l and d are length and diameter in mm. Assumes straight wire in free space and l >> d.",
  id: "semiconductor/bond-wire-inductance",
  inputs: [
    {
      description: "Length of the bond wire. Must be greater than 0 mm.",
      id: "lengthMm",
      kind: "number",
      label: "Wire length",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      description:
        "Diameter of the round bond wire. Must be greater than 0 mm.",
      id: "wireDiameterMm",
      kind: "number",
      label: "Wire diameter",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Estimated positive parasitic inductance for a slender isolated round wire.",
      minimum: Number.MIN_VALUE,
      id: "inductanceNh",
      kind: "number",
      label: "Inductance",
      unit: "nH",
    },
  ],
  title: "Bond Wire Inductance Calculator",
});
export const runBondWireInductance = bondWireInductanceTool.execute;
export default bondWireInductanceTool;
