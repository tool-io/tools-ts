import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly neutralMassDa: number;
  readonly charge: number;
  readonly protonMassDa: number;
}>;
export type Output = Readonly<{
  readonly precursorMz: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.neutralMassDa <= 0 ||
    !Number.isSafeInteger(input.charge) ||
    input.charge <= 0 ||
    input.protonMassDa <= 0
  )
    simpleError(
      "charge",
      "Positive neutral mass, proton mass and integer charge required.",
    );
  return {
    precursorMz: input.neutralMassDa / input.charge + input.protonMassDa,
  };
};
export const exampleInput = {
  neutralMassDa: 1000,
  charge: 2,
  protonMassDa: 1,
} satisfies Input;
export const exampleOutput = { precursorMz: 501 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/precursor-mz",
  title: "Precursor MZ",
  description: "Calculate peptide precursor m/z for a given integer charge.",
  inputs: [
    { id: "neutralMassDa", label: "Neutral mass da", kind: "number" },
    { id: "charge", label: "Charge", kind: "number" },
    { id: "protonMassDa", label: "Proton mass da", kind: "number" },
  ],
  outputs: [{ id: "precursorMz", label: "Precursor mz", kind: "number" }],
  calculate: (value) =>
    calculate({
      neutralMassDa: value.neutralMassDa as number,
      charge: value.charge as number,
      protonMassDa: value.protonMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
