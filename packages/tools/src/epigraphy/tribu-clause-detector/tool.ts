import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TribuClauseDetectorInput = {
  readonly text: string;
};

export type TribuClauseDetectorOutput = {
  readonly found: boolean;
  readonly tribeName: string;
  readonly clause: string;
};

const TRIBE_BEFORE_CLAUSE = /\b(\p{L}+)\s+tribu\b/iu;
const TRIBE_AFTER_CLAUSE = /\btribu\s+(\p{L}+)\b/iu;

export const calculateTribuClauseDetector = (
  input: TribuClauseDetectorInput,
): TribuClauseDetectorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const before = TRIBE_BEFORE_CLAUSE.exec(input.text);
  if (before) return { found: true, tribeName: before[1], clause: before[0] };
  const after = TRIBE_AFTER_CLAUSE.exec(input.text);
  if (after) return { found: true, tribeName: after[1], clause: after[0] };
  return { found: false, tribeName: "", clause: "" };
};

export const tribuClauseDetectorExample = {
  input: { text: "Ti. Claudio Ti. f. Fabia tribu Nerone" },
  output: { found: true, tribeName: "Fabia", clause: "Fabia tribu" },
} satisfies ToolExample<TribuClauseDetectorInput, TribuClauseDetectorOutput>;

export const tribuClauseDetectorTool = createSimpleTool({
  id: "epigraphy/tribu-clause-detector",
  title: "Tribe Assignment Quartum Tribu Clause Detector",
  description:
    "Detects Roman tribe assignment clauses in either 'Fabia tribu' or 'tribu Galeria' order and reports the tribe name.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Inscription text to scan for a tribe clause.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a tribe clause was detected.",
    },
    {
      id: "tribeName",
      kind: "string",
      label: "Tribe name",
      description: "Capitalized tribe name detected, empty when none found.",
    },
    {
      id: "clause",
      kind: "string",
      label: "Clause",
      description: "The matched clause substring, empty when none found.",
    },
  ],
  calculate: (input) =>
    calculateTribuClauseDetector(input as unknown as TribuClauseDetectorInput),
});

export const runTribuClauseDetector = tribuClauseDetectorTool.execute;
export default tribuClauseDetectorTool;
