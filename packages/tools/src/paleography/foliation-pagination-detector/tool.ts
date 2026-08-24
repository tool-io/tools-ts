import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FoliationPaginationDetectorInput = {
  readonly observedHighest: number;
  readonly scheme?: "foliation" | "pagination";
};

export type FoliationPaginationDetectorOutput = {
  readonly actualLeafCount: number;
  readonly actualPageCount: number;
  readonly numbersWrittenPerLeaf: number;
};

export const calculateFoliationPaginationDetector = (
  input: FoliationPaginationDetectorInput,
): FoliationPaginationDetectorOutput => {
  if (!(
    Number.isSafeInteger(input.observedHighest) && input.observedHighest >= 1
  ))
    return simpleError(
      "observedHighest",
      "The highest observed number must be a positive integer.",
      "invalid_numbering",
    );
  const scheme = input.scheme ?? "foliation";
  const actualLeafCount =
    scheme === "foliation"
      ? input.observedHighest
      : Math.ceil(input.observedHighest / 2);
  if (!Number.isSafeInteger(actualLeafCount * 2))
    return simpleError(
      "observedHighest",
      "The implied page count must be a safe integer.",
      "invalid_numbering",
    );
  return {
    actualLeafCount,
    actualPageCount: actualLeafCount * 2,
    numbersWrittenPerLeaf: scheme === "foliation" ? 1 : 2,
  };
};

export const foliationPaginationDetectorExample = {
  input: { observedHighest: 142, scheme: "foliation" },
  output: {
    actualLeafCount: 142,
    actualPageCount: 284,
    numbersWrittenPerLeaf: 1,
  },
} satisfies ToolExample<
  FoliationPaginationDetectorInput,
  FoliationPaginationDetectorOutput
>;

export const foliationPaginationDetectorTool = createSimpleTool({
  id: "paleography/foliation-pagination-detector",
  title: "Foliation vs Pagination Detector",
  description:
    "Convert the highest written number of a codex into implied leaf and page totals under the declared numbering scheme: foliation counts each leaf once, while pagination maps page n to ceiling(n / 2) leaves so an odd final numbered page remains valid.",
  inputs: [
    {
      description: "Highest number actually written in the codex.",
      id: "observedHighest",
      kind: "integer",
      label: "Observed highest",
      minimum: 1,
    },
    {
      default: "foliation",
      description: "Numbering scheme used in the manuscript.",
      enum: ["foliation", "pagination"],
      id: "scheme",
      kind: "string",
      label: "Scheme",
    },
  ],
  outputs: [
    {
      description: "Physical leaf count implied by the numbering.",
      id: "actualLeafCount",
      kind: "integer",
      label: "Leaves",
    },
    {
      description: "Page count implied by the numbering.",
      id: "actualPageCount",
      kind: "integer",
      label: "Pages",
    },
    {
      description:
        "Maximum numbering positions per physical leaf under the scheme.",
      id: "numbersWrittenPerLeaf",
      kind: "integer",
      label: "Numbers per leaf",
    },
  ],
  calculate: (input) =>
    calculateFoliationPaginationDetector({
      observedHighest: input.observedHighest as number,
      scheme: input.scheme as FoliationPaginationDetectorInput["scheme"],
    }),
});

export const runFoliationPaginationDetector =
  foliationPaginationDetectorTool.execute;
export default foliationPaginationDetectorTool;
