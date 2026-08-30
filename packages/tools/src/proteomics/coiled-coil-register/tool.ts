import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly hydrophobicResidues: string;
}>;
export type Output = Readonly<{
  readonly bestRegister: number;
  readonly hydrophobicCoreCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  let bestRegister = 0,
    hydrophobicCoreCount = -1;
  for (let register = 0; register < 7; register++) {
    let hits = 0;
    for (let i = 0; i < s.length; i++)
      if ((i - register + 7) % 7 === 0 || (i - register + 7) % 7 === 3) {
        if (input.hydrophobicResidues.includes(s[i])) hits++;
      }
    if (hits > hydrophobicCoreCount) {
      hydrophobicCoreCount = hits;
      bestRegister = register;
    }
  }
  return { bestRegister, hydrophobicCoreCount };
};
export const exampleInput = {
  sequence: "AALAAALAALAAAL",
  hydrophobicResidues: "AILMVF",
} satisfies Input;
export const exampleOutput = {
  bestRegister: 0,
  hydrophobicCoreCount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/coiled-coil-register",
  title: "Coiled Coil Register",
  description:
    "Score coiled-coil heptad register by hydrophobic a/d positions.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "hydrophobicResidues",
      label: "Hydrophobic residues",
      kind: "string",
    },
  ],
  outputs: [
    { id: "bestRegister", label: "Best register", kind: "number" },
    {
      id: "hydrophobicCoreCount",
      label: "Hydrophobic core count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      hydrophobicResidues: value.hydrophobicResidues as string,
    }),
});
export const run = tool.execute;
export default tool;
