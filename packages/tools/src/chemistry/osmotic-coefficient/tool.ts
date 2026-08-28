import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const OsmoticCoefficientTool = createSimpleTool({
  id: "chemistry/osmotic-coefficient",
  title: "Osmotic Coefficient Calculator",
  description: "Compute osmotic coefficient phi = osmolality/(i*m).",
  inputs: [
    {
      id: "osmolalityOsmKg",
      label: "Osmolality",
      kind: "number",
      minimum: 0,
      unit: "osmol/kg",
    },
    {
      id: "molalityMolKg",
      label: "Molality",
      kind: "number",
      minimum: 0,
      unit: "mol/kg",
    },
    { id: "vantHoffFactor", label: "i factor", kind: "number", minimum: 1 },
  ],
  outputs: [{ id: "phi", label: "Osmotic coefficient", kind: "number" }],
  calculate: (input) => {
    const denominator =
      (input.vantHoffFactor as number) * (input.molalityMolKg as number);
    if (denominator === 0)
      simpleError(
        "molalityMolKg",
        "Product cannot be zero.",
        "invalid_denominator",
      );
    return { phi: (input.osmolalityOsmKg as number) / denominator };
  },
});
export default OsmoticCoefficientTool;
export const runOsmoticCoefficient = OsmoticCoefficientTool.execute;

export type OsmoticCoefficientInput = {
  readonly osmolalityOsmKg: number;
  readonly molalityMolKg: number;
  readonly vantHoffFactor: number;
};

export type OsmoticCoefficientOutput = {
  readonly phi: number;
};

export const osmoticCoefficientExample = {
  input: {
    osmolalityOsmKg: 1,
    molalityMolKg: 1,
    vantHoffFactor: 1,
  },
  output: {
    phi: 1,
  },
} satisfies ToolExample<OsmoticCoefficientInput, OsmoticCoefficientOutput>;
