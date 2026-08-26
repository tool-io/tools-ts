import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BissextileViKalDetectorInput = {
  readonly text: string;
};

export type BissextileViKalDetectorOutput = {
  readonly found: boolean;
  readonly occurrenceCount: number;
  readonly doubledForm: boolean;
};

const BISSEXTILE_PATTERN =
  /bissextile|bis\s+sext\w*|\bvi\s+kal\.?\s*m(?:art\.?|artias)/gi;

export const calculateBissextileViKalDetector = (
  input: BissextileViKalDetectorInput,
): BissextileViKalDetectorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const matches = Array.from(input.text.matchAll(BISSEXTILE_PATTERN));
  return {
    found: matches.length > 0,
    occurrenceCount: matches.length,
    doubledForm: matches.some((match) => /bis/i.test(match[0])),
  };
};

export const bissextileViKalDetectorExample = {
  input: { text: "a.d. VI Kal. Mart. quae fuit bis sextum" },
  output: { found: true, occurrenceCount: 2, doubledForm: true },
} satisfies ToolExample<
  BissextileViKalDetectorInput,
  BissextileViKalDetectorOutput
>;

export const bissextileViKalDetectorTool = createSimpleTool({
  id: "epigraphy/bissextile-vi-kal-detector",
  title: "Bissextile Leap Day VI Kal Mart Reference Detector",
  description:
    "Detects references to the Julian leap day through 'VI Kal. Mart.', 'bis sextum' or 'bissextile' phrasing.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Latin text to scan for leap-day references.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a leap-day reference was detected.",
    },
    {
      id: "occurrenceCount",
      kind: "integer",
      label: "Occurrences",
      description: "Number of leap-day reference matches.",
    },
    {
      id: "doubledForm",
      kind: "boolean",
      label: "Doubled form",
      description: "Whether an explicit 'bis' doubling term appears.",
    },
  ],
  calculate: (input) =>
    calculateBissextileViKalDetector(
      input as unknown as BissextileViKalDetectorInput,
    ),
});

export const runBissextileViKalDetector = bissextileViKalDetectorTool.execute;
export default bissextileViKalDetectorTool;
