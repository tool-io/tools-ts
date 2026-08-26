import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SegEntryParserInput = {
  readonly reference: string;
};

export type SegEntryParserOutput = {
  readonly volumeNumber: number;
  readonly entryNumber: number;
  readonly letterSuffix: string;
};

export const calculateSegEntryParser = (
  input: SegEntryParserInput,
): SegEntryParserOutput => {
  const match = /^SEG\s+(\d{1,2})\s*,\s*(\d{1,5})([a-z]?)$/i.exec(
    input.reference.trim(),
  );
  if (!match)
    return simpleError(
      "reference",
      'Expected a Supplementum Epigraphicum Graecum reference like "SEG 41, 785".',
      "invalid_reference",
    );
  const volumeNumber = Number.parseInt(match[1], 10);
  if (!(volumeNumber >= 1 && volumeNumber <= 99))
    return simpleError(
      "reference",
      "SEG volumes are numbered with one or two digits from 1.",
      "invalid_volume",
    );
  const entryNumber = Number.parseInt(match[2], 10);
  if (entryNumber < 1)
    return simpleError(
      "reference",
      "The SEG entry number must be greater than zero.",
      "invalid_entry_number",
    );
  return {
    volumeNumber,
    entryNumber,
    letterSuffix: match[3].toLowerCase(),
  };
};

export const segEntryParserExample = {
  input: { reference: "SEG 41, 785" },
  output: { volumeNumber: 41, entryNumber: 785, letterSuffix: "" },
} satisfies ToolExample<SegEntryParserInput, SegEntryParserOutput>;

export const segEntryParserTool = createSimpleTool({
  id: "epigraphy/seg-entry-parser",
  title: "SEG Supplementum Epigraphicum Graecum Entry Parser",
  description:
    'Parse a Supplementum Epigraphicum Graecum reference of the form "SEG <volume>, <entry><letter?>" into its arabic volume, entry number, and optional lowercase letter suffix.',
  inputs: [
    {
      description: 'Reference string such as "SEG 41, 785".',
      id: "reference",
      kind: "string",
      label: "SEG reference",
    },
  ],
  outputs: [
    {
      description: "Arabic SEG volume number.",
      id: "volumeNumber",
      kind: "integer",
      label: "Volume",
    },
    {
      description: "Entry number within the volume.",
      id: "entryNumber",
      kind: "integer",
      label: "Entry",
    },
    {
      description:
        "Lowercase letter suffix after the entry number, or empty string.",
      id: "letterSuffix",
      kind: "string",
      label: "Letter suffix",
    },
  ],
  calculate: (input) =>
    calculateSegEntryParser(input as unknown as SegEntryParserInput),
});

export const runSegEntryParser = segEntryParserTool.execute;
export default segEntryParserTool;
