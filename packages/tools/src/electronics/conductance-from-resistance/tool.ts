import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conductanceFromResistanceExample = {
  input: { resistanceOhms: 200 },
} satisfies ToolExample<{ readonly resistanceOhms: number }>;

export const conductanceFromResistanceTool = createSimpleTool({
  id: "electronics/conductance-from-resistance",
  title: "Conductance From R",
  description: "Calculate conductance as the reciprocal of resistance.",
  inputs: [
    { id: "resistanceOhms", label: "Resistance", kind: "number", unit: "ohm" },
  ],
  outputs: [
    {
      id: "conductanceSiemens",
      label: "Conductance",
      kind: "number",
      unit: "S",
    },
  ],
  calculate: (input) => {
    const resistanceOhms = input.resistanceOhms as number;
    if (resistanceOhms === 0)
      simpleError(
        "resistanceOhms",
        "Resistance must not be zero.",
        "must_be_nonzero",
      );
    return { conductanceSiemens: 1 / resistanceOhms };
  },
});
export const runConductanceFromResistance =
  conductanceFromResistanceTool.execute;
export default conductanceFromResistanceTool;
