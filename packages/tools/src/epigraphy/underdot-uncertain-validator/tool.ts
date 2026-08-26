import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnderdotUncertainValidatorInput = {
  readonly text: string;
};

export type UnderdotUncertainValidatorOutput = {
  readonly uncertainLetterCount: number;
  readonly malformedMarks: number;
  readonly isValid: boolean;
};

const COMBINING_RANGE = /[\u0300-\u036F]/;

export const calculateUnderdotUncertainValidator = (
  input: UnderdotUncertainValidatorInput,
): UnderdotUncertainValidatorOutput => {
  if (!input.text.trim())
    return simpleError(
      "text",
      "Transcription text is required.",
      "invalid_text",
    );
  const chars = Array.from(input.text);
  let uncertainLetterCount = 0;
  let malformedMarks = 0;
  for (let i = 0; i < chars.length; i += 1) {
    if (chars[i] !== "\u0323") continue;
    const previous = i > 0 ? chars[i - 1] : "";
    if (previous && /\p{L}/u.test(previous) && !COMBINING_RANGE.test(previous))
      uncertainLetterCount += 1;
    else malformedMarks += 1;
  }
  return {
    uncertainLetterCount,
    malformedMarks,
    isValid: malformedMarks === 0,
  };
};

export const underdotUncertainValidatorExample = {
  input: { text: "manibu\u0323s" },
  output: { uncertainLetterCount: 1, malformedMarks: 0, isValid: true },
} satisfies ToolExample<
  UnderdotUncertainValidatorInput,
  UnderdotUncertainValidatorOutput
>;

export const underdotUncertainValidatorTool = createSimpleTool({
  id: "epigraphy/underdot-uncertain-validator",
  title: "Underdot Uncertain Letter Marker Validator",
  description:
    "Validate combining-dot-below marks (U+0323) that flag uncertain letters in a transcription, counting properly dotted letters and rejecting orphaned or doubled dots.",
  inputs: [
    {
      description: "Transcription with combining underdots.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Letters correctly marked as uncertain.",
      id: "uncertainLetterCount",
      kind: "integer",
      label: "Uncertain letters",
    },
    {
      description: "Marks not attached to a base letter.",
      id: "malformedMarks",
      kind: "integer",
      label: "Malformed marks",
    },
    {
      description: "True when every underdot is well formed.",
      id: "isValid",
      kind: "boolean",
      label: "Valid",
    },
  ],
  calculate: (input) =>
    calculateUnderdotUncertainValidator(
      input as unknown as UnderdotUncertainValidatorInput,
    ),
});

export const runUnderdotUncertainValidator =
  underdotUncertainValidatorTool.execute;
export default underdotUncertainValidatorTool;
