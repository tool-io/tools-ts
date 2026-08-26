import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VerseLinePipeCounterInput = {
  readonly verse: string;
};

export type VerseLinePipeCounterOutput = {
  readonly pipeCount: number;
  readonly verseLineCount: number;
};

export const calculateVerseLinePipeCounter = (
  input: VerseLinePipeCounterInput,
): VerseLinePipeCounterOutput => {
  if (!input.verse.trim())
    return simpleError("verse", "Verse text is required.", "invalid_verse");
  let pipeCount = 0;
  for (const ch of input.verse) if (ch === "|") pipeCount += 1;
  return { pipeCount, verseLineCount: pipeCount + 1 };
};

export const verseLinePipeCounterExample = {
  input: { verse: "DIS MANIBVS | SIT TIBI TERRA LEVIS" },
  output: { pipeCount: 1, verseLineCount: 2 },
} satisfies ToolExample<VerseLinePipeCounterInput, VerseLinePipeCounterOutput>;

export const verseLinePipeCounterTool = createSimpleTool({
  id: "epigraphy/verse-line-pipe-counter",
  title: "Verse Line Divider Pipe Counter for Carmina",
  description:
    "Count vertical-bar verse dividers in a carmina transcription, where the number of verse lines equals the divider count plus one.",
  inputs: [
    {
      description: "Carmina text with | line dividers.",
      id: "verse",
      kind: "string",
      label: "Verse",
    },
  ],
  outputs: [
    {
      description: "Number of | divider characters.",
      id: "pipeCount",
      kind: "integer",
      label: "Pipes",
    },
    {
      description: "Verse lines implied (dividers plus one).",
      id: "verseLineCount",
      kind: "integer",
      label: "Lines",
    },
  ],
  calculate: (input) =>
    calculateVerseLinePipeCounter(
      input as unknown as VerseLinePipeCounterInput,
    ),
});

export const runVerseLinePipeCounter = verseLinePipeCounterTool.execute;
export default verseLinePipeCounterTool;
