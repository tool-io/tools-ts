import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TranscriptionProgressPercentCalculatorInput = {
  readonly transcribedCharacters: number;
  readonly totalCharacters: number;
};

export type TranscriptionProgressPercentCalculatorOutput = {
  readonly percentComplete: number;
  readonly remainingCharacters: number;
};

export const calculateTranscriptionProgressPercentCalculator = (
  input: TranscriptionProgressPercentCalculatorInput,
): TranscriptionProgressPercentCalculatorOutput => {
  if (!(Number.isInteger(input.totalCharacters) && input.totalCharacters > 0))
    simpleError(
      "totalCharacters",
      "Total characters must be a positive integer.",
    );
  if (!(
    Number.isInteger(input.transcribedCharacters) &&
    input.transcribedCharacters >= 0
  ))
    simpleError(
      "transcribedCharacters",
      "Transcribed characters must be a non-negative integer.",
    );
  if (input.transcribedCharacters > input.totalCharacters)
    return simpleError(
      "transcribedCharacters",
      "Transcribed characters cannot exceed the total character count.",
      "invalid_progress",
    );
  return {
    percentComplete:
      (input.transcribedCharacters / input.totalCharacters) * 100,
    remainingCharacters: input.totalCharacters - input.transcribedCharacters,
  };
};

export const transcriptionProgressPercentCalculatorExample = {
  input: { transcribedCharacters: 1234, totalCharacters: 2468 },
  output: { percentComplete: 50, remainingCharacters: 1234 },
} satisfies ToolExample<
  TranscriptionProgressPercentCalculatorInput,
  TranscriptionProgressPercentCalculatorOutput
>;

export const transcriptionProgressPercentCalculatorTool = createSimpleTool({
  id: "archival-studies/transcription-progress-percent-calculator",
  title: "Transcription Progress Character Count Percent Calculator",
  description:
    "Report transcription progress as the percentage of transcribed characters relative to the total expected character count.",
  inputs: [
    {
      description: "Characters transcribed so far.",
      id: "transcribedCharacters",
      kind: "integer",
      label: "Transcribed",
      minimum: 0,
    },
    {
      description: "Total characters expected in the completed transcript.",
      id: "totalCharacters",
      kind: "integer",
      label: "Total",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Completion percentage from 0 to 100.",
      id: "percentComplete",
      kind: "number",
      label: "Percent complete",
    },
    {
      description: "Characters still to be transcribed.",
      id: "remainingCharacters",
      kind: "integer",
      label: "Remaining",
    },
  ],
  calculate: (input) =>
    calculateTranscriptionProgressPercentCalculator({
      totalCharacters: input.totalCharacters as number,
      transcribedCharacters: input.transcribedCharacters as number,
    }),
});

export const runTranscriptionProgressPercentCalculator =
  transcriptionProgressPercentCalculatorTool.execute;
export default transcriptionProgressPercentCalculatorTool;
