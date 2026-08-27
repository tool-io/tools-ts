import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EsrPowerLossInput = {
  readonly rippleCurrentArms: number;
  readonly esrOhms: number;
};

export type EsrPowerLossOutput = {
  readonly esrLossWatts: number;
};

export const esrPowerLossExample = {
  input: { rippleCurrentArms: 2, esrOhms: 0.05 },
  output: { esrLossWatts: 0.2 },
} satisfies ToolExample<EsrPowerLossInput, EsrPowerLossOutput>;

export const esrPowerLossTool = createSimpleTool({
  id: "electronics/esr-power-loss",
  title: "ESR Power Loss",
  description:
    "Compute capacitor ESR power dissipation as RMS ripple current squared times equivalent series resistance.",
  inputs: [
    {
      id: "rippleCurrentArms",
      label: "Ripple current (RMS)",
      kind: "number",
      unit: "A",
    },
    { id: "esrOhms", label: "ESR", kind: "number", unit: "Ω" },
  ],
  outputs: [
    { id: "esrLossWatts", label: "Power loss", kind: "number", unit: "W" },
  ],
  calculate: (input) => {
    const rippleCurrentArms = input.rippleCurrentArms as number;
    const esrOhms = input.esrOhms as number;
    if (!(rippleCurrentArms > 0))
      simpleError(
        "rippleCurrentArms",
        "Ripple current must be positive.",
        "invalid_current",
      );
    if (!(esrOhms > 0))
      simpleError("esrOhms", "ESR must be positive.", "invalid_resistance");
    return { esrLossWatts: rippleCurrentArms * rippleCurrentArms * esrOhms };
  },
});
export const runEsrPowerLoss = esrPowerLossTool.execute;
export default esrPowerLossTool;
