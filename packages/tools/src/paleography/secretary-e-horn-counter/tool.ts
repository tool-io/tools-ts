import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SecretaryEHornCounterInput = {
  readonly text: string;
};

export type SecretaryEHornCounterOutput = {
  readonly hornedECount: number;
  readonly plainECount: number;
  readonly hornedEShareOfEPct: number;
  readonly hornedEPerThousandCharacters: number;
};

const HORNED_E = "\u0119";

export const calculateSecretaryEHornCounter = (
  input: SecretaryEHornCounterInput,
): SecretaryEHornCounterOutput => {
  if (input.text.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const countChar = (text: string, glyph: string): number =>
    text.split(glyph).length - 1;
  const hornedECount = countChar(input.text, HORNED_E);
  const plainECount = countChar(input.text, "e");
  if (hornedECount + plainECount === 0)
    return simpleError(
      "text",
      "The sample contains no plain or horned e characters.",
      "invalid_text",
    );
  const characterCount = [...input.text].length;
  return {
    hornedECount,
    hornedEPerThousandCharacters: (hornedECount / characterCount) * 1000,
    hornedEShareOfEPct: (hornedECount / (hornedECount + plainECount)) * 100,
    plainECount,
  };
};

export const secretaryEHornCounterExample = {
  input: { text: "the ęnde" },
  output: {
    hornedECount: 1,
    hornedEPerThousandCharacters: 125,
    hornedEShareOfEPct: 33.33333333333333,
    plainECount: 2,
  },
} satisfies ToolExample<
  SecretaryEHornCounterInput,
  SecretaryEHornCounterOutput
>;

export const secretaryEHornCounterTool = createSimpleTool({
  id: "paleography/secretary-e-horn-counter",
  title: "Secretary E-Horn Counter",
  description:
    "Count horned e glyphs (\u0119, the usual transliteration of the secretary-hand e with its entry horn) against plain e in a transcription and report the exact horned share plus its frequency per thousand characters.",
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
      description: "Occurrences of \u0119.",
      id: "hornedECount",
      kind: "integer",
      label: "Horned e",
    },
    {
      description: "Occurrences of plain e.",
      id: "plainECount",
      kind: "integer",
      label: "Plain e",
    },
    {
      description: "Horned e as a percentage of all e glyphs.",
      id: "hornedEShareOfEPct",
      kind: "number",
      label: "% of e",
    },
    {
      description: "Horned e occurrences per thousand characters.",
      id: "hornedEPerThousandCharacters",
      kind: "number",
      label: "Per 1000 chars",
    },
  ],
  calculate: (input) =>
    calculateSecretaryEHornCounter({ text: input.text as string }),
});

export const runSecretaryEHornCounter = secretaryEHornCounterTool.execute;
export default secretaryEHornCounterTool;
