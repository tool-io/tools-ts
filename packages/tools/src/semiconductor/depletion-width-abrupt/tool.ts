import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepletionWidthAbruptInput = {
  readonly acceptorConcentrationPerCm3: number;
  readonly donorConcentrationPerCm3: number;
  readonly builtInVoltageV: number;
  readonly reverseBiasV?: number;
};

export type DepletionWidthAbruptOutput = {
  readonly widthUm: number;
};

const SILICON_EPSILON_F_PER_CM = 11.7 * 8.854187817e-14;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const depletionWidthAbruptExample = {
  input: {
    acceptorConcentrationPerCm3: 1e16,
    builtInVoltageV: 0.7,
    donorConcentrationPerCm3: 1e18,
    reverseBiasV: 1,
  },
  output: { widthUm: 0.4712075544210538 },
} satisfies ToolExample<DepletionWidthAbruptInput, DepletionWidthAbruptOutput>;

export const calculateDepletionWidthAbrupt = (
  input: DepletionWidthAbruptInput,
): DepletionWidthAbruptOutput => {
  const acceptor = input.acceptorConcentrationPerCm3;
  const donor = input.donorConcentrationPerCm3;
  const builtIn = input.builtInVoltageV;
  const reverse = input.reverseBiasV ?? 0;

  if (!Number.isFinite(acceptor) || acceptor <= 0)
    simpleError(
      "acceptorConcentrationPerCm3",
      "Acceptor concentration must be a finite positive number.",
      "invalid_acceptor",
    );
  if (!Number.isFinite(donor) || donor <= 0)
    simpleError(
      "donorConcentrationPerCm3",
      "Donor concentration must be a finite positive number.",
      "invalid_donor",
    );
  if (!Number.isFinite(builtIn) || builtIn < 0)
    simpleError(
      "builtInVoltageV",
      "Built-in voltage must be a finite number at least 0.",
      "invalid_built_in",
    );
  if (!Number.isFinite(reverse) || reverse < 0)
    simpleError(
      "reverseBiasV",
      "Reverse bias must be a finite number at least 0.",
      "invalid_reverse_bias",
    );
  const totalVoltage = builtIn + reverse;
  if (!Number.isFinite(totalVoltage))
    simpleError(
      "reverseBiasV",
      "Total voltage overflowed.",
      "numeric_overflow",
    );
  if (totalVoltage < 0)
    simpleError(
      "reverseBiasV",
      "Total voltage cannot be negative.",
      "invalid_voltage",
    );
  const widthCm = Math.sqrt(
    ((2 * SILICON_EPSILON_F_PER_CM * totalVoltage) / ELEMENTARY_CHARGE_C) *
      (1 / acceptor + 1 / donor),
  );
  if (!Number.isFinite(widthCm) || (totalVoltage > 0 && widthCm === 0))
    simpleError(
      "reverseBiasV",
      "Depletion width overflowed.",
      "numeric_overflow",
    );
  const widthUm = widthCm * 10000;
  if (!Number.isFinite(widthUm) || (totalVoltage > 0 && widthUm === 0))
    simpleError(
      "reverseBiasV",
      "Depletion width overflowed.",
      "numeric_overflow",
    );
  return { widthUm: widthUm === 0 ? 0 : widthUm };
};

export const depletionWidthAbruptTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionWidthAbrupt({
      acceptorConcentrationPerCm3: input.acceptorConcentrationPerCm3 as number,
      builtInVoltageV: input.builtInVoltageV as number,
      donorConcentrationPerCm3: input.donorConcentrationPerCm3 as number,
      reverseBiasV: (input.reverseBiasV as number | undefined) ?? undefined,
    }),
  description:
    "Compute the total depletion width of an abrupt pn junction from built-in and applied reverse bias. Assumes silicon permittivity 11.7·ε0.",
  id: "semiconductor/depletion-width-abrupt",
  inputs: [
    {
      description:
        "Acceptor concentration on the p side. Must be greater than 0 cm^-3.",
      format: "density-per-cm3",
      id: "acceptorConcentrationPerCm3",
      kind: "number",
      label: "NA",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description:
        "Donor concentration on the n side. Must be greater than 0 cm^-3.",
      format: "density-per-cm3",
      id: "donorConcentrationPerCm3",
      kind: "number",
      label: "ND",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      default: 0.7,
      description: "Built-in potential of the junction. Must be at least 0 V.",
      id: "builtInVoltageV",
      kind: "number",
      label: "Built-in voltage",
      minimum: 0,
      unit: "V",
    },
    {
      default: 0,
      description:
        "Applied reverse bias. Must be at least 0 V; total voltage must be >=0.",
      id: "reverseBiasV",
      kind: "number",
      label: "Reverse bias",
      minimum: 0,
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Total depletion region width.",
      format: "length-um",
      id: "widthUm",
      kind: "number",
      label: "Depletion width",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "Depletion Width Abrupt Junction Calculator",
});
export const runDepletionWidthAbrupt = depletionWidthAbruptTool.execute;
export default depletionWidthAbruptTool;
