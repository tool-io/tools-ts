import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SearchPatternAreaInput = {
  readonly sideLengthNm: number;
};

export type SearchPatternAreaOutput = {
  readonly patternAreaSqNm: number;
};

export const calculateSearchPatternArea = (
  input: SearchPatternAreaInput,
): SearchPatternAreaOutput | null =>
  Number.isFinite(input.sideLengthNm) && input.sideLengthNm > 0
    ? { patternAreaSqNm: input.sideLengthNm * input.sideLengthNm }
    : null;

export const searchPatternAreaExample = {
  input: { sideLengthNm: 3 },
  output: { patternAreaSqNm: 9 },
} satisfies ToolExample<SearchPatternAreaInput, SearchPatternAreaOutput>;

export const searchPatternAreaTool = createSimpleTool({
  id: "sailing/search-pattern-area",
  title: "Search Pattern Area",
  description:
    "Calculate the area swept by a square search pattern as the square of its side length.",
  inputs: [
    {
      description: "Side length of the square search pattern.",
      id: "sideLengthNm",
      kind: "number",
      label: "Side length",
      unit: "NM",
    },
  ],
  outputs: [
    {
      description: "Area covered by the square pattern.",
      format: "area-sq-nm",
      id: "patternAreaSqNm",
      kind: "number",
      label: "Pattern area",
      unit: "NM\u00B2",
    },
  ],
  calculate: (input) => {
    const patternAreaSqNm = calculateSearchPatternArea(
      input as unknown as SearchPatternAreaInput,
    );
    if (patternAreaSqNm === null)
      simpleError(
        "sideLengthNm",
        "The side length must be finite and greater than zero.",
        "invalid_side",
      );
    return patternAreaSqNm;
  },
});

export const runSearchPatternArea = searchPatternAreaTool.execute;
export default searchPatternAreaTool;
