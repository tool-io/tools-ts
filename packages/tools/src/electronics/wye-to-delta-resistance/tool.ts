import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wyeToDeltaResistanceExample = {
  input: { r1Ohms: 10, r2Ohms: 20, r3Ohms: 30 },
  output: { deltaRaOhms: 110 },
} satisfies ToolExample<
  {
    readonly r1Ohms: number;
    readonly r2Ohms: number;
    readonly r3Ohms: number;
  },
  { readonly deltaRaOhms: number }
>;

export const wyeToDeltaResistanceTool = createSimpleTool({
  id: "electronics/wye-to-delta-resistance",
  title: "Wye To Delta RA",
  description:
    "Convert a wye network to its equivalent delta network and return the RA arm.",
  inputs: [
    { id: "r1Ohms", kind: "number", label: "Wye R1", unit: "Ω" },
    { id: "r2Ohms", kind: "number", label: "Wye R2", unit: "Ω" },
    { id: "r3Ohms", kind: "number", label: "Wye R3", unit: "Ω" },
  ],
  outputs: [
    { id: "deltaRaOhms", kind: "number", label: "Delta RA", unit: "Ω" },
  ],
  calculate: (input) => {
    const r1 = input.r1Ohms as number;
    const r2 = input.r2Ohms as number;
    const r3 = input.r3Ohms as number;
    if (r1 <= 0 || r2 <= 0 || r3 <= 0)
      simpleError(
        "r1Ohms",
        "All wye resistances must be greater than zero.",
        "invalid_resistance",
      );
    return { deltaRaOhms: (r1 * r2 + r2 * r3 + r3 * r1) / r1 };
  },
});
export const runWyeToDeltaResistance = wyeToDeltaResistanceTool.execute;
export default wyeToDeltaResistanceTool;
