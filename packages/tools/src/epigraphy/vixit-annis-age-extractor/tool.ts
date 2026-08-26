import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VixitAnnisAgeExtractorInput = {
  readonly text: string;
};

export type VixitAnnisAgeExtractorOutput = {
  readonly found: boolean;
  readonly years: number;
  readonly phrase: string;
};

const VIXIT_PATTERN =
  /vix(?:it|erunt)\s+ann(?:is|os|orum)\s+([ivxlcdm]+|\d+)\b/i;
const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};

const parseAgeToken = (token: string): number => {
  if (/^\d+$/.test(token)) return Number.parseInt(token, 10);
  const numeral = token.toLowerCase();
  let total = 0;
  for (let index = 0; index < numeral.length; index += 1) {
    const current = ROMAN_VALUES[numeral[index]];
    if (current === undefined)
      return simpleError(
        "text",
        `Invalid Roman numeral in age formula: ${token}.`,
        "invalid_roman_numeral",
      );
    const next =
      index + 1 < numeral.length ? ROMAN_VALUES[numeral[index + 1]] : undefined;
    total += next !== undefined && next > current ? -current : current;
  }
  return total;
};

export const calculateVixitAnnisAgeExtractor = (
  input: VixitAnnisAgeExtractorInput,
): VixitAnnisAgeExtractorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const match = VIXIT_PATTERN.exec(input.text);
  if (!match) return { found: false, years: 0, phrase: "" };
  return { found: true, years: parseAgeToken(match[1]), phrase: match[0] };
};

export const vixitAnnisAgeExtractorExample = {
  input: { text: "Dis Manibus. Iulia Prima vixit annis XXV" },
  output: { found: true, years: 25, phrase: "vixit annis XXV" },
} satisfies ToolExample<
  VixitAnnisAgeExtractorInput,
  VixitAnnisAgeExtractorOutput
>;

export const vixitAnnisAgeExtractorTool = createSimpleTool({
  id: "epigraphy/vixit-annis-age-extractor",
  title: "Age at Death Formula Vixit Annis Extractor",
  description:
    "Extracts the age at death from 'vixit annis' funerary formulas, accepting Roman numerals or digits.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Funerary inscription text.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a vixit annis age formula was detected.",
    },
    {
      id: "years",
      kind: "integer",
      label: "Years",
      description: "Parsed age at death, zero when not found.",
    },
    {
      id: "phrase",
      kind: "string",
      label: "Phrase",
      description: "Matched formula substring, empty when not found.",
    },
  ],
  calculate: (input) =>
    calculateVixitAnnisAgeExtractor(
      input as unknown as VixitAnnisAgeExtractorInput,
    ),
});

export const runVixitAnnisAgeExtractor = vixitAnnisAgeExtractorTool.execute;
export default vixitAnnisAgeExtractorTool;
