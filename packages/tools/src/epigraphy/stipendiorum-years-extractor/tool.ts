import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StipendiorumYearsExtractorInput = {
  readonly text: string;
};

export type StipendiorumYearsExtractorOutput = {
  readonly found: boolean;
  readonly years: number;
  readonly token: string;
};

const STIPENDIA_PATTERN =
  /stip(?:endiorum|endiis|endia|endum)?\.?\s*[·]?\s*([ivxlcdm]+|\d+)\b/i;
const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};

export const calculateStipendiorumYearsExtractor = (
  input: StipendiorumYearsExtractorInput,
): StipendiorumYearsExtractorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const match = STIPENDIA_PATTERN.exec(input.text);
  if (!match) return { found: false, years: 0, token: "" };
  const numeral = match[1];
  if (/^\d+$/.test(numeral))
    return {
      found: true,
      years: Number.parseInt(numeral, 10),
      token: match[0],
    };
  const roman = numeral.toLowerCase();
  let total = 0;
  for (let index = 0; index < roman.length; index += 1) {
    const current = ROMAN_VALUES[roman[index]];
    if (current === undefined)
      return simpleError(
        "text",
        `Invalid Roman numeral service count: ${numeral}.`,
        "invalid_roman_numeral",
      );
    const next =
      index + 1 < roman.length ? ROMAN_VALUES[roman[index + 1]] : undefined;
    total += next !== undefined && next > current ? -current : current;
  }
  return { found: true, years: total, token: match[0] };
};

export const stipendiorumYearsExtractorExample = {
  input: { text: "honestam missionem meruit stipendiorum XXVI" },
  output: { found: true, years: 26, token: "stipendiorum XXVI" },
} satisfies ToolExample<
  StipendiorumYearsExtractorInput,
  StipendiorumYearsExtractorOutput
>;

export const stipendiorumYearsExtractorTool = createSimpleTool({
  id: "epigraphy/stipendiorum-years-extractor",
  title: "Stipendiorum Years-of-Service Number Extractor",
  description:
    "Extracts years of military service counts following 'stip(endiorum)' tokens in Roman numerals or digits.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Military diploma or epitaph text.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a stipendiorum count was detected.",
    },
    {
      id: "years",
      kind: "integer",
      label: "Years",
      description: "Parsed service years, zero when not found.",
    },
    {
      id: "token",
      kind: "string",
      label: "Token",
      description: "Matched substring, empty when not found.",
    },
  ],
  calculate: (input) =>
    calculateStipendiorumYearsExtractor(
      input as unknown as StipendiorumYearsExtractorInput,
    ),
});

export const runStipendiorumYearsExtractor =
  stipendiorumYearsExtractorTool.execute;
export default stipendiorumYearsExtractorTool;
