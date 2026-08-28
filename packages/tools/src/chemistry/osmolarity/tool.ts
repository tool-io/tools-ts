import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const osmolarityTool = createSimpleTool({
  id: "chemistry/osmolarity",
  title: "Osmolarity Calculator",
  description:
    "Compute solution osmolarity as the van't Hoff factor times molarity.",
  inputs: [
    {
      description: "van't Hoff factor: particles produced per dissolved unit.",
      id: "vantHoffFactor",
      label: "i factor",
      kind: "number",
      minimum: 1,
    },
    {
      description: "Molarity of the solution.",
      id: "molarityMolL",
      label: "Molarity",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description: "Osmolarity in osmoles per liter.",
      id: "osmolarityOsmL",
      label: "Osmolarity",
      kind: "number",
      unit: "osmol/L",
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
    return { osmolarityOsmL: factor * (input.molarityMolL as number) };
  },
});
export const runOsmolarity = osmolarityTool.execute;
export default osmolarityTool;

export type OsmolarityInput = {
  readonly vantHoffFactor: number;
  readonly molarityMolL: number;
};

export type OsmolarityOutput = {
  readonly osmolarityOsmL: number;
};

export const osmolarityExample = {
  input: {
    vantHoffFactor: 1,
    molarityMolL: 1,
  },
  output: {
    osmolarityOsmL: 1,
  },
} satisfies ToolExample<OsmolarityInput, OsmolarityOutput>;
