import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RibReferenceParserInput = {
  readonly reference: string;
};

export type RibReferenceParserOutput = {
  readonly volumeRoman: string;
  readonly volumeNumber: number;
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

const parseRoman = (text: string): number | null => {
  if (!ROMAN_PATTERN.test(text)) return null;
  let total = 0;
  for (let index = 0; index < text.length; index += 1) {
    const current = ROMAN_VALUES[text[index]!]!;
    const next = index + 1 < text.length ? ROMAN_VALUES[text[index + 1]!]! : 0;
    total += next > current ? -current : current;
  }
  return total;
};

export const calculateRibReferenceParser = (
  input: RibReferenceParserInput,
): RibReferenceParserOutput => {
  const match = /^RIB\s+(?:([IVXLCDM]{1,8})\s+)?(\d{1,5})$/i.exec(
    input.reference.trim(),
  );
  if (!match)
    return simpleError(
      "reference",
      'Expected a Roman Inscription of Britain reference like "RIB II 2456" or "RIB 1136".',
      "invalid_reference",
    );
  const volumeRoman = match[1] === undefined ? "" : match[1].toUpperCase();
  const volumeNumber = volumeRoman === "" ? 0 : parseRoman(volumeRoman);
  if (volumeNumber === null)
    return simpleError(
      "reference",
      `The volume numeral "${match[1]}" is not a well-formed Roman numeral.`,
      "invalid_roman_numeral",
    );
  const entryNumber = Number.parseInt(match[2], 10);
  if (entryNumber < 1)
    return simpleError(
      "reference",
      "The RIB entry number must be greater than zero.",
      "invalid_entry_number",
    );
  return {
    volumeRoman,
    volumeNumber,
    entryNumber,
  };
};

export const ribReferenceParserExample = {
  input: { reference: "RIB 1136" },
  output: { volumeRoman: "", volumeNumber: 0, entryNumber: 1136 },
} satisfies ToolExample<RibReferenceParserInput, RibReferenceParserOutput>;

export const ribReferenceParserTool = createSimpleTool({
  id: "epigraphy/rib-reference-parser",
  title: "RIB Roman Inscription Britain Reference Parser",
  description:
    'Parse a Roman Inscription of Britain reference of the form "RIB <optional Roman volume> <entry>" and report the volume numeral (empty string and 0 when the default volume is implied) plus the entry number.',
  inputs: [
    {
      description: 'Reference string such as "RIB 1136".',
      id: "reference",
      kind: "string",
      label: "RIB reference",
    },
  ],
  outputs: [
    {
      description:
        "Uppercase Roman numeral of the volume, or empty string when unspecified.",
      id: "volumeRoman",
      kind: "string",
      label: "Volume",
    },
    {
      description: "Volume as an integer, or 0 when unspecified.",
      id: "volumeNumber",
      kind: "integer",
      label: "Volume number",
    },
    {
      description: "Entry number.",
      id: "entryNumber",
      kind: "integer",
      label: "Entry",
    },
  ],
  calculate: (input) =>
    calculateRibReferenceParser(input as unknown as RibReferenceParserInput),
});

export const runRibReferenceParser = ribReferenceParserTool.execute;
export default ribReferenceParserTool;
