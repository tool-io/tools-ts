import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const osmolalityTool = createSimpleTool({
  id: "chemistry/osmolality",
  title: "Osmolality Calculator",
  description:
    "Compute solution osmolality as the van't Hoff factor times molality.",
  inputs: [
    {
      description: "van't Hoff factor: particles produced per dissolved unit.",
      id: "vantHoffFactor",
      label: "i factor",
      kind: "number",
      minimum: 1,
    },
    {
      description: "Molality of the solution.",
      id: "molalityMolKg",
      label: "Molality",
      kind: "number",
      minimum: 0,
      unit: "mol/kg",
    },
  ],
  outputs: [
    {
      description: "Osmolality in osmoles per kilogram.",
      id: "osmolalityOsmKg",
      label: "Osmolality",
      kind: "number",
      unit: "osmol/kg",
    },
  ],
  calculate: (input) => {
    const factor = input.vantHoffFactor as number;
    if (!(factor > 0))
      simpleError(
        "vantHoffFactor",
        "The van't Hoff factor must be greater than zero.",
        "invalid_vant_hoff_factor",
      );
    return { osmolalityOsmKg: factor * (input.molalityMolKg as number) };
  },
});
export const runOsmolality = osmolalityTool.execute;
export default osmolalityTool;

export type OsmolalityInput = {
  readonly vantHoffFactor: number;
  readonly molalityMolKg: number;
};

export type OsmolalityOutput = {
  readonly osmolalityOsmKg: number;
};

export const osmolalityExample = {
  input: {
    vantHoffFactor: 1,
    molalityMolKg: 1,
  },
  output: {
    osmolalityOsmKg: 1,
  },
} satisfies ToolExample<OsmolalityInput, OsmolalityOutput>;
