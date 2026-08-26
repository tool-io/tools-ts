import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LegionNumberExtractorInput = {
  readonly text: string;
};

export type LegionNumberExtractorOutput = {
  readonly legionNumber: number;
  readonly designation: string;
  readonly totalLegions: number;
};

const LEGION_PATTERN =
  /\bleg(?:io|ionis|ionem|iones|ionibus)?\.?\s+([ivxlcdm]+|\d+)\b/gi;
const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};

const parseNumeralToken = (token: string): number => {
  if (/^\d+$/.test(token)) return Number.parseInt(token, 10);
  const numeral = token.toLowerCase();
  let total = 0;
  for (let index = 0; index < numeral.length; index += 1) {
    const current = ROMAN_VALUES[numeral[index]];
    if (current === undefined)
      return simpleError(
        "text",
        `Invalid Roman numeral legion number: ${token}.`,
        "invalid_roman_numeral",
      );
    const next =
      index + 1 < numeral.length ? ROMAN_VALUES[numeral[index + 1]] : undefined;
    total += next !== undefined && next > current ? -current : current;
  }
  return total;
};

export const calculateLegionNumberExtractor = (
  input: LegionNumberExtractorInput,
): LegionNumberExtractorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const matches = Array.from(input.text.matchAll(LEGION_PATTERN));
  if (matches.length === 0)
    return { legionNumber: 0, designation: "", totalLegions: 0 };
  return {
    legionNumber: parseNumeralToken(matches[0][1]),
    designation: matches[0][0].trim(),
    totalLegions: matches.length,
  };
};

export const legionNumberExtractorExample = {
  input: { text: "LEG XII Fulminata" },
  output: { legionNumber: 12, designation: "LEG XII", totalLegions: 1 },
} satisfies ToolExample<
  LegionNumberExtractorInput,
  LegionNumberExtractorOutput
>;

export const legionNumberExtractorTool = createSimpleTool({
  id: "epigraphy/legion-number-extractor",
  title: "Legion Name Numerical Identifier Extractor",
  description:
    "Extracts legion numbers from LEG designations written with Roman numerals or digits.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Military inscription or diploma text.",
    },
  ],
  outputs: [
    {
      id: "legionNumber",
      kind: "integer",
      label: "Legion number",
      description: "First legion number found, zero when none.",
    },
    {
      id: "designation",
      kind: "string",
      label: "Designation",
      description: "First matched designation substring, empty when none.",
    },
    {
      id: "totalLegions",
      kind: "integer",
      label: "Total legions",
      description: "Count of legion designations in the text.",
    },
  ],
  calculate: (input) =>
    calculateLegionNumberExtractor(
      input as unknown as LegionNumberExtractorInput,
    ),
});

export const runLegionNumberExtractor = legionNumberExtractorTool.execute;
export default legionNumberExtractorTool;
