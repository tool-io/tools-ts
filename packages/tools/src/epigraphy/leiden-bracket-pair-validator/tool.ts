import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeidenBracketPairValidatorInput = {
  readonly transcription: string;
};

export type LeidenBracketPairValidatorOutput = {
  readonly balanced: boolean;
  readonly openCount: number;
  readonly closeCount: number;
  readonly maxDepth: number;
  readonly firstErrorPosition: number;
};

export const calculateLeidenBracketPairValidator = (
  input: LeidenBracketPairValidatorInput,
): LeidenBracketPairValidatorOutput => {
  if (!input.transcription.trim())
    return simpleError(
      "transcription",
      "Transcription text is required.",
      "invalid_transcription",
    );
  const stack: number[] = [];
  let openCount = 0;
  let closeCount = 0;
  let maxDepth = 0;
  let extraClosePosition = -1;
  for (let i = 0; i < input.transcription.length; i += 1) {
    const ch = input.transcription[i];
    if (ch === "[") {
      openCount += 1;
      stack.push(i);
      maxDepth = Math.max(maxDepth, stack.length);
    } else if (ch === "]") {
      closeCount += 1;
      if (stack.length === 0) {
        if (extraClosePosition === -1) extraClosePosition = i;
      } else stack.pop();
    }
  }
  const firstErrorPosition =
    extraClosePosition !== -1
      ? extraClosePosition
      : stack.length
        ? stack[0]
        : -1;
  return {
    balanced: firstErrorPosition === -1,
    openCount,
    closeCount,
    maxDepth,
    firstErrorPosition,
  };
};

export const leidenBracketPairValidatorExample = {
  input: { transcription: "[DIS MANIBVS] SIT TIBI TERRA LEVIS" },
  output: {
    balanced: true,
    openCount: 1,
    closeCount: 1,
    maxDepth: 1,
    firstErrorPosition: -1,
  },
} satisfies ToolExample<
  LeidenBracketPairValidatorInput,
  LeidenBracketPairValidatorOutput
>;

export const leidenBracketPairValidatorTool = createSimpleTool({
  id: "epigraphy/leiden-bracket-pair-validator",
  title: "Leiden System Bracket Pair Validator ([ ])",
  description:
    "Validate square-bracket pairing and nesting in a Leiden-system transcription, counting bracket pairs, maximum nesting depth, and reporting the zero-based character position of the first unmatched bracket (-1 when balanced).",
  inputs: [
    {
      description: "Leiden transcription containing square brackets.",
      id: "transcription",
      kind: "string",
      label: "Transcription",
    },
  ],
  outputs: [
    {
      description: "True when every bracket is matched and nested.",
      id: "balanced",
      kind: "boolean",
      label: "Balanced",
    },
    {
      description: "Number of opening brackets.",
      id: "openCount",
      kind: "integer",
      label: "Open brackets",
    },
    {
      description: "Number of closing brackets.",
      id: "closeCount",
      kind: "integer",
      label: "Close brackets",
    },
    {
      description: "Deepest bracket nesting level reached.",
      id: "maxDepth",
      kind: "integer",
      label: "Max depth",
    },
    {
      description:
        "Zero-based position of the first unmatched bracket, -1 if balanced.",
      id: "firstErrorPosition",
      kind: "integer",
      label: "First error",
    },
  ],
  calculate: (input) =>
    calculateLeidenBracketPairValidator(
      input as unknown as LeidenBracketPairValidatorInput,
    ),
});

export const runLeidenBracketPairValidator =
  leidenBracketPairValidatorTool.execute;
export default leidenBracketPairValidatorTool;
