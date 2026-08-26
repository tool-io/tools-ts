import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AeReferenceParserInput = {
  readonly reference: string;
};

export type AeReferenceParserOutput = {
  readonly year: number;
  readonly itemNumber: number;
  readonly prefixedPlus: boolean;
  readonly letterSuffix: string;
};

export const calculateAeReferenceParser = (
  input: AeReferenceParserInput,
): AeReferenceParserOutput => {
  const match = /^AE\s+(\d{4})\s*,\s*(\+?)(\d{1,5})([a-z]?)$/i.exec(
    input.reference.trim(),
  );
  if (!match)
    return simpleError(
      "reference",
      'Expected an Année Épigraphique reference like "AE 1996, +00045".',
      "invalid_reference",
    );
  const year = Number.parseInt(match[1], 10);
  if (!(year >= 1888 && year <= 2100))
    return simpleError(
      "reference",
      "The AE volume year must fall between 1888 and 2100.",
      "invalid_year",
    );
  const itemNumber = Number.parseInt(match[3], 10);
  if (itemNumber < 1)
    return simpleError(
      "reference",
      "The AE item number must be greater than zero.",
      "invalid_item_number",
    );
  return {
    year,
    itemNumber,
    prefixedPlus: match[2] === "+",
    letterSuffix: match[4].toLowerCase(),
  };
};

export const aeReferenceParserExample = {
  input: { reference: "AE 1996, +00045" },
  output: { year: 1996, itemNumber: 45, prefixedPlus: true, letterSuffix: "" },
} satisfies ToolExample<AeReferenceParserInput, AeReferenceParserOutput>;

export const aeReferenceParserTool = createSimpleTool({
  id: "epigraphy/ae-reference-parser",
  title: "AE Annual Epigraphique Reference Year-Number Parser",
  description:
    'Parse an Année Épigraphique reference of the form "AE <year>, <+?><item><letter?>" and report the four-digit year, item number, plus-prefix flag, and lowercase letter suffix.',
  inputs: [
    {
      description: 'Reference string such as "AE 1996, +00045".',
      id: "reference",
      kind: "string",
      label: "AE reference",
    },
  ],
  outputs: [
    {
      description: "Four-digit publication year of the AE volume.",
      id: "year",
      kind: "integer",
      label: "Year",
    },
    {
      description: "Item number within the year (leading zeros ignored).",
      id: "itemNumber",
      kind: "integer",
      label: "Item",
    },
    {
      description: "True when the item number carries a plus addendum prefix.",
      id: "prefixedPlus",
      kind: "boolean",
      label: "Plus prefix",
    },
    {
      description: "Lowercase letter suffix after the number, or empty string.",
      id: "letterSuffix",
      kind: "string",
      label: "Letter suffix",
    },
  ],
  calculate: (input) =>
    calculateAeReferenceParser(input as unknown as AeReferenceParserInput),
});

export const runAeReferenceParser = aeReferenceParserTool.execute;
export default aeReferenceParserTool;
