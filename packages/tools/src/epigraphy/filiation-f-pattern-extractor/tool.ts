import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiliationFPatternExtractorInput = {
  readonly text: string;
};

export type FiliationFPatternExtractorOutput = {
  readonly count: number;
  readonly fatherPraenomen: string;
  readonly marker: string;
};

const FILIATION_PATTERN =
  /([\p{L}]+\.?)\s+(?:f\.|fil\.|filius|filia|filio)(?!\p{L})/giu;

export const calculateFiliationFPatternExtractor = (
  input: FiliationFPatternExtractorInput,
): FiliationFPatternExtractorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const matches = Array.from(input.text.matchAll(FILIATION_PATTERN));
  if (matches.length === 0)
    return { count: 0, fatherPraenomen: "", marker: "" };
  const first = matches[0];
  const marker = first[0].slice(first[1].length).trim();
  return { count: matches.length, fatherPraenomen: first[1], marker };
};

export const filiationFPatternExtractorExample = {
  input: { text: "M. Tullius M. f. Cicero" },
  output: { count: 1, fatherPraenomen: "M.", marker: "f." },
} satisfies ToolExample<
  FiliationFPatternExtractorInput,
  FiliationFPatternExtractorOutput
>;

export const filiationFPatternExtractorTool = createSimpleTool({
  id: "epigraphy/filiation-f-pattern-extractor",
  title: "Filiation F Pattern Parentage Extractor",
  description:
    "Extracts Roman parentage filiations such as 'M. f.' or 'filius' together with the father-name token they follow.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Inscription or onomastic text to scan.",
    },
  ],
  outputs: [
    {
      id: "count",
      kind: "integer",
      label: "Count",
      description: "Number of filiation markers found.",
    },
    {
      id: "fatherPraenomen",
      kind: "string",
      label: "Father praenomen",
      description:
        "Token immediately preceding the first marker, empty when none found.",
    },
    {
      id: "marker",
      kind: "string",
      label: "Marker",
      description: "First filiation marker matched, empty when none found.",
    },
  ],
  calculate: (input) =>
    calculateFiliationFPatternExtractor(
      input as unknown as FiliationFPatternExtractorInput,
    ),
});

export const runFiliationFPatternExtractor =
  filiationFPatternExtractorTool.execute;
export default filiationFPatternExtractorTool;
