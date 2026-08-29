import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { freundlichK: 2, concentration: 9, exponentN: 2 },
  output: { capacity: 6 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/freundlich-isotherm-q",
  title: "Freundlich Adsorption Capacity",
  description:
    "Calculate equilibrium adsorption capacity q=K C^(1/n) using the empirical Freundlich isotherm. The coefficient K carries units determined by the concentration and capacity units; this model has no saturation limit.",
  inputs: [
    {
      id: "freundlichK",
      kind: "number",
      label: "Freundlich coefficient K",
      minimum: 0,
    },
    {
      id: "concentration",
      kind: "number",
      label: "Equilibrium concentration",
      minimum: 0,
    },
    {
      id: "exponentN",
      kind: "number",
      label: "Freundlich exponent n",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "capacity", kind: "number", label: "capacity" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      capacity: i.freundlichK * Math.pow(i.concentration, 1 / i.exponentN),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FreundlichIsothermQInput = Readonly<typeof example.input>;
export type FreundlichIsothermQOutput = Readonly<typeof example.output>;
export const freundlichIsothermQTool = tool;
export const runFreundlichIsothermQ = tool.execute;
export default tool;
