import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  monoisotopicResidueMass,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly protonMassDa: number;
  readonly waterMassDa: number;
}>;
export type Output = Readonly<{
  readonly yIonMassesDa: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (s.length < 2 || input.protonMassDa <= 0 || input.waterMassDa <= 0)
    simpleError(
      "sequence",
      "At least two residues and positive ion masses required.",
    );
  const yIonMassesDa: number[] = [];
  let mass = input.protonMassDa + input.waterMassDa;
  for (let i = s.length - 1; i > 0; i--) {
    mass += monoisotopicResidueMass[s[i]];
    yIonMassesDa.push(mass);
  }
  return { yIonMassesDa };
};
export const exampleInput = {
  sequence: "AGG",
  protonMassDa: 1,
  waterMassDa: 18,
} satisfies Input;
export const exampleOutput = {
  yIonMassesDa: [76.02145999999999, 133.04291999999998],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/y-ion-series",
  title: "Y Ion Series",
  description: "Build theoretical C-terminal peptide y-ion masses.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "protonMassDa", label: "Proton mass da", kind: "number" },
    { id: "waterMassDa", label: "Water mass da", kind: "number" },
  ],
  outputs: [
    { id: "yIonMassesDa", label: "Y ion masses da", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      protonMassDa: value.protonMassDa as number,
      waterMassDa: value.waterMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
