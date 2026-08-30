import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  monoisotopicResidueMass,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly protonMassDa: number;
}>;
export type Output = Readonly<{
  readonly bIonMassesDa: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (s.length < 2 || input.protonMassDa <= 0)
    simpleError(
      "sequence",
      "At least two residues and positive proton mass required.",
    );
  const bIonMassesDa: number[] = [];
  let mass = input.protonMassDa;
  for (let i = 0; i < s.length - 1; i++) {
    mass += monoisotopicResidueMass[s[i]];
    bIonMassesDa.push(mass);
  }
  return { bIonMassesDa };
};
export const exampleInput = {
  sequence: "AGG",
  protonMassDa: 1,
} satisfies Input;
export const exampleOutput = {
  bIonMassesDa: [72.03711, 129.05857],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/b-ion-series",
  title: "B Ion Series",
  description: "Build theoretical N-terminal peptide b-ion masses.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "protonMassDa", label: "Proton mass da", kind: "number" },
  ],
  outputs: [
    { id: "bIonMassesDa", label: "B ion masses da", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      protonMassDa: value.protonMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
