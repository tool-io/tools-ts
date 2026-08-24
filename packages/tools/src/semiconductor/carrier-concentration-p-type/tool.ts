import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarrierConcentrationPTypeInput = {
  readonly acceptorConc: number;
  readonly intrinsicConc: number;
};

export type CarrierConcentrationPTypeOutput = {
  readonly holeConcPerCm3: number;
};

export const carrierConcentrationPTypeExample = {
  input: { acceptorConc: 1e15, intrinsicConc: 1e10 },
  output: { holeConcPerCm3: 1000000000100000 },
} satisfies ToolExample<
  CarrierConcentrationPTypeInput,
  CarrierConcentrationPTypeOutput
>;

export const calculateCarrierConcentrationPType = (
  input: CarrierConcentrationPTypeInput,
): CarrierConcentrationPTypeOutput => {
  const na = input.acceptorConc;
  const ni = input.intrinsicConc;

  if (!Number.isFinite(na) || na < 0)
    simpleError(
      "acceptorConc",
      "Acceptor concentration must be a finite number at least 0 cm⁻³.",
      "invalid_acceptor",
    );
  if (!Number.isFinite(ni) || ni <= 0)
    simpleError(
      "intrinsicConc",
      "Intrinsic concentration must be a finite positive number.",
      "invalid_intrinsic",
    );

  const halfNa = na / 2;
  const hypot = Math.hypot(halfNa, ni);
  if (!Number.isFinite(hypot))
    simpleError(
      "acceptorConc",
      "Carrier concentration intermediate overflowed.",
      "numeric_overflow",
    );

  const holeConcPerCm3 = halfNa + hypot;
  if (!Number.isFinite(holeConcPerCm3))
    simpleError(
      "acceptorConc",
      "Hole concentration could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return { holeConcPerCm3: holeConcPerCm3 === 0 ? 0 : holeConcPerCm3 };
};

export const carrierConcentrationPTypeTool = createSimpleTool({
  calculate: (input) =>
    calculateCarrierConcentrationPType({
      acceptorConc: input.acceptorConc as number,
      intrinsicConc: input.intrinsicConc as number,
    }),
  description:
    "Solve the p-type charge-neutrality relation p = (NA + sqrt(NA² + 4·ni²))/2 for equilibrium hole concentration. NA is ionized acceptor concentration and ni is intrinsic concentration in cm⁻³.",
  id: "semiconductor/carrier-concentration-p-type",
  inputs: [
    {
      description:
        "Ionized acceptor concentration. Must be at least 0 cm⁻³; 0 yields p = ni.",
      id: "acceptorConc",
      kind: "number",
      label: "Acceptor concentration",
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
        "Equilibrium hole concentration. At least ni, approaches NA when NA >> ni.",
      id: "holeConcPerCm3",
      kind: "number",
      label: "Hole concentration",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
    },
  ],
  title: "P-Type Carrier Concentration Calculator",
});
export const runCarrierConcentrationPType =
  carrierConcentrationPTypeTool.execute;
export default carrierConcentrationPTypeTool;
