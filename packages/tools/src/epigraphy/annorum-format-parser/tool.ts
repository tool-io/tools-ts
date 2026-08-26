import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnnorumFormatParserInput = {
  readonly text: string;
};

export type AnnorumFormatParserOutput = {
  readonly found: boolean;
  readonly years: number;
  readonly token: string;
  readonly notation: "roman" | "decimal" | "none";
};

const ANNORUM_PATTERN = /annorum\s*[·.]?\s*([ivxlcdm]+|\d+)\b/i;
const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};

export const calculateAnnorumFormatParser = (
  input: AnnorumFormatParserInput,
): AnnorumFormatParserOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const match = ANNORUM_PATTERN.exec(input.text);
  if (!match) return { found: false, years: 0, token: "", notation: "none" };
  const numeral = match[1];
  if (/^\d+$/.test(numeral))
    return {
      found: true,
      years: Number.parseInt(numeral, 10),
      token: match[0],
      notation: "decimal",
    };
  let total = 0;
  const roman = match[1].toLowerCase();
  for (let index = 0; index < roman.length; index += 1) {
    const current = ROMAN_VALUES[roman[index]];
    if (current === undefined)
      return simpleError(
        "text",
        `Invalid Roman numeral after annorum: ${match[1]}.`,
        "invalid_roman_numeral",
      );
    const next =
      index + 1 < roman.length ? ROMAN_VALUES[roman[index + 1]] : undefined;
    total += next !== undefined && next > current ? -current : current;
  }
  return { found: true, years: total, token: match[0], notation: "roman" };
};

export const annorumFormatParserExample = {
  input: { text: "Dis Manibus. P. Caesius Epaphroditus annorum XX" },
  output: { found: true, years: 20, token: "annorum XX", notation: "roman" },
} satisfies ToolExample<AnnorumFormatParserInput, AnnorumFormatParserOutput>;

export const annorumFormatParserTool = createSimpleTool({
  id: "epigraphy/annorum-format-parser",
  title: "Age Notation Dots Annum Format Parser",
  description:
    "Parses 'annorum' age-at-death notations including interpunct-separated forms such as 'annorum·XX', reading Roman or decimal numerals.",
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
      description: "Whether an annorum notation was detected.",
    },
    {
      id: "years",
      kind: "integer",
      label: "Years",
      description: "Parsed age value, zero when not found.",
    },
    {
      id: "token",
      kind: "string",
      label: "Token",
      description: "Matched notation substring, empty when not found.",
    },
    {
      id: "notation",
      kind: "string",
      enum: ["roman", "decimal", "none"],
      label: "Notation",
      description: "Numeral system of the matched age.",
    },
  ],
  calculate: (input) =>
    calculateAnnorumFormatParser(input as unknown as AnnorumFormatParserInput),
});

export const runAnnorumFormatParser = annorumFormatParserTool.execute;
export default annorumFormatParserTool;
