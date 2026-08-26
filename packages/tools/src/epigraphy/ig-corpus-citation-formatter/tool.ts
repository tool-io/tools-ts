import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgCorpusCitationFormatterInput = {
  readonly volumeNumber: number;
  readonly inscriptionNumber: number;
  readonly superscriptEdition?: number;
};

export type IgCorpusCitationFormatterOutput = {
  readonly citation: string;
  readonly volumeRoman: string;
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
const SUPERSCRIPTS = ["", "¹", "²", "³"] as const;

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

export const calculateIgCorpusCitationFormatter = (
  input: IgCorpusCitationFormatterInput,
): IgCorpusCitationFormatterOutput => {
  if (!(
    Number.isInteger(input.volumeNumber) &&
    input.volumeNumber >= 1 &&
    input.volumeNumber <= 99
  ))
    return simpleError(
      "volumeNumber",
      "IG volumes run from 1 to 99.",
      "invalid_volume",
    );
  if (!(
    Number.isInteger(input.inscriptionNumber) && input.inscriptionNumber >= 1
  ))
    return simpleError(
      "inscriptionNumber",
      "The inscription number must be positive.",
      "invalid_number",
    );
  const superscriptEdition = input.superscriptEdition ?? 0;
  if (!(
    Number.isInteger(superscriptEdition) &&
    superscriptEdition >= 0 &&
    superscriptEdition <= 3
  ))
    return simpleError(
      "superscriptEdition",
      "Only second and third editions are distinguished (0-3).",
      "invalid_edition",
    );
  const volumeRoman = formatRomanNumeral(input.volumeNumber);
  return {
    citation: `IG ${volumeRoman}${SUPERSCRIPTS[superscriptEdition]} ${input.inscriptionNumber}`,
    volumeRoman,
  };
};

export const igCorpusCitationFormatterExample = {
  input: { volumeNumber: 2, superscriptEdition: 2, inscriptionNumber: 1234 },
  output: { citation: "IG II² 1234", volumeRoman: "II" },
} satisfies ToolExample<
  IgCorpusCitationFormatterInput,
  IgCorpusCitationFormatterOutput
>;

export const igCorpusCitationFormatterTool = createSimpleTool({
  id: "epigraphy/ig-corpus-citation-formatter",
  title: "IG Inscription Corpus Citation Formatter",
  description:
    'Format an Inscriptiones Graecae citation as "IG <Roman volume><edition superscript> <number>", using a superscript marker only for revised editions (1-3).',
  inputs: [
    {
      description: "IG volume as an integer.",
      id: "volumeNumber",
      kind: "integer",
      label: "Volume",
      maximum: 99,
      minimum: 1,
    },
    {
      description: "Inscription number within the volume.",
      id: "inscriptionNumber",
      kind: "integer",
      label: "Inscription",
      minimum: 1,
    },
    {
      default: 0,
      description: "Edition superscript (0 none, 1-3).",
      id: "superscriptEdition",
      kind: "integer",
      label: "Edition",
      maximum: 3,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Formatted IG citation.",
      id: "citation",
      kind: "string",
      label: "Citation",
    },
    {
      description: "Uppercase Roman numeral of the volume.",
      id: "volumeRoman",
      kind: "string",
      label: "Volume",
    },
  ],
  calculate: (input) =>
    calculateIgCorpusCitationFormatter(
      input as unknown as IgCorpusCitationFormatterInput,
    ),
});

export const runIgCorpusCitationFormatter =
  igCorpusCitationFormatterTool.execute;
export default igCorpusCitationFormatterTool;
