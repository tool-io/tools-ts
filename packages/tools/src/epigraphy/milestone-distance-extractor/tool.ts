import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MilestoneDistanceExtractorInput = {
  readonly distanceText: string;
};

export type MilestoneDistanceExtractorOutput = {
  readonly numeral: string;
  readonly miles: number;
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

export const calculateMilestoneDistanceExtractor = (
  input: MilestoneDistanceExtractorInput,
): MilestoneDistanceExtractorOutput => {
  const match = /^\s*M\s*\.?\s*P\s*\.?\s+([IVXLCDM]+)\s*$/i.exec(
    input.distanceText,
  );
  if (!match)
    return simpleError(
      "distanceText",
      'Expected a Roman-milestone reading like "M P XII".',
      "invalid_reading",
    );
  const numeral = match[1].toUpperCase();
  const miles = parseRoman(numeral);
  if (miles === null)
    return simpleError(
      "distanceText",
      `The distance "${match[1]}" is not a well-formed subtractive Roman numeral.`,
      "invalid_roman_numeral",
    );
  return { numeral, miles };
};

export const milestoneDistanceExtractorExample = {
  input: { distanceText: "M P XII" },
  output: { numeral: "XII", miles: 12 },
} satisfies ToolExample<
  MilestoneDistanceExtractorInput,
  MilestoneDistanceExtractorOutput
>;

export const milestoneDistanceExtractorTool = createSimpleTool({
  id: "epigraphy/milestone-distance-extractor",
  title: "Milestone Distance Number MP Extractor",
  description:
    "Extract the Roman-numeral distance from a Roman-milestone 'MP' reading such as \"M P XII\", accepting spaced or dotted markers case-insensitively and validating the numeral against strict subtractive grammar.",
  inputs: [
    {
      description: 'Milestone reading such as "M P XII".',
      id: "distanceText",
      kind: "string",
      label: "Distance text",
    },
  ],
  outputs: [
    {
      description: "Uppercase Roman numeral of the distance.",
      id: "numeral",
      kind: "string",
      label: "Numeral",
    },
    {
      description: "Distance in miles as an integer.",
      id: "miles",
      kind: "integer",
      label: "Miles",
    },
  ],
  calculate: (input) =>
    calculateMilestoneDistanceExtractor(
      input as unknown as MilestoneDistanceExtractorInput,
    ),
});

export const runMilestoneDistanceExtractor =
  milestoneDistanceExtractorTool.execute;
export default milestoneDistanceExtractorTool;
