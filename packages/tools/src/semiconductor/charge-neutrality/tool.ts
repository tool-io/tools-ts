import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChargeNeutralityInput = {
  readonly donorConc: number;
  readonly acceptorConc: number;
  readonly intrinsicConc: number;
};

export type ChargeNeutralityOutput = {
  readonly electronConcPerCm3: number;
  readonly holeConcPerCm3: number;
};

export const chargeNeutralityExample = {
  input: { donorConc: 1e17, acceptorConc: 1e15, intrinsicConc: 1e10 },
  output: {
    electronConcPerCm3: 99000000000001010,
    holeConcPerCm3: 1010.1010101009998,
  },
} satisfies ToolExample<ChargeNeutralityInput, ChargeNeutralityOutput>;

export const calculateChargeNeutrality = (
  input: ChargeNeutralityInput,
): ChargeNeutralityOutput => {
  const nd = input.donorConc;
  const na = input.acceptorConc;
  const ni = input.intrinsicConc;

  if (!Number.isFinite(nd) || nd < 0)
    simpleError(
      "donorConc",
      "Donor concentration must be a finite number at least 0 cm⁻³.",
      "invalid_donor",
    );
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

  const net = nd - na;
  if (!Number.isFinite(net))
    simpleError(
      "donorConc",
      "Net doping subtraction overflowed.",
      "numeric_overflow",
    );

  const halfNet = net / 2;
  const hypot = Math.hypot(halfNet, ni);
  if (!Number.isFinite(hypot))
    simpleError(
      "donorConc",
      "Charge neutrality intermediate overflowed.",
      "numeric_overflow",
    );

  const majority = hypot + Math.abs(halfNet);
  const electronConcPerCm3 = net >= 0 ? majority : ni * (ni / majority);
  if (!Number.isFinite(electronConcPerCm3) || electronConcPerCm3 <= 0)
    simpleError(
      "donorConc",
      "Electron concentration could not be calculated.",
      "numeric_overflow",
    );

  const holeConcPerCm3 = net >= 0 ? ni * (ni / majority) : majority;
  if (!Number.isFinite(holeConcPerCm3) || holeConcPerCm3 <= 0)
    simpleError(
      "intrinsicConc",
      "Hole concentration could not be calculated.",
      "numeric_overflow",
    );

  return {
    electronConcPerCm3: electronConcPerCm3 === 0 ? 0 : electronConcPerCm3,
    holeConcPerCm3: holeConcPerCm3 === 0 ? 0 : holeConcPerCm3,
  };
};

export const chargeNeutralityTool = createSimpleTool({
  calculate: (input) =>
    calculateChargeNeutrality({
      acceptorConc: input.acceptorConc as number,
      donorConc: input.donorConc as number,
      intrinsicConc: input.intrinsicConc as number,
    }),
  description:
    "Solve the exact charge-neutrality relations n = (Nd-Na+√((Nd-Na)²+4ni²))/2 and p = ni²/n for equilibrium electron and hole concentrations. Nd, Na, ni in cm⁻³.",
  id: "semiconductor/charge-neutrality",
  inputs: [
    {
      description: "Ionized donor concentration. Must be at least 0 cm⁻³.",
      id: "donorConc",
      kind: "number",
      label: "Donor concentration",
      minimum: 0,
      unit: "cm^-3",
    },
    {
      description: "Ionized acceptor concentration. Must be at least 0 cm⁻³.",
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
      description: "Equilibrium electron concentration. Satisfies n·p = ni².",
      id: "electronConcPerCm3",
      kind: "number",
      label: "Electron concentration",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
    },
    {
      description: "Equilibrium hole concentration. Satisfies n·p = ni².",
      id: "holeConcPerCm3",
      kind: "number",
      label: "Hole concentration",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
    },
  ],
  title: "Charge Neutrality Carrier Solver",
});
export const runChargeNeutrality = chargeNeutralityTool.execute;
export default chargeNeutralityTool;
