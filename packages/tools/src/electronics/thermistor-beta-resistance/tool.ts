import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referenceResistanceOhm: 10000,
    referenceTemperatureK: 298.15,
    targetTemperatureK: 308.15,
    betaK: 3950,
  },
  output: { resistanceOhm: 6505.531126156567 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/thermistor-beta-resistance",
  title: "Thermistor Beta Resistance",
  description:
    "Estimate NTC thermistor resistance at an absolute temperature using R=R₀ exp[B(1/T−1/T₀)]. Temperatures are kelvin; beta is an approximation over its specified range.",
  inputs: [
    {
      id: "referenceResistanceOhm",
      kind: "number",
      label: "Reference resistance (Ω)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "referenceTemperatureK",
      kind: "number",
      label: "Reference temperature (K)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "targetTemperatureK",
      kind: "number",
      label: "Target temperature (K)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "betaK",
      kind: "number",
      label: "Beta parameter (K)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "resistanceOhm", kind: "number", label: "Resistance ohm" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      resistanceOhm:
        i.referenceResistanceOhm *
        Math.exp(
          i.betaK * (1 / i.targetTemperatureK - 1 / i.referenceTemperatureK),
        ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ThermistorBetaResistanceInput = Readonly<typeof example.input>;
export type ThermistorBetaResistanceOutput = Readonly<typeof example.output>;
export const thermistorBetaResistanceTool = tool;
export const runThermistorBetaResistance = tool.execute;
export default tool;
