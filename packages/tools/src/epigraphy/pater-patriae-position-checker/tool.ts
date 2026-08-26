import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaterPatriaePositionCheckerInput = {
  readonly text: string;
};

export type PaterPatriaePositionCheckerOutput = {
  readonly present: boolean;
  readonly occurrenceCount: number;
  readonly firstOccurrenceTokenIndex: number;
  readonly isFirstToken: boolean;
  readonly isLastToken: boolean;
};

const FORMULA = /PATER(?:\s|·|\.)*PATRIAE|\bP(?:\s|·|\.)*PATRIAE/gi;

export const calculatePaterPatriaePositionChecker = (
  input: PaterPatriaePositionCheckerInput,
): PaterPatriaePositionCheckerOutput => {
  if (!input.text.trim())
    return simpleError("text", "Inscription text is required.", "invalid_text");
  const occurrences = [...input.text.matchAll(FORMULA)].map((match) => ({
    index: match.index ?? 0,
    length: match[0].length,
  }));
  if (occurrences.length === 0)
    return {
      present: false,
      occurrenceCount: 0,
      firstOccurrenceTokenIndex: 0,
      isFirstToken: false,
      isLastToken: false,
    };
  const first = occurrences[0];
  const prefix = input.text.slice(0, first.index).trim();
  const firstOccurrenceTokenIndex = prefix ? prefix.split(/\s+/).length : 0;
  return {
    present: true,
    occurrenceCount: occurrences.length,
    firstOccurrenceTokenIndex,
    isFirstToken: firstOccurrenceTokenIndex === 0,
    isLastToken:
      input.text.slice(first.index + first.length).trim().length === 0,
  };
};

export const paterPatriaePositionCheckerExample = {
  input: { text: "IMP CAESAR DIVI F AVGVSTVS PATER PATRIAE" },
  output: {
    present: true,
    occurrenceCount: 1,
    firstOccurrenceTokenIndex: 5,
    isFirstToken: false,
    isLastToken: true,
  },
} satisfies ToolExample<
  PaterPatriaePositionCheckerInput,
  PaterPatriaePositionCheckerOutput
>;

export const paterPatriaePositionCheckerTool = createSimpleTool({
  id: "epigraphy/pater-patriae-position-checker",
  title: "Pater Patriae Title Presence Position Checker",
  description:
    "Detect the Pater Patriae honorific (spelled out or as P PATRIAE with optional interpuncts) in an inscription and report occurrence count plus its position among whitespace-separated tokens.",
  inputs: [
    {
      description: "Inscription text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "True when the title occurs at least once.",
      id: "present",
      kind: "boolean",
      label: "Present",
    },
    {
      description: "Number of occurrences.",
      id: "occurrenceCount",
      kind: "integer",
      label: "Occurrences",
    },
    {
      description:
        "Zero-based whitespace-token index of the first occurrence (0 when absent).",
      id: "firstOccurrenceTokenIndex",
      kind: "integer",
      label: "Token index",
    },
    {
      description: "True when the title opens the text.",
      id: "isFirstToken",
      kind: "boolean",
      label: "First token",
    },
    {
      description: "True when nothing follows the title except whitespace.",
      id: "isLastToken",
      kind: "boolean",
      label: "Last token",
    },
  ],
  calculate: (input) =>
    calculatePaterPatriaePositionChecker(
      input as unknown as PaterPatriaePositionCheckerInput,
    ),
});

export const runPaterPatriaePositionChecker =
  paterPatriaePositionCheckerTool.execute;
export default paterPatriaePositionCheckerTool;
