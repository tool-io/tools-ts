import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExlibrisInscriptionExtractorInput = {
  readonly inscription: string;
};

export type ExlibrisInscriptionExtractorOutput = {
  readonly containsExlibrisPhrase: boolean;
  readonly ownerText: string;
  readonly yearFound: boolean;
  readonly detectedYear: number;
};

const PHRASES = [
  "ex libris",
  "ex-libris",
  "exlibris",
  "from the library of",
  "from the books of",
] as const;

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const phraseIndex = (text: string, phrase: string): number =>
  new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(phrase)}(?![\\p{L}\\p{N}])`,
    "iu",
  ).exec(text)?.index ?? -1;

export const calculateExlibrisInscriptionExtractor = (
  input: ExlibrisInscriptionExtractorInput,
): ExlibrisInscriptionExtractorOutput => {
  if (input.inscription.trim().length === 0)
    return simpleError(
      "inscription",
      "Provide the ownership inscription text.",
      "invalid_text",
    );
  let phraseStart = -1;
  let phraseEnd = -1;
  for (const phrase of PHRASES) {
    const at = phraseIndex(input.inscription, phrase);
    if (at !== -1 && (phraseStart === -1 || at < phraseStart)) {
      phraseStart = at;
      phraseEnd = at + phrase.length;
    }
  }
  const rawOwner =
    phraseStart === -1
      ? ""
      : input.inscription
          .slice(phraseEnd)
          .trim()
          .replace(/^[.,;:!?\s]+/, "")
          .replace(/[.,;:!?\s]+$/, "");
  let candidateYear = 0;
  for (const match of input.inscription.matchAll(/(?<!\d)(\d{3,4})(?!\d)/gu)) {
    const year = Number(match[1]);
    if (year >= 400 && year <= 2100) {
      candidateYear = year;
      break;
    }
  }
  const yearValid = candidateYear !== 0;
  return {
    containsExlibrisPhrase: phraseStart !== -1,
    ownerText: rawOwner,
    yearFound: yearValid,
    detectedYear: yearValid ? candidateYear : 0,
  };
};

export const exlibrisInscriptionExtractorExample = {
  input: { inscription: "Ex libris collegii Mertonensis anno 1520" },
  output: {
    containsExlibrisPhrase: true,
    ownerText: "collegii Mertonensis anno 1520",
    yearFound: true,
    detectedYear: 1520,
  },
} satisfies ToolExample<
  ExlibrisInscriptionExtractorInput,
  ExlibrisInscriptionExtractorOutput
>;

export const exlibrisInscriptionExtractorTool = createSimpleTool({
  id: "paleography/exlibris-inscription-extractor",
  title: "Ex-libris Inscription Extractor",
  description:
    "Extract structured fields from a bookplate or ownership inscription under the stated rules: recognise case-insensitive phrases 'ex libris', 'ex-libris', 'exlibris', 'from the library of' and 'from the books of', take everything after the earliest phrase as owner text with edge punctuation trimmed, and report the first 400-2100 integer found as the year (0 when none).",
  inputs: [
    {
      description: "Transcribed ownership inscription.",
      id: "inscription",
      kind: "string",
      label: "Inscription",
    },
  ],
  outputs: [
    {
      description: "True when a known bookplate phrase occurs.",
      id: "containsExlibrisPhrase",
      kind: "boolean",
      label: "Ex-libris phrase",
    },
    {
      description:
        "Owner text following the phrase, edges trimmed (empty when no phrase).",
      id: "ownerText",
      kind: "string",
      label: "Owner text",
    },
    {
      description: "True when a plausible year was found.",
      id: "yearFound",
      kind: "boolean",
      label: "Year found",
    },
    {
      description: "First detected year between 400 and 2100, otherwise 0.",
      id: "detectedYear",
      kind: "integer",
      label: "Detected year",
    },
  ],
  calculate: (input) =>
    calculateExlibrisInscriptionExtractor({
      inscription: input.inscription as string,
    }),
});

export const runExlibrisInscriptionExtractor =
  exlibrisInscriptionExtractorTool.execute;
export default exlibrisInscriptionExtractorTool;
