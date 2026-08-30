import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly notation: string;
}>;
export type Output = Readonly<{
  readonly molecule: string;
  readonly strandedness: string;
  readonly sense: string;
  readonly reverseTranscribing: boolean;
  readonly baltimoreClass: string;
}>;
export const calculate = (input: Input): Output => {
  const text = input.notation.trim(),
    match = /^(ss|ds)(DNA|RNA)([+-])?(-RT)?$/.exec(text);
  if (!match)
    return simpleError(
      "notation",
      "Use ss/ds DNA or RNA notation, optional RNA sense and optional -RT.",
    );
  const strandedness = match[1] === "ss" ? "single" : "double",
    molecule = match[2],
    sense =
      match[3] === "+"
        ? "positive"
        : match[3] === "-"
          ? "negative"
          : "unspecified",
    reverseTranscribing = Boolean(match[4]);
  if (
    ((molecule === "DNA" || strandedness === "double") && match[3]) ||
    (molecule === "RNA" &&
      strandedness === "single" &&
      !reverseTranscribing &&
      !match[3]) ||
    (reverseTranscribing &&
      ((molecule === "RNA" && strandedness !== "single") ||
        (molecule === "DNA" && strandedness !== "double") ||
        sense === "negative"))
  )
    simpleError(
      "notation",
      "Sense and reverse-transcription qualifiers are incompatible or incomplete for this notation.",
    );
  const baltimoreClass = reverseTranscribing
    ? molecule === "RNA"
      ? "VI"
      : "VII"
    : molecule === "DNA"
      ? strandedness === "double"
        ? "I"
        : "II"
      : strandedness === "double"
        ? "III"
        : sense === "positive"
          ? "IV"
          : "V";
  return { molecule, strandedness, sense, reverseTranscribing, baltimoreClass };
};
export const exampleInput = { notation: "ssRNA+" } satisfies Input;
export const exampleOutput = {
  molecule: "RNA",
  strandedness: "single",
  sense: "positive",
  reverseTranscribing: false,
  baltimoreClass: "IV",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/viral-genome-notation-parser",
  title: "Viral Genome Notation Parser",
  description:
    "Parse canonical viral genome notation and derive Baltimore class; not a species identifier.",
  inputs: [{ id: "notation", label: "Notation", kind: "string" }],
  outputs: [
    { id: "molecule", label: "Molecule", kind: "string" },
    { id: "strandedness", label: "Strandedness", kind: "string" },
    { id: "sense", label: "Sense", kind: "string" },
    {
      id: "reverseTranscribing",
      label: "Reverse transcribing",
      kind: "boolean",
    },
    { id: "baltimoreClass", label: "Baltimore class", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      notation: value.notation as string,
    }),
});
export const run = tool.execute;
export default tool;
