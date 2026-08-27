import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ProteinIsoelectricPointInput = {
  readonly acidicResidues: number;
  readonly basicResidues: number;
};

export type ProteinIsoelectricPointOutput = {
  readonly isoelectricPointEstimate: number;
};

export const proteinIsoelectricPointExample = {
  input: { acidicResidues: 30, basicResidues: 35 },
  output: { isoelectricPointEstimate: 7.25 },
} satisfies ToolExample<
  ProteinIsoelectricPointInput,
  ProteinIsoelectricPointOutput
>;

export const proteinIsoelectricPointTool = createSimpleTool({
  id: "biology/protein-isoelectric-point",
  title: "Simple Protein pI",
  description:
    "Estimate protein isoelectric point from acidic and basic residue counts with a linear charge balance model clamped to two through twelve.",
  inputs: [
    {
      id: "acidicResidues",
      label: "Acidic residues",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "basicResidues",
      label: "Basic residues",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "isoelectricPointEstimate",
      label: "Isoelectric point estimate",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const basicResidues = input.basicResidues as number;
    const acidicResidues = input.acidicResidues as number;
    return {
      isoelectricPointEstimate: Math.min(
        12,
        Math.max(2, 7 + 0.05 * (basicResidues - acidicResidues)),
      ),
    };
  },
});
export const runProteinIsoelectricPoint = proteinIsoelectricPointTool.execute;
export default proteinIsoelectricPointTool;
