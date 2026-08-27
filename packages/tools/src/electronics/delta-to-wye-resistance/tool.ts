import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const deltaToWyeResistanceExample = {
  input: { rAOhms: 20, rBOhms: 40, rCOhms: 60 },
  output: { wyeR1Ohms: 20 },
} satisfies ToolExample<
  {
    readonly rAOhms: number;
    readonly rBOhms: number;
    readonly rCOhms: number;
  },
  { readonly wyeR1Ohms: number }
>;

export const deltaToWyeResistanceTool = createSimpleTool({
  id: "electronics/delta-to-wye-resistance",
  title: "Delta To Wye R1",
  description:
    "Convert a delta network to its equivalent wye network and return the R1 arm.",
  inputs: [
    { id: "rAOhms", kind: "number", label: "Delta RA", unit: "Ω" },
    { id: "rBOhms", kind: "number", label: "Delta RB", unit: "Ω" },
    { id: "rCOhms", kind: "number", label: "Delta RC", unit: "Ω" },
  ],
  outputs: [{ id: "wyeR1Ohms", kind: "number", label: "Wye R1", unit: "Ω" }],
  calculate: (input) => {
    const rA = input.rAOhms as number;
    const rB = input.rBOhms as number;
    const rC = input.rCOhms as number;
    if (rA <= 0 || rB <= 0 || rC <= 0)
      simpleError(
        "rAOhms",
        "All delta resistances must be greater than zero.",
        "invalid_resistance",
      );
    return { wyeR1Ohms: (rB * rC) / (rA + rB + rC) };
  },
});
export const runDeltaToWyeResistance = deltaToWyeResistanceTool.execute;
export default deltaToWyeResistanceTool;
