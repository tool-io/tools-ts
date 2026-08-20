import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandgapMaterial =
  | "si"
  | "ge"
  | "gaas"
  | "inp"
  | "alas"
  | "gasb"
  | "gan"
  | "sic4h"
  | "aln"
  | "diamond";

export type BandgapLookupInput = {
  readonly material: BandgapMaterial;
};

export type BandgapLookupOutput = {
  readonly bandgapEv: number;
};

/** Room-temperature (300 K) band gaps in electronvolts. */
const BANDGAPS_EV: Readonly<Record<BandgapMaterial, number>> = {
  si: 1.12,
  ge: 0.66,
  gaas: 1.42,
  inp: 1.34,
  alas: 2.16,
  gasb: 0.726,
  gan: 3.44,
  sic4h: 3.26,
  aln: 6.2,
  diamond: 5.47,
};

export const bandgapLookupExample = {
  input: { material: "si" },
  output: { bandgapEv: 1.12 },
} satisfies ToolExample<BandgapLookupInput, BandgapLookupOutput>;

export const lookupBandgap = (material: BandgapMaterial): number => {
  const bandgap = BANDGAPS_EV[material];
  if (bandgap === undefined)
    simpleError(
      "material",
      "Choose one of the supported materials.",
      "unknown_material",
    );
  return bandgap;
};

export const calculateBandgapLookup = (
  input: BandgapLookupInput,
): BandgapLookupOutput => ({ bandgapEv: lookupBandgap(input.material) });

export const bandgapLookupTool = createSimpleTool({
  calculate: (input) =>
    calculateBandgapLookup(input as unknown as BandgapLookupInput),
  description:
    "Look up the room-temperature band gap of a common semiconductor.",
  id: "semiconductor/bandgap-lookup",
  inputs: [
    {
      description: "Semiconductor material.",
      enum: [
        "si",
        "ge",
        "gaas",
        "inp",
        "alas",
        "gasb",
        "gan",
        "sic4h",
        "aln",
        "diamond",
      ],
      id: "material",
      kind: "string",
      label: "Material",
    },
  ],
  outputs: [
    {
      description: "Band gap energy at 300 K.",
      format: "energy-ev",
      id: "bandgapEv",
      kind: "number",
      label: "Band gap",
      unit: "eV",
    },
  ],
  title: "Semiconductor Bandgap Lookup",
});
export const runBandgapLookup = bandgapLookupTool.execute;
export default bandgapLookupTool;
