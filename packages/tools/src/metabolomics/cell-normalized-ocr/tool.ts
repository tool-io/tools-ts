import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalOcrPmolPerMinute: number;
  readonly cellCount: number;
  readonly normalizationCells: number;
}>;
export type Output = Readonly<{
  readonly ocrPerNormalizedCells: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.totalOcrPmolPerMinute < 0 ||
    input.cellCount <= 0 ||
    input.normalizationCells <= 0
  )
    simpleError(
      "cellCount",
      "Positive cell count and normalization basis required.",
    );
  return {
    ocrPerNormalizedCells:
      (input.totalOcrPmolPerMinute / input.cellCount) *
      input.normalizationCells,
  };
};
export const exampleInput = {
  totalOcrPmolPerMinute: 200,
  cellCount: 20000,
  normalizationCells: 10000,
} satisfies Input;
export const exampleOutput = { ocrPerNormalizedCells: 100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/cell-normalized-ocr",
  title: "Cell Normalized OCR",
  description: "Normalize oxygen consumption to a caller-selected cell count.",
  inputs: [
    {
      id: "totalOcrPmolPerMinute",
      kind: "number",
      label: "Total ocr pmol per minute",
    },
    { id: "cellCount", kind: "number", label: "Cell count" },
    { id: "normalizationCells", kind: "number", label: "Normalization cells" },
  ],
  outputs: [
    {
      id: "ocrPerNormalizedCells",
      kind: "number",
      label: "Ocr per normalized cells",
    },
  ],
  calculate: (value) =>
    calculate({
      totalOcrPmolPerMinute: value.totalOcrPmolPerMinute as number,
      cellCount: value.cellCount as number,
      normalizationCells: value.normalizationCells as number,
    }),
});
export const run = tool.execute;
export default tool;
