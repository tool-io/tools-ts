import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OutputConductanceInput = {
  readonly collectorCurrentMa: number;
  readonly earlyVoltageV: number;
};

export type OutputConductanceOutput = {
  readonly outputConductanceS: number;
};

export const outputConductanceExample = {
  input: { collectorCurrentMa: 1, earlyVoltageV: 100 },
  output: { outputConductanceS: 0.00001 },
} satisfies ToolExample<OutputConductanceInput, OutputConductanceOutput>;

export const calculateOutputConductance = (
  input: OutputConductanceInput,
): OutputConductanceOutput => {
  const icMa = input.collectorCurrentMa;
  const vaV = input.earlyVoltageV;

  if (!Number.isFinite(icMa) || icMa < 0)
    simpleError(
      "collectorCurrentMa",
      "Collector current must be a finite number at least 0 mA.",
      "invalid_collector_current",
    );
  if (!Number.isFinite(vaV) || vaV <= 0)
    simpleError(
      "earlyVoltageV",
      "Early voltage must be a finite positive number.",
      "invalid_early_voltage",
    );

  const icA = icMa * 1e-3;
  if (!Number.isFinite(icA))
    simpleError(
      "collectorCurrentMa",
      "Collector current conversion overflowed.",
      "numeric_overflow",
    );

  const outputConductanceS = icA / vaV;
  if (!Number.isFinite(outputConductanceS))
    simpleError(
      "earlyVoltageV",
      "Output conductance could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  if (icMa > 0 && outputConductanceS === 0)
    simpleError(
      "earlyVoltageV",
      "Positive output conductance is too small to represent.",
      "numeric_underflow",
    );

  return {
    outputConductanceS: outputConductanceS === 0 ? 0 : outputConductanceS,
  };
};

export const outputConductanceTool = createSimpleTool({
  calculate: (input) =>
    calculateOutputConductance({
      collectorCurrentMa: input.collectorCurrentMa as number,
      earlyVoltageV: input.earlyVoltageV as number,
    }),
  description:
    "Compute the BJT small-signal output conductance as collector current divided by Early voltage, go = IC / VA. IC is quiescent collector current in mA and VA is Early voltage in V.",
  id: "semiconductor/bjt-output-conductance",
  inputs: [
    {
      description:
        "Quiescent collector current in active mode. Must be at least 0 mA; 0 yields 0 S.",
      id: "collectorCurrentMa",
      kind: "number",
      label: "Collector current",
      minimum: 0,
      unit: "mA",
    },
    {
      description:
        "Early voltage extrapolated to zero current. Must be greater than 0 V.",
      format: "voltage-v",
      id: "earlyVoltageV",
      kind: "number",
      label: "Early voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  outputs: [
    {
      description:
        "Small-signal output conductance dIC/dVCE at the Q-point. Inverse of Early resistance.",
      format: "conductance-s",
      id: "outputConductanceS",
      kind: "number",
      label: "Output conductance",
      minimum: 0,
      unit: "S",
    },
  ],
  title: "BJT Output Conductance Calculator",
});
export const runOutputConductance = outputConductanceTool.execute;
export default outputConductanceTool;
