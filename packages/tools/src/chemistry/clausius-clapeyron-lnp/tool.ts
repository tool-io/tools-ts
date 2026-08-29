import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referencePressurePa: 101325,
    referenceTemperatureK: 373.15,
    targetTemperatureK: 363.15,
    enthalpyJPerMol: 40650,
  },
  output: {
    lnPressureRatio: -0.3607919761134641,
    targetPressurePa: 70636.08948527543,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/clausius-clapeyron-lnp",
  title: "Clausius–Clapeyron Vapor Pressure",
  description:
    "Estimate vapor pressure at a second absolute temperature from a reference pressure and molar enthalpy of vaporization using the integrated Clausius–Clapeyron equation. Assumes vapor behaves ideally and enthalpy stays constant over the temperature interval.",
  inputs: [
    {
      id: "referencePressurePa",
      kind: "number",
      label: "Reference pressure (Pa)",
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
      id: "enthalpyJPerMol",
      kind: "number",
      label: "Vaporization enthalpy (J/mol)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lnPressureRatio", kind: "number", label: "Ln Pressure Ratio" },
    { id: "targetPressurePa", kind: "number", label: "Target Pressure Pa" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      lnPressureRatio:
        (-i.enthalpyJPerMol / 8.314462618) *
        (1 / i.targetTemperatureK - 1 / i.referenceTemperatureK),
      targetPressurePa:
        i.referencePressurePa *
        Math.exp(
          (-i.enthalpyJPerMol / 8.314462618) *
            (1 / i.targetTemperatureK - 1 / i.referenceTemperatureK),
        ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ClausiusClapeyronLnpInput = Readonly<typeof example.input>;
export type ClausiusClapeyronLnpOutput = Readonly<typeof example.output>;
export const clausiusClapeyronLnpTool = tool;
export const runClausiusClapeyronLnp = tool.execute;
export default tool;
