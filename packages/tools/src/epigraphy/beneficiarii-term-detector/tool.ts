import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeneficiariiTermDetectorInput = {
  readonly text: string;
};

export type BeneficiariiTermDetectorOutput = {
  readonly found: boolean;
  readonly occurrenceCount: number;
  readonly firstForm: string;
};

const BENEFICIARII_PATTERN = /\bbeneficiari[a-z]*\b/gi;

export const calculateBeneficiariiTermDetector = (
  input: BeneficiariiTermDetectorInput,
): BeneficiariiTermDetectorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const matches = Array.from(input.text.matchAll(BENEFICIARII_PATTERN));
  return {
    found: matches.length > 0,
    occurrenceCount: matches.length,
    firstForm: matches.length > 0 ? matches[0][0] : "",
  };
};

export const beneficiariiTermDetectorExample = {
  input: { text: "beneficiarius consularis legionis" },
  output: { found: true, occurrenceCount: 1, firstForm: "beneficiarius" },
} satisfies ToolExample<
  BeneficiariiTermDetectorInput,
  BeneficiariiTermDetectorOutput
>;

export const beneficiariiTermDetectorTool = createSimpleTool({
  id: "epigraphy/beneficiarii-term-detector",
  title: "Unit Veteran Dedication Beneficiarii Term Detector",
  description:
    "Detects and counts beneficiarii rank terms marking soldiers seconded to staff duties.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Dedication or career inscription text.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a beneficiarii term was detected.",
    },
    {
      id: "occurrenceCount",
      kind: "integer",
      label: "Occurrences",
      description: "Number of beneficiarii term occurrences.",
    },
    {
      id: "firstForm",
      kind: "string",
      label: "First form",
      description: "First matched term as written, empty when none.",
    },
  ],
  calculate: (input) =>
    calculateBeneficiariiTermDetector(
      input as unknown as BeneficiariiTermDetectorInput,
    ),
});

export const runBeneficiariiTermDetector = beneficiariiTermDetectorTool.execute;
export default beneficiariiTermDetectorTool;
