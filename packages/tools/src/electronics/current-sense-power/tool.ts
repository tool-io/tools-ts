import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentSensePowerInput = {
  readonly senseCurrentAmps: number;
  readonly shuntResistanceMilliohms: number;
};

export type CurrentSensePowerOutput = {
  readonly shuntPowerMw: number;
};

export const currentSensePowerExample = {
  input: { senseCurrentAmps: 0.005, shuntResistanceMilliohms: 100 },
  output: { shuntPowerMw: 0.0025 },
} satisfies ToolExample<CurrentSensePowerInput, CurrentSensePowerOutput>;

export const currentSensePowerTool = createSimpleTool({
  id: "electronics/current-sense-power",
  title: "Shunt Power",
  description:
    "Compute the power dissipated by a current-sense shunt as P(mW) = I^2(A) x Rshunt(mOhm).",
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
    { id: "shuntPowerMw", label: "Shunt power", kind: "number", unit: "mW" },
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
      shuntPowerMw: senseCurrentAmps ** 2 * shuntResistanceMilliohms,
    };
  },
});
export const runCurrentSensePower = currentSensePowerTool.execute;
export default currentSensePowerTool;
