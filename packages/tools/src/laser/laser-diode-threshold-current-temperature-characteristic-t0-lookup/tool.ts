import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThresholdTemperatureInput = {
  readonly iRefMa: number;
  readonly tRefC: number;
  readonly tOpC: number;
  readonly t0K: number;
};

export type ThresholdTemperatureOutput = {
  readonly iThMa: number;
};

/**
 * Characteristic temperature T0 captures how strongly the threshold current
 * drifts with junction temperature: I_th(T) = I_ref * exp((T - T_ref) / T0).
 */
export const thresholdCurrentAtTemperature = (
  input: ThresholdTemperatureInput,
): number => {
  const { iRefMa, tRefC, tOpC, t0K } = input;
  if (iRefMa <= 0)
    simpleError("iRefMa", "Reference threshold current must be positive.");
  if (t0K <= 0)
    simpleError("t0K", "Characteristic temperature T0 must be positive.");
  const result = iRefMa * Math.exp((tOpC - tRefC) / t0K);
  if (!Number.isFinite(result))
    simpleError(
      "tOpC",
      "The projected threshold current exceeds the numeric range.",
    );
  return result;
};

export const thresholdTemperatureExample = {
  input: { iRefMa: 20, tRefC: 25, tOpC: 65, t0K: 70 },
  output: {
    iThMa: 20 * Math.exp((65 - 25) / 70),
  },
} satisfies ToolExample<ThresholdTemperatureInput, ThresholdTemperatureOutput>;

export const thresholdTemperatureTool = createSimpleTool({
  calculate: (input) => ({
    iThMa: thresholdCurrentAtTemperature({
      iRefMa: input.iRefMa as number,
      t0K: input.t0K as number,
      tOpC: input.tOpC as number,
      tRefC: input.tRefC as number,
    }),
  }),
  description:
    "Scale a diode-laser threshold current to a new junction temperature using the exponential T0 characteristic.",
  id: "laser/laser-diode-threshold-current-temperature-characteristic-t0-lookup",
  inputs: [
    {
      description: "Threshold current measured at the reference temperature.",
      id: "iRefMa",
      kind: "number",
      label: "I_ref",
      minimum: 0,
      unit: "mA",
    },
    {
      description: "Reference junction temperature.",
      id: "tRefC",
      kind: "number",
      label: "T_ref",
      unit: "°C",
    },
    {
      description: "New operating junction temperature.",
      id: "tOpC",
      kind: "number",
      label: "T_op",
      unit: "°C",
    },
    {
      description:
        "Characteristic temperature of the active region (GaAs-based typically 60–120 K).",
      id: "t0K",
      kind: "number",
      label: "T₀",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Projected threshold current at the new temperature.",
      id: "iThMa",
      kind: "number",
      label: "I_th",
      unit: "mA",
    },
  ],
  title: "Diode Threshold Current T0 Characteristic",
});
export const runThresholdTemperature = thresholdTemperatureTool.execute;
export default thresholdTemperatureTool;

export { thresholdTemperatureExample as example };
