import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly tailLength: number;
  readonly hydrophobicResidues: string;
  readonly minimumTailHydrophobicFraction: number;
}>;
export type Output = Readonly<{
  readonly omegaIndex: number;
  readonly tailHydrophobicFraction: number;
  readonly candidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.tailLength) ||
    input.tailLength < 1 ||
    s.length <= input.tailLength ||
    input.minimumTailHydrophobicFraction < 0 ||
    input.minimumTailHydrophobicFraction > 1
  )
    simpleError("tailLength", "Tail must leave one candidate omega site.");
  const omegaIndex = s.length - input.tailLength - 1,
    tail = s.slice(-input.tailLength),
    tailHydrophobicFraction =
      [...tail].filter((v) => input.hydrophobicResidues.includes(v)).length /
      tail.length;
  return {
    omegaIndex,
    tailHydrophobicFraction,
    candidate:
      "SACGN".includes(s[omegaIndex]) &&
      tailHydrophobicFraction >= input.minimumTailHydrophobicFraction,
  };
};
export const exampleInput = {
  sequence: "ASAAAAAA",
  tailLength: 6,
  hydrophobicResidues: "AILMVF",
  minimumTailHydrophobicFraction: 0.75,
} satisfies Input;
export const exampleOutput = {
  omegaIndex: 1,
  tailHydrophobicFraction: 1,
  candidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/gpi-anchor-signal-screen",
  title: "GPI Anchor Signal Screen",
  description:
    "Screen C-terminal omega site and hydrophobic tail for a GPI-anchor signal.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "tailLength", label: "Tail length", kind: "number" },
    {
      id: "hydrophobicResidues",
      label: "Hydrophobic residues",
      kind: "string",
    },
    {
      id: "minimumTailHydrophobicFraction",
      label: "Minimum tail hydrophobic fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "omegaIndex", label: "Omega index", kind: "number" },
    {
      id: "tailHydrophobicFraction",
      label: "Tail hydrophobic fraction",
      kind: "number",
    },
    { id: "candidate", label: "Candidate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      tailLength: value.tailLength as number,
      hydrophobicResidues: value.hydrophobicResidues as string,
      minimumTailHydrophobicFraction:
        value.minimumTailHydrophobicFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
