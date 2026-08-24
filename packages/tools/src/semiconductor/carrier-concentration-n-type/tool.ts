import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarrierConcentrationNTypeInput = {
  readonly donorConc: number;
  readonly intrinsicConc: number;
};

export type CarrierConcentrationNTypeOutput = {
  readonly electronConcPerCm3: number;
};

export const carrierConcentrationNTypeExample = {
  input: { donorConc: 1e16, intrinsicConc: 1e10 },
  output: { electronConcPerCm3: 10000000000010000 },
} satisfies ToolExample<
  CarrierConcentrationNTypeInput,
  CarrierConcentrationNTypeOutput
>;

export const calculateCarrierConcentrationNType = (
  input: CarrierConcentrationNTypeInput,
): CarrierConcentrationNTypeOutput => {
  const nd = input.donorConc;
  const ni = input.intrinsicConc;

  if (!Number.isFinite(nd) || nd < 0)
    simpleError(
      "donorConc",
      "Donor concentration must be a finite number at least 0 cm⁻³.",
      "invalid_donor",
    );
  if (!Number.isFinite(ni) || ni <= 0)
    simpleError(
      "intrinsicConc",
      "Intrinsic concentration must be a finite positive number.",
      "invalid_intrinsic",
    );

  // Half-scaled quadratic root avoids overflowing 2*ni or squaring either
  // concentration: n = Nd/2 + hypot(Nd/2, ni).
  const halfNd = nd / 2;
  const hypot = Math.hypot(halfNd, ni);
  if (!Number.isFinite(hypot))
    simpleError(
      "donorConc",
      "Carrier concentration intermediate overflowed.",
      "numeric_overflow",
    );

  const electronConcPerCm3 = halfNd + hypot;
  if (!Number.isFinite(electronConcPerCm3))
    simpleError(
      "donorConc",
      "Electron concentration could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return {
    electronConcPerCm3: electronConcPerCm3 === 0 ? 0 : electronConcPerCm3,
  };
};

export const carrierConcentrationNTypeTool = createSimpleTool({
  calculate: (input) =>
    calculateCarrierConcentrationNType({
      donorConc: input.donorConc as number,
      intrinsicConc: input.intrinsicConc as number,
    }),
  description:
    "Solve the n-type charge-neutrality relation n = (ND + sqrt(ND² + 4·ni²))/2 for equilibrium electron concentration. ND is ionized donor concentration in cm⁻³ and ni is intrinsic concentration in cm⁻³, both per volume.",
  id: "semiconductor/carrier-concentration-n-type",
  inputs: [
    {
      description:
        "Ionized donor concentration. Must be at least 0 cm⁻³; 0 yields n = ni.",
      id: "donorConc",
      kind: "number",
      label: "Donor concentration",
      minimum: 0,
      unit: "cm^-3",
    },
    {
      description:
        "Intrinsic carrier concentration. Must be greater than 0 cm⁻³.",
      id: "intrinsicConc",
      kind: "number",
      label: "Intrinsic concentration",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
    },
  ],
  outputs: [
    {
      description:
        "Equilibrium electron concentration. At least ni, approaches ND when ND >> ni.",
      id: "electronConcPerCm3",
      kind: "number",
      label: "Electron concentration",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
    },
  ],
  title: "N-Type Carrier Concentration Calculator",
});
export const runCarrierConcentrationNType =
  carrierConcentrationNTypeTool.execute;
export default carrierConcentrationNTypeTool;
