import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ErasureDoubleSlashDetectorInput = {
  readonly text: string;
};

export type ErasureDoubleSlashDetectorOutput = {
  readonly erasureMarkCount: number;
  readonly positions: readonly number[];
  readonly longestRun: number;
};

export const calculateErasureDoubleSlashDetector = (
  input: ErasureDoubleSlashDetectorInput,
): ErasureDoubleSlashDetectorOutput => {
  if (!input.text.trim())
    return simpleError(
      "text",
      "Transcription text is required.",
      "invalid_text",
    );
  const matches = [...input.text.matchAll(/\/{2,}|\\{2,}/g)];
  const positions = matches.map((match) => match.index ?? 0);
  return {
    erasureMarkCount: matches.length,
    positions,
    longestRun:
      matches.length === 0
        ? 0
        : Math.max(...matches.map((match) => match[0].length)),
  };
};

export const erasureDoubleSlashDetectorExample = {
  input: { text: "VIVVS //FE//CIT" },
  output: { erasureMarkCount: 2, positions: [6, 10], longestRun: 2 },
} satisfies ToolExample<
  ErasureDoubleSlashDetectorInput,
  ErasureDoubleSlashDetectorOutput
>;

export const erasureDoubleSlashDetectorTool = createSimpleTool({
  id: "epigraphy/erasure-double-slash-detector",
  title: "Erasure Marker Double Slash Detector",
  description:
    "Detect double-slash erasure (rasura) markers in a transcription, defined as runs of at least two forward or backward slashes, reporting run count, start positions, and the longest slash run.",
  inputs: [
    {
      description: "Transcription with erasure markers.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Number of erasure marker runs.",
      id: "erasureMarkCount",
      kind: "integer",
      label: "Markers",
    },
    {
      description: "Zero-based start position of each run.",
      id: "positions",
      kind: "numberList",
      label: "Positions",
    },
    {
      description: "Length of the longest slash run.",
      id: "longestRun",
      kind: "integer",
      label: "Longest run",
    },
  ],
  calculate: (input) =>
    calculateErasureDoubleSlashDetector(
      input as unknown as ErasureDoubleSlashDetectorInput,
    ),
});

export const runErasureDoubleSlashDetector =
  erasureDoubleSlashDetectorTool.execute;
export default erasureDoubleSlashDetectorTool;
