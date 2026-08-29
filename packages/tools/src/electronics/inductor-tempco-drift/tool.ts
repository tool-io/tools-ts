import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referenceInductanceH: 0.001,
    tempcoPpmPerC: 200,
    temperatureChangeC: 50,
  },
  output: { changeH: 0.00001, newInductanceH: 0.00101 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/inductor-tempco-drift",
  title: "Inductor Temperature-Coefficient Drift",
  description:
    "Estimate inductance drift with a linear ppm/°C coefficient. Core permeability and DC-bias effects can be nonlinear; use a datasheet coefficient applicable to the temperature range.",
  inputs: [
    {
      id: "referenceInductanceH",
      kind: "number",
      label: "Reference inductance (H)",
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
    { id: "changeH", kind: "number", label: "Change (H)" },
    { id: "newInductanceH", kind: "number", label: "New inductance (H)" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const changeH =
      (i.referenceInductanceH * i.tempcoPpmPerC * i.temperatureChangeC) / 1e6;
    const output = {
      changeH,
      newInductanceH: i.referenceInductanceH + changeH,
    };
    if (output.newInductanceH < 0)
      simpleError(
        "temperatureChangeC",
        "Linear model gives negative inductance.",
      );
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type InductorTempcoDriftInput = Readonly<typeof example.input>;
export type InductorTempcoDriftOutput = Readonly<typeof example.output>;
export const inductorTempcoDriftTool = tool;
export const runInductorTempcoDrift = tool.execute;
export default tool;
