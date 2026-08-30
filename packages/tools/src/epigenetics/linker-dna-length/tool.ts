import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nucleosomeRepeatLengthBp: number;
  readonly coreParticleLengthBp: number;
}>;
export type Output = Readonly<{
  readonly linkerDnaLengthBp: number;
  readonly positiveLinker: boolean;
}>;

export const calculate = (input: Input): Output => {
  const linkerDnaLengthBp =
    input.nucleosomeRepeatLengthBp - input.coreParticleLengthBp;
  return { linkerDnaLengthBp, positiveLinker: linkerDnaLengthBp > 0 };
};

export const exampleInput = {
  nucleosomeRepeatLengthBp: 200,
  coreParticleLengthBp: 147,
} satisfies Input;
export const exampleOutput = {
  linkerDnaLengthBp: 53,
  positiveLinker: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nucleosomeRepeatLengthBp: input.nucleosomeRepeatLengthBp as number,
      coreParticleLengthBp: input.coreParticleLengthBp as number,
    }),
  description:
    "Derive linker DNA length from repeat and core-particle lengths.",
  id: "epigenetics/linker-dna-length",
  inputs: [
    {
      id: "nucleosomeRepeatLengthBp",
      label: "Nucleosome repeat length",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "coreParticleLengthBp",
      label: "Core particle length",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "linkerDnaLengthBp",
      label: "Linker DNA length",
      kind: "number",
      unit: "bp",
    },
    {
      id: "positiveLinker",
      label: "Linker length is positive",
      kind: "boolean",
    },
  ],
  title: "Linker DNA Length",
});

export const run = tool.execute;
export default tool;
