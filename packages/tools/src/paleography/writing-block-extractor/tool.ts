import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WritingBlockExtractorInput = {
  readonly pageWidthMm: number;
  readonly pageHeightMm: number;
  readonly topMarginMm: number;
  readonly bottomMarginMm: number;
  readonly innerMarginMm: number;
  readonly outerMarginMm: number;
};

export type WritingBlockExtractorOutput = {
  readonly writingBlockWidthMm: number;
  readonly writingBlockHeightMm: number;
  readonly writingBlockAreaSquareMillimetres: number;
};

export const calculateWritingBlockExtractor = (
  input: WritingBlockExtractorInput,
): WritingBlockExtractorOutput => {
  for (const key of [
    "pageWidthMm",
    "pageHeightMm",
    "topMarginMm",
    "bottomMarginMm",
    "innerMarginMm",
    "outerMarginMm",
  ] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Page and margin measurements must be greater than zero.",
        "invalid_measurement",
      );
  }
  const writingBlockWidthMm =
    input.pageWidthMm - input.innerMarginMm - input.outerMarginMm;
  const writingBlockHeightMm =
    input.pageHeightMm - input.topMarginMm - input.bottomMarginMm;
  if (writingBlockWidthMm <= 0 || writingBlockHeightMm <= 0)
    return simpleError(
      "innerMarginMm",
      "Combined margins exceed the page dimensions.",
      "invalid_margins",
    );
  const writingBlockAreaSquareMillimetres =
    writingBlockWidthMm * writingBlockHeightMm;
  if (!Number.isFinite(writingBlockAreaSquareMillimetres))
    return simpleError(
      "pageWidthMm",
      "The writing-block area exceeds the numeric range.",
      "numeric_overflow",
    );
  return {
    writingBlockWidthMm,
    writingBlockHeightMm,
    writingBlockAreaSquareMillimetres,
  };
};

export const writingBlockExtractorExample = {
  input: {
    pageWidthMm: 200,
    pageHeightMm: 300,
    topMarginMm: 25,
    bottomMarginMm: 30,
    innerMarginMm: 20,
    outerMarginMm: 40,
  },
  output: {
    writingBlockWidthMm: 140,
    writingBlockHeightMm: 245,
    writingBlockAreaSquareMillimetres: 34300,
  },
} satisfies ToolExample<
  WritingBlockExtractorInput,
  WritingBlockExtractorOutput
>;

export const writingBlockExtractorTool = createSimpleTool({
  id: "paleography/writing-block-extractor",
  title: "Writing Block Extractor",
  description:
    "Subtract measured margins from the page dimensions to extract the exact ruled or written block size and its area in square millimetres.",
  inputs: [
    {
      description: "Full page width in millimetres.",
      id: "pageWidthMm",
      kind: "number",
      label: "Page width",
      minimum: 0,
    },
    {
      description: "Full page height in millimetres.",
      id: "pageHeightMm",
      kind: "number",
      label: "Page height",
      minimum: 0,
    },
    {
      description: "Top margin in millimetres.",
      id: "topMarginMm",
      kind: "number",
      label: "Top margin",
      minimum: 0,
    },
    {
      description: "Bottom margin in millimetres.",
      id: "bottomMarginMm",
      kind: "number",
      label: "Bottom margin",
      minimum: 0,
    },
    {
      description: "Inner (gutter-side) margin in millimetres.",
      id: "innerMarginMm",
      kind: "number",
      label: "Inner margin",
      minimum: 0,
    },
    {
      description: "Outer margin in millimetres.",
      id: "outerMarginMm",
      kind: "number",
      label: "Outer margin",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Width of the text block in millimetres.",
      id: "writingBlockWidthMm",
      kind: "number",
      label: "Block width",
    },
    {
      description: "Height of the text block in millimetres.",
      id: "writingBlockHeightMm",
      kind: "number",
      label: "Block height",
    },
    {
      description: "Text-block area in square millimetres.",
      id: "writingBlockAreaSquareMillimetres",
      kind: "number",
      label: "Block area",
    },
  ],
  calculate: (input) =>
    calculateWritingBlockExtractor({
      pageWidthMm: input.pageWidthMm as number,
      pageHeightMm: input.pageHeightMm as number,
      topMarginMm: input.topMarginMm as number,
      bottomMarginMm: input.bottomMarginMm as number,
      innerMarginMm: input.innerMarginMm as number,
      outerMarginMm: input.outerMarginMm as number,
    }),
});

export const runWritingBlockExtractor = writingBlockExtractorTool.execute;
export default writingBlockExtractorTool;
