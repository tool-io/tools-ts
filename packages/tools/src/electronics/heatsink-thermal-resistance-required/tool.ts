import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    junctionLimitC: 125,
    ambientTemperatureC: 35,
    powerW: 10,
    junctionToCaseCPerW: 2,
    caseToSinkCPerW: 0.5,
  },
  output: { maximumSinkToAmbientCPerW: 6.5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/heatsink-thermal-resistance-required",
  title: "Required Heatsink Thermal Resistance",
  description:
    "Calculate maximum allowable heatsink-to-ambient thermal resistance from junction-temperature limit, ambient temperature, dissipation, junction-to-case, and case-to-sink resistances. A negative result means the assumed stack cannot meet the limit.",
  inputs: [
    { id: "junctionLimitC", kind: "number", label: "Junction limit (°C)" },
    {
      id: "ambientTemperatureC",
      kind: "number",
      label: "Ambient temperature (°C)",
    },
    {
      id: "powerW",
      kind: "number",
      label: "Dissipation (W)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "junctionToCaseCPerW",
      kind: "number",
      label: "Junction-to-case (°C/W)",
      minimum: 0,
    },
    {
      id: "caseToSinkCPerW",
      kind: "number",
      label: "Case-to-sink (°C/W)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maximumSinkToAmbientCPerW",
      kind: "number",
      label: "Maximum Sink To Ambient CPer W",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      maximumSinkToAmbientCPerW:
        (i.junctionLimitC - i.ambientTemperatureC) / i.powerW -
        i.junctionToCaseCPerW -
        i.caseToSinkCPerW,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type HeatsinkThermalResistanceRequiredInput = Readonly<
  typeof example.input
>;
export type HeatsinkThermalResistanceRequiredOutput = Readonly<
  typeof example.output
>;
export const heatsinkThermalResistanceRequiredTool = tool;
export const runHeatsinkThermalResistanceRequired = tool.execute;
export default tool;
