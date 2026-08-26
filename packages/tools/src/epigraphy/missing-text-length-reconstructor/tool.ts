import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MissingTextLengthReconstructorInput = {
  readonly lineCount: number;
  readonly averageCharactersPerLine: number;
};

export type MissingTextLengthReconstructorOutput = {
  readonly reconstructedTextLength: number;
};

export const calculateMissingTextLengthReconstructor = (
  input: MissingTextLengthReconstructorInput,
): MissingTextLengthReconstructorOutput => {
  if (!(Number.isInteger(input.lineCount) && input.lineCount >= 0))
    return simpleError(
      "lineCount",
      "Line count must be a non-negative integer.",
      "invalid_count",
    );
  if (!(input.averageCharactersPerLine >= 0))
    return simpleError(
      "averageCharactersPerLine",
      "The average characters per line must be non-negative.",
      "invalid_count",
    );
  return {
    reconstructedTextLength: input.lineCount * input.averageCharactersPerLine,
  };
};

export const missingTextLengthReconstructorExample = {
  input: { lineCount: 14, averageCharactersPerLine: 32 },
  output: { reconstructedTextLength: 448 },
} satisfies ToolExample<
  MissingTextLengthReconstructorInput,
  MissingTextLengthReconstructorOutput
>;

export const missingTextLengthReconstructorTool = createSimpleTool({
  id: "epigraphy/missing-text-length-reconstructor",
  title: "Missing Text Length Reconstruction from Line Average Calculator",
  description:
    "Reconstruct the total character length of a lost or damaged inscription text from its surviving line count and the average characters per line.",
  inputs: [
    {
      description: "Number of inscribed lines.",
      id: "lineCount",
      kind: "integer",
      label: "Lines",
      minimum: 0,
    },
    {
      description: "Average characters per line.",
      id: "averageCharactersPerLine",
      kind: "number",
      label: "Line average",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated total character length of the text.",
      id: "reconstructedTextLength",
      kind: "number",
      label: "Text length",
    },
  ],
  calculate: (input) =>
    calculateMissingTextLengthReconstructor(
      input as unknown as MissingTextLengthReconstructorInput,
    ),
});

export const runMissingTextLengthReconstructor =
  missingTextLengthReconstructorTool.execute;
export default missingTextLengthReconstructorTool;
