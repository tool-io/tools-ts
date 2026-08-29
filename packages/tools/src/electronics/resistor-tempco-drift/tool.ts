import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referenceResistanceOhm: 1000,
    tempcoPpmPerC: 100,
    temperatureChangeC: 50,
  },
  output: { changeOhm: 5, newResistanceOhm: 1005 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/resistor-tempco-drift",
  title: "Resistor Temperature-Coefficient Drift",
  description:
    "Estimate resistor value change from a specified linear ppm/°C temperature coefficient and temperature difference. This is a first-order drift estimate; self-heating and nonlinearity are not included.",
  inputs: [
    {
      id: "referenceResistanceOhm",
      kind: "number",
      label: "Reference resistance (Ω)",
      minimum: 0,
    },
    {
      id: "tempcoPpmPerC",
      kind: "number",
      label: "Temperature coefficient (ppm/°C)",
    },
    {
      id: "temperatureChangeC",
      kind: "number",
      label: "Temperature change (°C)",
    },
  ],
  outputs: [
    { id: "changeOhm", kind: "number", label: "Change (Ω)" },
    { id: "newResistanceOhm", kind: "number", label: "New resistance (Ω)" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const changeOhm =
      (i.referenceResistanceOhm * i.tempcoPpmPerC * i.temperatureChangeC) / 1e6;
    const output = {
      changeOhm,
      newResistanceOhm: i.referenceResistanceOhm + changeOhm,
    };
    if (output.newResistanceOhm < 0)
      simpleError(
        "temperatureChangeC",
        "Linear model gives negative resistance.",
      );
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ResistorTempcoDriftInput = Readonly<typeof example.input>;
export type ResistorTempcoDriftOutput = Readonly<typeof example.output>;
export const resistorTempcoDriftTool = tool;
export const runResistorTempcoDrift = tool.execute;
export default tool;
