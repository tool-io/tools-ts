import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TironianEtFrequencyCounterInput = {
  readonly text: string;
};

export type TironianEtFrequencyCounterOutput = {
  readonly tironianEtCount: number;
  readonly ampersandCount: number;
  readonly standaloneEtTokenCount: number;
  readonly tironianPerThousandTokens: number;
};

export const calculateTironianEtFrequencyCounter = (
  input: TironianEtFrequencyCounterInput,
): TironianEtFrequencyCounterOutput => {
  const trimmed = input.text.trim();
  if (trimmed.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const tokens = trimmed.split(/\s+/);
  const countChar = (text: string, glyph: string): number =>
    text.split(glyph).length - 1;
  const tironianEtCount = countChar(input.text, "\u204A");
  const ampersandCount = countChar(input.text, "&");
  const standaloneEtTokenCount = tokens.filter(
    (token) => token.toLowerCase().replace(/^\P{L}+|\P{L}+$/gu, "") === "et",
  ).length;
  return {
    tironianEtCount,
    ampersandCount,
    standaloneEtTokenCount,
    tironianPerThousandTokens: (tironianEtCount / tokens.length) * 1000,
  };
};

export const tironianEtFrequencyCounterExample = {
  input: { text: "⁊ & et ⁊" },
  output: {
    tironianEtCount: 2,
    ampersandCount: 1,
    standaloneEtTokenCount: 1,
    tironianPerThousandTokens: 500,
  },
} satisfies ToolExample<
  TironianEtFrequencyCounterInput,
  TironianEtFrequencyCounterOutput
>;

export const tironianEtFrequencyCounterTool = createSimpleTool({
  id: "paleography/tironian-et-frequency-counter",
  title: "Tironian Et Frequency Counter",
  description:
    "Count the Tironian et sign (U+204A), the ampersand and standalone 'et' tokens in a transcription sample and report the Tironian et rate per thousand whitespace tokens as exact arithmetic.",
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
      description: "Occurrences of U+204A.",
      id: "tironianEtCount",
      kind: "integer",
      label: "Tironian et",
    },
    {
      description: "Occurrences of &.",
      id: "ampersandCount",
      kind: "integer",
      label: "Ampersands",
    },
    {
      description:
        "Whitespace-delimited tokens equal to 'et' after surrounding punctuation is ignored (case-insensitive).",
      id: "standaloneEtTokenCount",
      kind: "integer",
      label: "'et' tokens",
    },
    {
      description: "Tironian et signs per thousand tokens.",
      id: "tironianPerThousandTokens",
      kind: "number",
      label: "Rate per 1000",
    },
  ],
  calculate: (input) =>
    calculateTironianEtFrequencyCounter({ text: input.text as string }),
});

export const runTironianEtFrequencyCounter =
  tironianEtFrequencyCounterTool.execute;
export default tironianEtFrequencyCounterTool;
