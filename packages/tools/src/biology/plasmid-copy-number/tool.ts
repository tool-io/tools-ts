import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const plasmidCopyNumberExample = {
  input: {
    genomeConcNgUl: 20,
    genomeSizeBp: 6000,
    plasmidConcNgUl: 40,
    plasmidLengthBp: 3000,
  },
} satisfies ToolExample<{
  readonly genomeConcNgUl: number;
  readonly genomeSizeBp: number;
  readonly plasmidConcNgUl: number;
  readonly plasmidLengthBp: number;
}>;

export const plasmidCopyNumberTool = createSimpleTool({
  id: "biology/plasmid-copy-number",
  title: "Plasmid Copy Number",
  description:
    "Estimate plasmid copies per genome as the concentration ratio scaled by the inverse ratio of molecule lengths.",
  inputs: [
    {
      id: "plasmidConcNgUl",
      label: "Plasmid concentration",
      kind: "number",
      unit: "ng/µL",
    },
    {
      id: "genomeConcNgUl",
      label: "Genome concentration",
      kind: "number",
      unit: "ng/µL",
    },
    {
      id: "plasmidLengthBp",
      label: "Plasmid length",
      kind: "number",
      unit: "bp",
    },
    {
      id: "genomeSizeBp",
      label: "Genome size",
      kind: "number",
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "plasmidCopyNumberPerGenome",
      label: "Plasmid copies per genome",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const plasmidConcNgUl = input.plasmidConcNgUl as number;
    const genomeConcNgUl = input.genomeConcNgUl as number;
    const plasmidLengthBp = input.plasmidLengthBp as number;
    const genomeSizeBp = input.genomeSizeBp as number;
    if (
      plasmidConcNgUl <= 0 ||
      genomeConcNgUl <= 0 ||
      plasmidLengthBp <= 0 ||
      genomeSizeBp <= 0
    )
      simpleError(
        "plasmidConcNgUl",
        "Concentrations and lengths must be greater than zero.",
        "invalid_value",
      );
    return {
      plasmidCopyNumberPerGenome:
        (plasmidConcNgUl / genomeConcNgUl) * (genomeSizeBp / plasmidLengthBp),
    };
  },
});
export const runPlasmidCopyNumber = plasmidCopyNumberTool.execute;
export default plasmidCopyNumberTool;
