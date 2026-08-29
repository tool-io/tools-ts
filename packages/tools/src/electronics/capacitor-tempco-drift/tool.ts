import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referenceCapacitanceF: 0.000001,
    tempcoPpmPerC: -100,
    temperatureChangeC: 50,
  },
  output: { changeF: -4.999999999999999e-9, newCapacitanceF: 9.95e-7 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/capacitor-tempco-drift",
  title: "Capacitor Temperature-Coefficient Drift",
  description:
    "Estimate capacitance change from a linear ppm/°C coefficient and temperature difference. Many ceramic dielectric classes are nonlinear, so this model should only be used where a linear tempco is specified.",
  inputs: [
    {
      id: "referenceCapacitanceF",
      kind: "number",
      label: "Reference capacitance (F)",
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
    { id: "changeF", kind: "number", label: "Change (F)" },
    { id: "newCapacitanceF", kind: "number", label: "New capacitance (F)" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const changeF =
      (i.referenceCapacitanceF * i.tempcoPpmPerC * i.temperatureChangeC) / 1e6;
    const output = {
      changeF,
      newCapacitanceF: i.referenceCapacitanceF + changeF,
    };
    if (output.newCapacitanceF < 0)
      simpleError(
        "temperatureChangeC",
        "Linear model gives negative capacitance.",
      );
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CapacitorTempcoDriftInput = Readonly<typeof example.input>;
export type CapacitorTempcoDriftOutput = Readonly<typeof example.output>;
export const capacitorTempcoDriftTool = tool;
export const runCapacitorTempcoDrift = tool.execute;
export default tool;
