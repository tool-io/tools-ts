import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentSenseResistorVoltageInput = {
  readonly senseCurrentAmps: number;
  readonly shuntResistanceMilliohms: number;
};

export type CurrentSenseResistorVoltageOutput = {
  readonly senseVoltageMv: number;
};

export const currentSenseResistorVoltageExample = {
  input: { senseCurrentAmps: 0.005, shuntResistanceMilliohms: 100 },
  output: { senseVoltageMv: 0.5 },
} satisfies ToolExample<
  CurrentSenseResistorVoltageInput,
  CurrentSenseResistorVoltageOutput
>;

export const currentSenseResistorVoltageTool = createSimpleTool({
  id: "electronics/current-sense-resistor-voltage",
  title: "Sense Voltage",
  description:
    "Compute the differential voltage developed across a current-sense shunt as Vsense(mV) = I(A) x Rshunt(mOhm).",
  inputs: [
    {
      id: "senseCurrentAmps",
      label: "Sense current",
      kind: "number",
      unit: "A",
    },
    {
      id: "shuntResistanceMilliohms",
      label: "Shunt resistance",
      kind: "number",
      unit: "mΩ",
    },
  ],
  outputs: [
    {
      id: "senseVoltageMv",
      label: "Sense voltage",
      kind: "number",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const senseCurrentAmps = input.senseCurrentAmps as number;
    const shuntResistanceMilliohms = input.shuntResistanceMilliohms as number;
    if (!(senseCurrentAmps > 0))
      simpleError(
        "senseCurrentAmps",
        "Sense current must be positive.",
        "invalid_current",
      );
    if (!(shuntResistanceMilliohms > 0))
      simpleError(
        "shuntResistanceMilliohms",
        "Shunt resistance must be positive.",
        "invalid_resistance",
      );
    return {
      senseVoltageMv: senseCurrentAmps * shuntResistanceMilliohms,
    };
  },
});
export const runCurrentSenseResistorVoltage =
  currentSenseResistorVoltageTool.execute;
export default currentSenseResistorVoltageTool;
