import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

type VeiEntry = {
  readonly classification: string;
  readonly minimumBulkVolumeCubicMeters: number;
};

const VEI_TABLE: readonly VeiEntry[] = [
  { classification: "non-explosive", minimumBulkVolumeCubicMeters: 0 },
  { classification: "gentle", minimumBulkVolumeCubicMeters: 1e4 },
  { classification: "explosive", minimumBulkVolumeCubicMeters: 1e6 },
  { classification: "severe", minimumBulkVolumeCubicMeters: 1e7 },
  { classification: "cataclysmic", minimumBulkVolumeCubicMeters: 1e8 },
  { classification: "paroxysmal", minimumBulkVolumeCubicMeters: 1e9 },
  { classification: "colossal", minimumBulkVolumeCubicMeters: 1e10 },
  { classification: "super-colossal", minimumBulkVolumeCubicMeters: 1e11 },
  { classification: "mega-colossal", minimumBulkVolumeCubicMeters: 1e12 },
];

export type VeiLookupInput = {
  readonly vei: number;
};

export type VeiLookupOutput = {
  readonly classification: string;
  readonly minimumBulkVolumeCubicMeters: number;
};

export const calculateVeiLookup = (input: VeiLookupInput): VeiLookupOutput => {
  if (!(Number.isInteger(input.vei) && input.vei >= 0 && input.vei <= 8))
    simpleError(
      "vei",
      "Volcanic Explosivity Index must be an integer from 0 to 8.",
      "invalid_vei",
    );
  const entry = VEI_TABLE[input.vei];
  return {
    classification: entry.classification,
    minimumBulkVolumeCubicMeters: entry.minimumBulkVolumeCubicMeters,
  };
};

export const veiLookupExample = {
  input: { vei: 5 },
  output: { classification: "paroxysmal", minimumBulkVolumeCubicMeters: 1e9 },
} satisfies ToolExample<VeiLookupInput, VeiLookupOutput>;

export const veiLookupTool = createSimpleTool({
  id: "geology/vei-lookup",
  title: "VEI Lookup",
  description:
    "Newhall-Self (1982) Volcanic Explosivity Index lookup: classification name and lower-bound bulk ejecta volume for each VEI from 0 to 8; VEI 0 is below 10^4 cubic meters.",
  inputs: [
    {
      description: "Volcanic Explosivity Index, integer 0 to 8.",
      id: "vei",
      kind: "integer",
      label: "VEI",
      maximum: 8,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Newhall-Self classification name.",
      id: "classification",
      kind: "string",
      label: "Classification",
    },
    {
      description:
        "Lower-bound bulk ejecta volume in cubic meters (0 for VEI 0, which is under 10^4).",
      id: "minimumBulkVolumeCubicMeters",
      kind: "number",
      label: "Min volume",
    },
  ],
  calculate: (input) => calculateVeiLookup(input as unknown as VeiLookupInput),
});

export const runVeiLookup = veiLookupTool.execute;
export default veiLookupTool;
