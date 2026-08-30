import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftWing: string;
  readonly gap: string;
  readonly rightWing: string;
  readonly minimumGapLength: number;
}>;
export type Output = Readonly<{
  readonly oligo: string;
  readonly lengthNt: number;
  readonly wingBalance: number;
  readonly gapValid: boolean;
}>;

export const calculate = (input: Input): Output => {
  const parts = [input.leftWing, input.gap, input.rightWing];
  if (parts.some((v) => !/^[ACGTU]+$/i.test(v)) || input.minimumGapLength < 1)
    simpleError(
      "gap",
      "Nonempty nucleotide-only gapmer segments are required.",
    );
  return {
    oligo: parts.join("").toUpperCase(),
    lengthNt: parts.join("").length,
    wingBalance: input.leftWing.length - input.rightWing.length,
    gapValid: input.gap.length >= input.minimumGapLength,
  };
};

export const exampleInput = {
  leftWing: "ACG",
  gap: "TTTT",
  rightWing: "GCA",
  minimumGapLength: 3,
} satisfies Input;
export const exampleOutput = {
  oligo: "ACGTTTTGCA",
  lengthNt: 10,
  wingBalance: 0,
  gapValid: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/gapmer-layout",
  title: "Gapmer Layout",
  description:
    "Assemble and assess an antisense wing-gap-wing oligonucleotide layout.",
  inputs: [
    { id: "leftWing", kind: "string", label: "Left wing" },
    { id: "gap", kind: "string", label: "Gap" },
    { id: "rightWing", kind: "string", label: "Right wing" },
    { id: "minimumGapLength", kind: "number", label: "Minimum gap length" },
  ],
  outputs: [
    { id: "oligo", kind: "string", label: "Oligo" },
    { id: "lengthNt", kind: "number", label: "Length nt" },
    { id: "wingBalance", kind: "number", label: "Wing balance" },
    { id: "gapValid", kind: "boolean", label: "Gap valid" },
  ],
  calculate: (value) =>
    calculate({
      leftWing: value.leftWing as string,
      gap: value.gap as string,
      rightWing: value.rightWing as string,
      minimumGapLength: value.minimumGapLength as number,
    }),
});
export const run = tool.execute;
export default tool;
