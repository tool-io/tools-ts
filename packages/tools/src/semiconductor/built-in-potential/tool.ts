import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuiltInPotentialInput = {
  readonly acceptorConcentrationPerCm3: number;
  readonly donorConcentrationPerCm3: number;
  readonly niPerCm3: number;
};

export type BuiltInPotentialOutput = {
  readonly builtInVoltageV: number;
};

const THERMAL_VOLTAGE_300K_V = 0.02585;

export const builtInPotentialExample = {
  input: {
    acceptorConcentrationPerCm3: 1e16,
    donorConcentrationPerCm3: 1e18,
    niPerCm3: 1.5e10,
  },
  output: { builtInVoltageV: 0.8123429990653531 },
} satisfies ToolExample<BuiltInPotentialInput, BuiltInPotentialOutput>;

export const calculateBuiltInPotential = (
  input: BuiltInPotentialInput,
): BuiltInPotentialOutput => {
  const na = input.acceptorConcentrationPerCm3;
  const nd = input.donorConcentrationPerCm3;
  const ni = input.niPerCm3;

  if (!Number.isFinite(na) || na <= 0)
    simpleError(
      "acceptorConcentrationPerCm3",
      "Acceptor concentration must be a finite positive number.",
      "invalid_acceptor",
    );
  if (!Number.isFinite(nd) || nd <= 0)
    simpleError(
      "donorConcentrationPerCm3",
      "Donor concentration must be a finite positive number.",
      "invalid_donor",
    );
  if (!Number.isFinite(ni) || ni <= 0)
    simpleError(
      "niPerCm3",
      "Intrinsic carrier concentration must be a finite positive number.",
      "invalid_ni",
    );

  // Use log-sum to avoid overflow of NA*ND and ni^2
  const lnNa = Math.log(na);
  const lnNd = Math.log(nd);
  const lnNi = Math.log(ni);
  if (
    !Number.isFinite(lnNa) ||
    !Number.isFinite(lnNd) ||
    !Number.isFinite(lnNi)
  )
    simpleError("niPerCm3", "Logarithm overflowed.", "numeric_overflow");

  const lnRatio = lnNa + lnNd - 2 * lnNi;
  if (!Number.isFinite(lnRatio))
    simpleError(
      "niPerCm3",
      "Built-in potential logarithm overflowed.",
      "numeric_overflow",
    );
  if (lnRatio <= 0)
    simpleError(
      "niPerCm3",
      "NA·ND must exceed ni² for a positive pn-junction built-in potential.",
      "invalid_junction_concentrations",
    );

  const builtInVoltageV = THERMAL_VOLTAGE_300K_V * lnRatio;
  if (!Number.isFinite(builtInVoltageV))
    simpleError(
      "niPerCm3",
      "Built-in potential could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return { builtInVoltageV: builtInVoltageV === 0 ? 0 : builtInVoltageV };
};

export const builtInPotentialTool = createSimpleTool({
  calculate: (input) =>
    calculateBuiltInPotential({
      acceptorConcentrationPerCm3: input.acceptorConcentrationPerCm3 as number,
      donorConcentrationPerCm3: input.donorConcentrationPerCm3 as number,
      niPerCm3: input.niPerCm3 as number,
    }),
  description:
    "Compute the pn-junction built-in potential at 300 K as Vbi = (kT/q)·ln(NA·ND/ni²) where kT/q = 0.02585 V, NA and ND are acceptor and donor concentrations and ni is intrinsic concentration in cm⁻³.",
  id: "semiconductor/built-in-potential",
  inputs: [
    {
      description:
        "Acceptor concentration on the p side. Must be greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "acceptorConcentrationPerCm3",
      kind: "number",
      label: "NA",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description:
        "Donor concentration on the n side. Must be greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "donorConcentrationPerCm3",
      kind: "number",
      label: "ND",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description:
        "Intrinsic carrier concentration at 300 K. Must be greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "niPerCm3",
      kind: "number",
      label: "ni",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  outputs: [
    {
      description:
        "Positive built-in potential across a nondegenerate pn junction at 300 K.",
      format: "voltage-v",
      id: "builtInVoltageV",
      kind: "number",
      label: "Vbi",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  title: "Built-In Potential Calculator",
});
export const runBuiltInPotential = builtInPotentialTool.execute;
export default builtInPotentialTool;
