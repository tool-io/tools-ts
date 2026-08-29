import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const GEOMETRY_TABLE: Record<string, string> = {
  "2-0": "linear",
  "3-0": "trigonal planar",
  "2-1": "bent",
  "4-0": "tetrahedral",
  "3-1": "trigonal pyramidal",
  "2-2": "bent",
  "5-0": "trigonal bipyramidal",
  "4-1": "seesaw",
  "3-2": "T-shaped",
  "2-3": "linear",
  "6-0": "octahedral",
  "5-1": "square pyramidal",
  "4-2": "square planar",
};

export const vseprGeometryTool = createSimpleTool({
  id: "chemistry/vsepr-geometry",
  title: "VSEPR Geometry Lookup",
  description:
    "Look up the VSEPR molecular geometry from the number of bonded atoms and lone pairs on a central atom.",
  inputs: [
    {
      description: "Atoms bonded to the central atom.",
      id: "bondedAtoms",
      label: "Bonded atoms",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Lone pairs on the central atom.",
      id: "lonePairs",
      label: "Lone pairs",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [{ id: "geometry", label: "Geometry", kind: "string" }],
  calculate: (input) => {
    const bonded = input.bondedAtoms as number;
    const lonePairs = input.lonePairs as number;
    const geometry = GEOMETRY_TABLE[`${bonded}-${lonePairs}`];
    if (!geometry)
      simpleError(
        "bondedAtoms",
        "This bonded-atom and lone-pair combination has no standard VSEPR name.",
        "unsupported_geometry",
      );
    return { geometry };
  },
});
export const runVseprGeometry = vseprGeometryTool.execute;
export default vseprGeometryTool;

export type VseprGeometryInput = {
  readonly bondedAtoms: number;
  readonly lonePairs: number;
};

export type VseprGeometryOutput = {
  readonly geometry: string;
};

export const vseprGeometryExample = {
  input: {
    bondedAtoms: 2,
    lonePairs: 1,
  },
  output: {
    geometry: "bent",
  },
} satisfies ToolExample<VseprGeometryInput, VseprGeometryOutput>;
