import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IcsRefFormatValidatorInput = {
  readonly reference: string;
};

export type IcsRefFormatValidatorOutput = {
  readonly canonical: string;
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

export const calculateIcsRefFormatValidator = (
  input: IcsRefFormatValidatorInput,
): IcsRefFormatValidatorOutput => {
  const match = /^ICS\s+([IVXLCDM]{1,8})\s*,\s*(\d{1,4})$/i.exec(
    input.reference.trim(),
  );
  if (!match)
    return simpleError(
      "reference",
      'Expected an Inscriptiones Christianae reference like "ICS XIII, 354".',
      "invalid_reference",
    );
  const volumeRoman = match[1].toUpperCase();
  const volumeNumber = parseRoman(volumeRoman);
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
      "The ICS entry number must be greater than zero.",
      "invalid_entry_number",
    );
  return {
    canonical: `ICS ${volumeRoman}, ${entryNumber}`,
    volumeRoman,
    volumeNumber,
    entryNumber,
  };
};

export const icsRefFormatValidatorExample = {
  input: { reference: "ICS XIII, 354" },
  output: {
    canonical: "ICS XIII, 354",
    volumeRoman: "XIII",
    volumeNumber: 13,
    entryNumber: 354,
  },
} satisfies ToolExample<
  IcsRefFormatValidatorInput,
  IcsRefFormatValidatorOutput
>;

export const icsRefFormatValidatorTool = createSimpleTool({
  id: "epigraphy/ics-ref-format-validator",
  title: "ICS Ref Number Format Validator (Inscriptiones Christianae)",
  description:
    'Validate and normalize an Inscriptiones Christianae citation of the form "ICS <Roman volume>, <entry number>", returning the canonical form and parsed parts.',
  inputs: [
    {
      description: 'Reference string such as "ICS XIII, 354".',
      id: "reference",
      kind: "string",
      label: "ICS reference",
    },
  ],
  outputs: [
    {
      description: 'Normalized citation in the form "ICS <ROMAN>, <entry>".',
      id: "canonical",
      kind: "string",
      label: "Canonical",
    },
    {
      description: "Uppercase Roman numeral of the volume.",
      id: "volumeRoman",
      kind: "string",
      label: "Volume",
    },
    {
      description: "Volume as an integer.",
      id: "volumeNumber",
      kind: "integer",
      label: "Volume number",
    },
    {
      description: "Entry number within the volume.",
      id: "entryNumber",
      kind: "integer",
      label: "Entry",
    },
  ],
  calculate: (input) =>
    calculateIcsRefFormatValidator(
      input as unknown as IcsRefFormatValidatorInput,
    ),
});

export const runIcsRefFormatValidator = icsRefFormatValidatorTool.execute;
export default icsRefFormatValidatorTool;
