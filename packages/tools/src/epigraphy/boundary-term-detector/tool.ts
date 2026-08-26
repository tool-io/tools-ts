import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoundaryTermDetectorInput = {
  readonly text: string;
};

export type BoundaryTermDetectorOutput = {
  readonly found: boolean;
  readonly matchedTerm: string;
  readonly normalizedTerm: string;
  readonly matchCount: number;
};

export const calculateBoundaryTermDetector = (
  input: BoundaryTermDetectorInput,
): BoundaryTermDetectorOutput => {
  if (!input.text.trim())
    return simpleError(
      "text",
      "The text must be a non-empty string.",
      "empty_text",
    );
  const pattern =
    /\b(finis|fines|finibus|finium|terminus|termini|terminum|termine)\b/gi;
  let firstMatch: RegExpExecArray | null = null;
  let matchCount = 0;
  for (
    let match = pattern.exec(input.text);
    match !== null;
    match = pattern.exec(input.text)
  ) {
    if (firstMatch === null) firstMatch = match;
    matchCount += 1;
  }
  return {
    found: firstMatch !== null,
    matchedTerm: firstMatch === null ? "" : firstMatch[0],
    normalizedTerm: firstMatch === null ? "" : firstMatch[0].toLowerCase(),
    matchCount,
  };
};

export const boundaryTermDetectorExample = {
  input: { text: "FINIS inter duos fluvios positus" },
  output: {
    found: true,
    matchedTerm: "FINIS",
    normalizedTerm: "finis",
    matchCount: 1,
  },
} satisfies ToolExample<BoundaryTermDetectorInput, BoundaryTermDetectorOutput>;

export const boundaryTermDetectorTool = createSimpleTool({
  id: "epigraphy/boundary-term-detector",
  title: "Boundary Stone Terminator Term Detector",
  description:
    "Detect boundary-declaration terms in inscription text by whole-word matching the finis family (finis, fines, finibus, finium) and terminus family (terminus, termini, terminum, termine) case-insensitively.",
  inputs: [
    {
      description: "Inscription or translation text to scan.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "True when any boundary term occurs.",
      id: "found",
      kind: "boolean",
      label: "Found",
    },
    {
      description:
        "First matched term in its original casing, or empty string.",
      id: "matchedTerm",
      kind: "string",
      label: "Matched term",
    },
    {
      description: "Lowercase form of the first match, or empty string.",
      id: "normalizedTerm",
      kind: "string",
      label: "Normalized",
    },
    {
      description: "Total number of boundary-term matches.",
      id: "matchCount",
      kind: "integer",
      label: "Matches",
    },
  ],
  calculate: (input) =>
    calculateBoundaryTermDetector(
      input as unknown as BoundaryTermDetectorInput,
    ),
});

export const runBoundaryTermDetector = boundaryTermDetectorTool.execute;
export default boundaryTermDetectorTool;
