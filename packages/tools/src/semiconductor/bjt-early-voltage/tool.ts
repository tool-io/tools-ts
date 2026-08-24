import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EarlyVoltageInput = {
  readonly collectorCurrentMa: number;
  readonly outputConductanceS: number;
};

export type EarlyVoltageOutput = {
  readonly earlyVoltageV: number;
};

export const earlyVoltageExample = {
  input: { collectorCurrentMa: 1, outputConductanceS: 1e-5 },
  output: { earlyVoltageV: 100 },
} satisfies ToolExample<EarlyVoltageInput, EarlyVoltageOutput>;

export const calculateEarlyVoltage = (
  input: EarlyVoltageInput,
): EarlyVoltageOutput => {
  const icMa = input.collectorCurrentMa;
  const goS = input.outputConductanceS;

  if (!Number.isFinite(icMa) || icMa <= 0)
    simpleError(
      "collectorCurrentMa",
      "Collector current must be a finite positive number greater than 0 mA.",
      "invalid_collector_current",
    );
  if (!Number.isFinite(goS) || goS <= 0)
    simpleError(
      "outputConductanceS",
      "Output conductance must be a finite positive number.",
      "invalid_conductance",
    );

  const icA = icMa * 1e-3;
  if (!Number.isFinite(icA) || icA === 0)
    simpleError(
      "collectorCurrentMa",
      "Collector current is outside the representable positive ampere range.",
      icA === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  const earlyVoltageV = icA / goS;
  if (!Number.isFinite(earlyVoltageV))
    simpleError(
      "outputConductanceS",
      "Early voltage could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return { earlyVoltageV: earlyVoltageV === 0 ? 0 : earlyVoltageV };
};

export const earlyVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateEarlyVoltage({
      collectorCurrentMa: input.collectorCurrentMa as number,
      outputConductanceS: input.outputConductanceS as number,
    }),
  description:
    "Compute the BJT Early voltage as collector current divided by small-signal output conductance, VA = IC / go. IC is quiescent collector current in mA and go is dIC/dVCE in S.",
  id: "semiconductor/bjt-early-voltage",
  inputs: [
    {
      description:
        "Quiescent collector current in active mode. Must be greater than 0 mA because Early voltage is undefined at zero current.",
      id: "collectorCurrentMa",
      kind: "number",
      label: "Collector current",
      minimum: Number.MIN_VALUE,
      unit: "mA",
    },
    {
      description:
        "Small-signal output conductance dIC/dVCE at the Q-point. Must be greater than 0 S.",
      format: "conductance-s",
      id: "outputConductanceS",
      kind: "number",
      label: "Output conductance",
      minimum: Number.MIN_VALUE,
      unit: "S",
    },
  ],
  outputs: [
    {
      description:
        "Early voltage extrapolated to zero collector current. Positive magnitude; larger VA means higher output resistance.",
      format: "voltage-v",
      id: "earlyVoltageV",
      kind: "number",
      label: "Early voltage",
      minimum: 0,
      unit: "V",
    },
  ],
  title: "BJT Early Voltage Calculator",
});
export const runEarlyVoltage = earlyVoltageTool.execute;
export default earlyVoltageTool;
