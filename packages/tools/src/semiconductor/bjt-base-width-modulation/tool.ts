import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BaseWidthModulationInput = {
  readonly acceptorDopingPerCm3: number;
  readonly baseWidthUm: number;
  readonly builtInVoltageV: number;
  readonly collectorBaseVoltageV: number;
};

export type BaseWidthModulationOutput = {
  readonly fractionalChange: number;
};

const EPSILON_SI_F_PER_CM = 11.7 * 8.854187817e-14;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const baseWidthModulationExample = {
  input: {
    acceptorDopingPerCm3: 1e17,
    baseWidthUm: 5,
    builtInVoltageV: 0.7,
    collectorBaseVoltageV: 5,
  },
  output: { fractionalChange: 0.035270767929895544 },
} satisfies ToolExample<BaseWidthModulationInput, BaseWidthModulationOutput>;

export const calculateBaseWidthModulation = (
  input: BaseWidthModulationInput,
): BaseWidthModulationOutput => {
  const acceptorDopingPerCm3 = input.acceptorDopingPerCm3;
  const baseWidthUm = input.baseWidthUm;
  const builtInVoltageV = input.builtInVoltageV;
  const collectorBaseVoltageV = input.collectorBaseVoltageV;

  if (!Number.isFinite(acceptorDopingPerCm3) || acceptorDopingPerCm3 <= 0)
    simpleError(
      "acceptorDopingPerCm3",
      "Acceptor doping must be a finite positive number.",
      "invalid_acceptor_doping",
    );

  if (!Number.isFinite(baseWidthUm) || baseWidthUm <= 0)
    simpleError(
      "baseWidthUm",
      "Base width must be a finite positive number.",
      "invalid_base_width",
    );

  if (!Number.isFinite(builtInVoltageV) || builtInVoltageV <= 0)
    simpleError(
      "builtInVoltageV",
      "Built-in voltage must be a finite positive number.",
      "invalid_built_in",
    );

  if (!Number.isFinite(collectorBaseVoltageV) || collectorBaseVoltageV < 0)
    simpleError(
      "collectorBaseVoltageV",
      "Collector-base voltage must be a finite number at least 0.",
      "invalid_collector_base_voltage",
    );

  const totalVoltage = builtInVoltageV + collectorBaseVoltageV;
  if (!Number.isFinite(totalVoltage))
    simpleError(
      "collectorBaseVoltageV",
      "Total voltage overflowed.",
      "numeric_overflow",
    );

  const sqrtTotal = Math.sqrt(totalVoltage);
  const sqrtBuiltIn = Math.sqrt(builtInVoltageV);
  if (!Number.isFinite(sqrtTotal) || !Number.isFinite(sqrtBuiltIn))
    simpleError(
      "collectorBaseVoltageV",
      "Square root overflowed.",
      "numeric_overflow",
    );

  // Rationalize the root difference to retain small changes at low VCB.
  const sqrtDiff =
    collectorBaseVoltageV === 0
      ? 0
      : collectorBaseVoltageV / (sqrtTotal + sqrtBuiltIn);
  if (!Number.isFinite(sqrtDiff))
    simpleError(
      "collectorBaseVoltageV",
      "Depletion widening intermediate overflowed.",
      "numeric_overflow",
    );

  const chargeTimesDoping = ELEMENTARY_CHARGE_C * acceptorDopingPerCm3;
  if (!Number.isFinite(chargeTimesDoping))
    simpleError(
      "acceptorDopingPerCm3",
      "Charge times doping overflowed.",
      "numeric_overflow",
    );

  if (chargeTimesDoping === 0)
    simpleError(
      "acceptorDopingPerCm3",
      "Charge times doping underflowed.",
      "numeric_overflow",
    );

  const ratio = (2 * EPSILON_SI_F_PER_CM) / chargeTimesDoping;
  if (!Number.isFinite(ratio))
    simpleError(
      "acceptorDopingPerCm3",
      "Depletion factor overflowed.",
      "numeric_overflow",
    );

  const sqrtFactor = Math.sqrt(ratio);
  if (!Number.isFinite(sqrtFactor))
    simpleError(
      "acceptorDopingPerCm3",
      "Depletion factor overflowed.",
      "numeric_overflow",
    );

  const depletionWideningCm = sqrtDiff * sqrtFactor;
  if (!Number.isFinite(depletionWideningCm))
    simpleError(
      "acceptorDopingPerCm3",
      "Depletion widening overflowed.",
      "numeric_overflow",
    );

  const baseWidthCm = baseWidthUm * 1e-4;
  if (!Number.isFinite(baseWidthCm))
    simpleError(
      "baseWidthUm",
      "Base width conversion overflowed.",
      "numeric_overflow",
    );

  if (baseWidthCm === 0)
    simpleError(
      "baseWidthUm",
      "Base width conversion underflowed.",
      "numeric_overflow",
    );

  const fractionalChange = depletionWideningCm / baseWidthCm;
  if (!Number.isFinite(fractionalChange))
    simpleError(
      "baseWidthUm",
      "Fractional change overflowed.",
      "numeric_overflow",
    );
  if (collectorBaseVoltageV > 0 && fractionalChange === 0)
    simpleError(
      "collectorBaseVoltageV",
      "Positive base-width change is too small to represent.",
      "numeric_underflow",
    );

  return { fractionalChange: fractionalChange === 0 ? 0 : fractionalChange };
};

export const baseWidthModulationTool = createSimpleTool({
  calculate: (input) =>
    calculateBaseWidthModulation({
      acceptorDopingPerCm3: input.acceptorDopingPerCm3 as number,
      baseWidthUm: input.baseWidthUm as number,
      builtInVoltageV: input.builtInVoltageV as number,
      collectorBaseVoltageV: input.collectorBaseVoltageV as number,
    }),
  description:
    "Quantify BJT base-width modulation (Early effect) from the reverse-biased collector-base junction: fractionalChange = (sqrt(Vbi+VCB)-sqrt(Vbi))·sqrt(2·εSi/(q·NA)) / Wb, with Vbi=builtInVoltageV>0 V, VCB=collectorBaseVoltageV>=0 V, NA=acceptorDopingPerCm3>0 cm^-3, Wb=baseWidthUm>0 um, εSi=11.7·ε0 F/cm, q=1.602e-19 C. Uses stable sqrt difference; checks total voltage finiteness and depletion-factor overflow. One-sided abrupt-junction approximation neglecting emitter side and non-uniform doping; valid for NA not too low and moderate VCB; result >=0, zero when VCB=0.",
  id: "semiconductor/bjt-base-width-modulation",
  inputs: [
    {
      description:
        "Acceptor doping concentration of the base. Must be a finite number greater than 0 cm^-3.",
      format: "density-per-cm3",
      id: "acceptorDopingPerCm3",
      kind: "number",
      label: "Base acceptor doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description:
        "Neutral base width at equilibrium. Must be a finite number greater than 0 um.",
      id: "baseWidthUm",
      kind: "number",
      label: "Base width",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description:
        "Built-in potential of the collector-base junction. Must be a finite number greater than 0 V.",
      id: "builtInVoltageV",
      kind: "number",
      label: "Built-in voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      description:
        "Applied reverse bias on the collector-base junction. Must be a finite number at least 0 V.",
      id: "collectorBaseVoltageV",
      kind: "number",
      label: "CB voltage",
      minimum: 0,
      unit: "V",
    },
  ],
  outputs: [
    {
      description:
        "Depletion widening into the base divided by the equilibrium base width (fractional change). At least 0; 0 when VCB=0.",
      format: "ratio",
      id: "fractionalChange",
      kind: "number",
      label: "Fractional change",
      minimum: 0,
    },
  ],
  title: "BJT Base Width Modulation Calculator",
});
export const runBaseWidthModulation = baseWidthModulationTool.execute;
export default baseWidthModulationTool;
