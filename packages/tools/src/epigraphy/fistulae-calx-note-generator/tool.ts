import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FistulaeCalxNoteGeneratorInput = {
  readonly stampText: string;
  readonly calxMarkPresent?: boolean;
};

export type FistulaeCalxNoteGeneratorOutput = {
  readonly note: string;
  readonly includesCalxMark: boolean;
};

export const calculateFistulaeCalxNoteGenerator = (
  input: FistulaeCalxNoteGeneratorInput,
): FistulaeCalxNoteGeneratorOutput => {
  const stampText = input.stampText.trim();
  if (!stampText)
    return simpleError(
      "stampText",
      "The fistula stamp reading must be a non-empty string.",
      "empty_stamp",
    );
  const calxMarkPresent = input.calxMarkPresent ?? false;
  return {
    includesCalxMark: calxMarkPresent,
    note: `Lead fistula stamp reading "${stampText}" — ${
      calxMarkPresent
        ? "a calx (chalk) mark is recorded beside the stamp."
        : "no calx mark was noted beside the stamp."
    }`,
  };
};

export const fistulaeCalxNoteGeneratorExample = {
  input: { stampText: "OPP DOMITIANI", calxMarkPresent: true },
  output: {
    note: 'Lead fistula stamp reading "OPP DOMITIANI" — a calx (chalk) mark is recorded beside the stamp.',
    includesCalxMark: true,
  },
} satisfies ToolExample<
  FistulaeCalxNoteGeneratorInput,
  FistulaeCalxNoteGeneratorOutput
>;

export const fistulaeCalxNoteGeneratorTool = createSimpleTool({
  id: "epigraphy/fistulae-calx-note-generator",
  title: "Lead Pipe Stamp Fistulae Calx Reading Note Generator",
  description:
    "Generate a standardized cataloguing note for a lead pipe (fistula) stamp that quotes the reading verbatim and records whether an accompanying calx (chalk) mark was observed.",
  inputs: [
    {
      description: "Transcription of the fistula stamp.",
      id: "stampText",
      kind: "string",
      label: "Stamp text",
    },
    {
      default: false,
      description: "True when a chalk mark accompanies the stamp.",
      id: "calxMarkPresent",
      kind: "boolean",
      label: "Calx present",
    },
  ],
  outputs: [
    {
      description: "Formatted catalogue note sentence.",
      id: "note",
      kind: "string",
      label: "Note",
    },
    {
      description: "Echo of the calx-mark flag used in the note.",
      id: "includesCalxMark",
      kind: "boolean",
      label: "Includes calx",
    },
  ],
  calculate: (input) =>
    calculateFistulaeCalxNoteGenerator(
      input as unknown as FistulaeCalxNoteGeneratorInput,
    ),
});

export const runFistulaeCalxNoteGenerator =
  fistulaeCalxNoteGeneratorTool.execute;
export default fistulaeCalxNoteGeneratorTool;
