import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    measuredResistanceOhm: 10000,
    referenceResistanceOhm: 10000,
    referenceTemperatureK: 298.15,
    betaK: 3950,
  },
  output: { temperatureK: 298.15, temperatureC: 25 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/ntc-temperature-from-resistance",
  title: "NTC Temperature from Resistance",
  description:
    "Invert the NTC beta equation to estimate temperature from measured resistance and a reference point. Output is kelvin and Celsius; use a Steinhart–Hart model when greater accuracy is needed.",
  inputs: [
    {
      id: "measuredResistanceOhm",
      kind: "number",
      label: "Measured resistance (Ω)",
      minimum: Number.MIN_VALUE,
    },
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
      id: "betaK",
      kind: "number",
      label: "Beta parameter (K)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "temperatureK", kind: "number", label: "Temperature K" },
    { id: "temperatureC", kind: "number", label: "Temperature C" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (
      1 / i.referenceTemperatureK +
        Math.log(i.measuredResistanceOhm / i.referenceResistanceOhm) /
          i.betaK <=
      0
    )
      simpleError(
        "measuredResistanceOhm",
        "Beta model gives a nonpositive absolute temperature.",
      );
    const output = {
      temperatureK:
        1 /
        (1 / i.referenceTemperatureK +
          Math.log(i.measuredResistanceOhm / i.referenceResistanceOhm) /
            i.betaK),
      temperatureC:
        1 /
          (1 / i.referenceTemperatureK +
            Math.log(i.measuredResistanceOhm / i.referenceResistanceOhm) /
              i.betaK) -
        273.15,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type NtcTemperatureFromResistanceInput = Readonly<typeof example.input>;
export type NtcTemperatureFromResistanceOutput = Readonly<
  typeof example.output
>;
export const ntcTemperatureFromResistanceTool = tool;
export const runNtcTemperatureFromResistance = tool.execute;
export default tool;
