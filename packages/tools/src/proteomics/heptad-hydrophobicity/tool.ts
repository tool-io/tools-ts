import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly hydrophobicResidues: string;
  readonly minimumCoreFraction: number;
}>;
export type Output = Readonly<{
  readonly coreFraction: number;
  readonly coiledCoilCandidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    s.length < 7 ||
    input.minimumCoreFraction < 0 ||
    input.minimumCoreFraction > 1
  )
    simpleError(
      "sequence",
      "At least one heptad and valid threshold required.",
    );
  const core = [...s].filter((_, i) => i % 7 === 0 || i % 7 === 3),
    coreFraction =
      core.filter((v) => input.hydrophobicResidues.includes(v)).length /
      core.length;
  return {
    coreFraction,
    coiledCoilCandidate: coreFraction >= input.minimumCoreFraction,
  };
};
export const exampleInput = {
  sequence: "AAAAAAAAAAAAAA",
  hydrophobicResidues: "AILMVF",
  minimumCoreFraction: 0.75,
} satisfies Input;
export const exampleOutput = {
  coreFraction: 1,
  coiledCoilCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/heptad-hydrophobicity",
  title: "Heptad Hydrophobicity",
  description:
    "Score a/d heptad hydrophobicity as a coiled-coil candidate feature.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "hydrophobicResidues",
      label: "Hydrophobic residues",
      kind: "string",
    },
    {
      id: "minimumCoreFraction",
      label: "Minimum core fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "coreFraction", label: "Core fraction", kind: "number" },
    {
      id: "coiledCoilCandidate",
      label: "Coiled coil candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      hydrophobicResidues: value.hydrophobicResidues as string,
      minimumCoreFraction: value.minimumCoreFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
