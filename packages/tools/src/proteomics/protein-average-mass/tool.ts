import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  averageResidueMass,
  peptideNeutralMass,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly waterMassDa: number;
}>;
export type Output = Readonly<{
  readonly averageMassDa: number;
  readonly residueCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (input.waterMassDa <= 0)
    simpleError("waterMassDa", "Terminal water mass must be positive.");
  return {
    averageMassDa: peptideNeutralMass(s, averageResidueMass, input.waterMassDa),
    residueCount: s.length,
  };
};
export const exampleInput = {
  sequence: "A",
  waterMassDa: 18.01528,
} satisfies Input;
export const exampleOutput = {
  averageMassDa: 89.09408,
  residueCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-average-mass",
  title: "Protein Average Mass",
  description:
    "Sum average isotopic residue masses plus terminal water for a protein sequence.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "waterMassDa", label: "Water mass da", kind: "number" },
  ],
  outputs: [
    { id: "averageMassDa", label: "Average mass da", kind: "number" },
    { id: "residueCount", label: "Residue count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      waterMassDa: value.waterMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
