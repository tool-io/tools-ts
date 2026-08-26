import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CilCitationParserInput = {
  readonly citation: string;
};

export type CilCitationParserOutput = {
  readonly volumeNumber: number;
  readonly volumeRoman: string;
  readonly entryNumber: number;
};

const ROMAN_PATTERN =
  /^(?=.)M*(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};
const ROMAN_TABLE: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export const parseRomanNumeral = (text: string): number | null => {
  if (!ROMAN_PATTERN.test(text)) return null;
  let total = 0;
  for (let index = 0; index < text.length; index += 1) {
    const current = ROMAN_VALUES[text[index]!]!;
    const next = index + 1 < text.length ? ROMAN_VALUES[text[index + 1]!]! : 0;
    total += next > current ? -current : current;
  }
  return total;
};

export const formatRomanNumeral = (value: number): string => {
  let remaining = value;
  let out = "";
  for (const [unit, glyph] of ROMAN_TABLE)
    while (remaining >= unit) {
      out += glyph;
      remaining -= unit;
    }
  return out;
};

export const calculateCilCitationParser = (
  input: CilCitationParserInput,
): CilCitationParserOutput => {
  const match = /^CIL\s+([IVXLCDM]{1,8}|\d{1,2})\s*,\s*(\d{1,6})$/i.exec(
    input.citation.trim(),
  );
  if (!match)
    return simpleError(
      "citation",
      'Expected a Corpus Inscriptionum Latinarum citation like "CIL VI, 1527".',
      "invalid_citation",
    );
  const entryNumber = Number.parseInt(match[2], 10);
  if (entryNumber < 1)
    return simpleError(
      "citation",
      "The CIL entry number must be greater than zero.",
      "invalid_entry_number",
    );
  if (/^\d+$/.test(match[1])) {
    const volumeNumber = Number.parseInt(match[1], 10);
    if (volumeNumber < 1)
      return simpleError(
        "citation",
        "The CIL volume number must be greater than zero.",
        "invalid_volume_number",
      );
    return {
      volumeNumber,
      volumeRoman: formatRomanNumeral(volumeNumber),
      entryNumber,
    };
  }
  const volumeRoman = match[1].toUpperCase();
  const parsed = parseRomanNumeral(volumeRoman);
  if (parsed === null)
    return simpleError(
      "citation",
      `The volume numeral "${match[1]}" is not a well-formed Roman numeral.`,
      "invalid_roman_numeral",
    );
  return { volumeNumber: parsed, volumeRoman, entryNumber };
};

export const cilCitationParserExample = {
  input: { citation: "CIL VI, 1527" },
  output: { volumeNumber: 6, volumeRoman: "VI", entryNumber: 1527 },
} satisfies ToolExample<CilCitationParserInput, CilCitationParserOutput>;

export const cilCitationParserTool = createSimpleTool({
  id: "epigraphy/cil-citation-parser",
  title: "CIL Volume-Citation Number Parser",
  description:
    'Parse a Corpus Inscriptionum Latinarum citation of the form "CIL <volume>, <number>" with the volume given in Roman or Arabic numerals and report both forms.',
  inputs: [
    {
      description: 'Reference string such as "CIL VI, 1527".',
      id: "citation",
      kind: "string",
      label: "CIL citation",
    },
  ],
  outputs: [
    {
      description: "Volume as an integer.",
      id: "volumeNumber",
      kind: "integer",
      label: "Volume number",
    },
    {
      description: "Uppercase Roman numeral of the volume.",
      id: "volumeRoman",
      kind: "string",
      label: "Volume",
    },
    {
      description: "Inscription number within the volume.",
      id: "entryNumber",
      kind: "integer",
      label: "Entry",
    },
  ],
  calculate: (input) =>
    calculateCilCitationParser(input as unknown as CilCitationParserInput),
});

export const runCilCitationParser = cilCitationParserTool.execute;
export default cilCitationParserTool;
