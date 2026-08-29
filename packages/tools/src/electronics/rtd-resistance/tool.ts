import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referenceResistanceOhm: 100,
    temperatureC: 100,
    referenceTemperatureC: 0,
    alphaPerC: 0.00385,
  },
  output: { resistanceOhm: 138.5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/rtd-resistance",
  title: "RTD Linear Resistance",
  description:
    "Estimate RTD resistance with R=R₀[1+α(T−T₀)] over a limited temperature range. For precision platinum RTDs over wider ranges, use Callendar–Van Dusen coefficients instead.",
  inputs: [
    {
      id: "referenceResistanceOhm",
      kind: "number",
      label: "Resistance at reference (Ω)",
      minimum: 0,
    },
    { id: "temperatureC", kind: "number", label: "Target temperature (°C)" },
    {
      id: "referenceTemperatureC",
      kind: "number",
      label: "Reference temperature (°C)",
    },
    { id: "alphaPerC", kind: "number", label: "Linear coefficient (1/°C)" },
  ],
  outputs: [{ id: "resistanceOhm", kind: "number", label: "Resistance ohm" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (
      i.referenceResistanceOhm *
        (1 + i.alphaPerC * (i.temperatureC - i.referenceTemperatureC)) <
      0
    )
      simpleError("temperatureC", "Linear model gives negative resistance.");
    const output = {
      resistanceOhm:
        i.referenceResistanceOhm *
        (1 + i.alphaPerC * (i.temperatureC - i.referenceTemperatureC)),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type RtdResistanceInput = Readonly<typeof example.input>;
export type RtdResistanceOutput = Readonly<typeof example.output>;
export const rtdResistanceTool = tool;
export const runRtdResistance = tool.execute;
export default tool;
