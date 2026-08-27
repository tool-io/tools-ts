import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const plasmidCopyNumberPerCellExample = {
  input: {
    genomeLengthBp: 4600000,
    genomeNg: 5000,
    plasmidLengthBp: 3000,
    plasmidNg: 25,
  },
} satisfies ToolExample<{
  readonly genomeLengthBp: number;
  readonly genomeNg: number;
  readonly plasmidLengthBp: number;
  readonly plasmidNg: number;
}>;

export const plasmidCopyNumberPerCellTool = createSimpleTool({
  id: "biology/plasmid-copy-number-per-cell",
  title: "Plasmid Copies Per Cell",
  description:
    "Estimate plasmid copies per cell from plasmid and genomic DNA masses, correcting the mass ratio for their different molecule lengths.",
  inputs: [
    { id: "plasmidNg", label: "Plasmid mass", kind: "number", unit: "ng" },
    { id: "genomeNg", label: "Genome mass", kind: "number", unit: "ng" },
    {
      id: "plasmidLengthBp",
      label: "Plasmid length",
      kind: "integer",
      minimum: 1,
      unit: "bp",
    },
    {
      id: "genomeLengthBp",
      label: "Genome length",
      kind: "integer",
      minimum: 1,
      unit: "bp",
    },
    {
      default: 1,
      id: "hostCopies",
      kind: "integer",
      label: "Host genome copies",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "plasmidCopiesPerCell",
      label: "Plasmid copies per cell",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const plasmidNg = input.plasmidNg as number;
    const genomeNg = input.genomeNg as number;
    const plasmidLengthBp = input.plasmidLengthBp as number;
    const genomeLengthBp = input.genomeLengthBp as number;
    const hostCopies = input.hostCopies as number;
    if (plasmidNg <= 0)
      simpleError(
        "plasmidNg",
        "Plasmid mass must be positive.",
        "invalid_mass",
      );
    if (genomeNg <= 0)
      simpleError("genomeNg", "Genome mass must be positive.", "invalid_mass");
    return {
      plasmidCopiesPerCell:
        (plasmidNg / genomeNg) *
        (genomeLengthBp / plasmidLengthBp) *
        hostCopies,
    };
  },
});
export const runPlasmidCopyNumberPerCell = plasmidCopyNumberPerCellTool.execute;
export default plasmidCopyNumberPerCellTool;
