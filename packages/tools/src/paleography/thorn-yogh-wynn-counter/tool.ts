import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThornYoghWynnCounterInput = {
  readonly text: string;
};

export type ThornYoghWynnCounterOutput = {
  readonly thornCount: number;
  readonly yoghCount: number;
  readonly wynnCount: number;
  readonly specialPerThousandCharacters: number;
};

export const calculateThornYoghWynnCounter = (
  input: ThornYoghWynnCounterInput,
): ThornYoghWynnCounterOutput => {
  if (input.text.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const countChars = (text: string, glyphs: readonly string[]): number =>
    glyphs.reduce((total, glyph) => total + text.split(glyph).length - 1, 0);
  const thornCount = countChars(input.text, ["\u00FE", "\u00DE"]);
  const yoghCount = countChars(input.text, ["\u021C", "\u021D"]);
  const wynnCount = countChars(input.text, ["\u01BF"]);
  const total = thornCount + yoghCount + wynnCount;
  const characterCount = [...input.text].length;
  return {
    thornCount,
    yoghCount,
    wynnCount,
    specialPerThousandCharacters: (total / characterCount) * 1000,
  };
};

export const thornYoghWynnCounterExample = {
  input: { text: "\u00FEonne \u01BFile \u021Det" },
  output: {
    thornCount: 1,
    yoghCount: 1,
    wynnCount: 1,
    specialPerThousandCharacters: 214.28571428571428,
  },
} satisfies ToolExample<ThornYoghWynnCounterInput, ThornYoghWynnCounterOutput>;

export const thornYoghWynnCounterTool = createSimpleTool({
  id: "paleography/thorn-yogh-wynn-counter",
  title: "Thorn, Yogh and Wynn Counter",
  description:
    "Count Insular-derived special letters (thorn \u00FE/\u00DE, yogh \u021C/\u021D and wynn \u01BF) in a transcription sample and report their combined frequency per thousand characters as exact arithmetic.",
  inputs: [
    {
      description: "Transcription sample to scan.",
      id: "text",
      kind: "string",
      label: "Text sample",
    },
  ],
  outputs: [
    {
      description: "Occurrences of thorn (both cases).",
      id: "thornCount",
      kind: "integer",
      label: "Thorn",
    },
    {
      description: "Occurrences of yogh (both cases).",
      id: "yoghCount",
      kind: "integer",
      label: "Yogh",
    },
    {
      description: "Occurrences of wynn.",
      id: "wynnCount",
      kind: "integer",
      label: "Wynn",
    },
    {
      description: "Special letters per thousand characters.",
      id: "specialPerThousandCharacters",
      kind: "number",
      label: "Per 1000 chars",
    },
  ],
  calculate: (input) =>
    calculateThornYoghWynnCounter({ text: input.text as string }),
});

export const runThornYoghWynnCounter = thornYoghWynnCounterTool.execute;
export default thornYoghWynnCounterTool;
