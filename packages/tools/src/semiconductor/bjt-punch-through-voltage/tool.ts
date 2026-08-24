import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PunchThroughVoltageInput = {
  readonly baseDopingPerCm3: number;
  readonly baseWidthUm: number;
};

export type PunchThroughVoltageOutput = {
  readonly punchThroughVoltageV: number;
};

const SILICON_EPSILON_F_PER_CM = 11.7 * 8.854187817e-14;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const punchThroughVoltageExample = {
  input: { baseDopingPerCm3: 1e17, baseWidthUm: 0.5 },
  output: { punchThroughVoltageV: 19.332401892248264 },
} satisfies ToolExample<PunchThroughVoltageInput, PunchThroughVoltageOutput>;

export const calculatePunchThroughVoltage = (
  input: PunchThroughVoltageInput,
): PunchThroughVoltageOutput => {
  const nB = input.baseDopingPerCm3;
  const wUm = input.baseWidthUm;

  if (!Number.isFinite(nB) || nB <= 0)
    simpleError(
      "baseDopingPerCm3",
      "Base doping must be a finite positive number.",
      "invalid_base_doping",
    );
  if (!Number.isFinite(wUm) || wUm <= 0)
    simpleError(
      "baseWidthUm",
      "Base width must be a finite positive number.",
      "invalid_base_width",
    );

  const wCm = wUm * 1e-4;
  if (!Number.isFinite(wCm) || wCm === 0)
    simpleError(
      "baseWidthUm",
      "Base width is outside the representable range after conversion to centimeters.",
      wCm === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  const denominator = 2 * SILICON_EPSILON_F_PER_CM;
  const logVoltage =
    Math.log(ELEMENTARY_CHARGE_C) +
    Math.log(nB) +
    2 * Math.log(wCm) -
    Math.log(denominator);
  const directVoltage = (ELEMENTARY_CHARGE_C * nB * wCm * wCm) / denominator;
  const punchThroughVoltageV =
    Number.isFinite(directVoltage) && directVoltage > 0
      ? directVoltage
      : Math.exp(logVoltage);
  if (!Number.isFinite(punchThroughVoltageV) || punchThroughVoltageV === 0)
    simpleError(
      "baseWidthUm",
      "Punch-through potential is outside the representable positive range.",
      punchThroughVoltageV === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return {
    punchThroughVoltageV: punchThroughVoltageV === 0 ? 0 : punchThroughVoltageV,
  };
};

export const punchThroughVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculatePunchThroughVoltage({
      baseDopingPerCm3: input.baseDopingPerCm3 as number,
      baseWidthUm: input.baseWidthUm as number,
    }),
  description:
    "Compute the total collector-base junction potential required for the depletion region to span a uniformly doped neutral base: Vtotal=q·NB·WB²/(2·εSi). This is not the externally applied reverse bias; subtract the junction built-in potential to estimate that bias.",
  id: "semiconductor/bjt-punch-through-voltage",
  inputs: [
    {
      description:
        "Uniform base doping concentration. Must be greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "baseDopingPerCm3",
      kind: "number",
      label: "Base doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description:
        "Neutral base width between emitter and collector junctions. Must be greater than 0 µm.",
      format: "length-um",
      id: "baseWidthUm",
      kind: "number",
      label: "Base width",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description:
        "Total depletion-supporting junction potential at punch-through. Subtract built-in potential to estimate external reverse bias.",
      format: "voltage-v",
      id: "punchThroughVoltageV",
      kind: "number",
      label: "Punch-through voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  title: "BJT Punch-Through Voltage Calculator",
});
export const runPunchThroughVoltage = punchThroughVoltageTool.execute;
export default punchThroughVoltageTool;
