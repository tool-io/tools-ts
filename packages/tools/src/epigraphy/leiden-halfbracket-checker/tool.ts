import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeidenHalfbracketCheckerInput = {
  readonly transcription: string;
};

export type LeidenHalfbracketCheckerOutput = {
  readonly openTopCount: number;
  readonly closeTopCount: number;
  readonly openBottomCount: number;
  readonly closeBottomCount: number;
  readonly balanced: boolean;
  readonly firstErrorPosition: number;
};

const OPEN_TOP = "\u231C";
const CLOSE_TOP = "\u231D";
const OPEN_BOTTOM = "\u231E";
const CLOSE_BOTTOM = "\u231F";

export const calculateLeidenHalfbracketChecker = (
  input: LeidenHalfbracketCheckerInput,
): LeidenHalfbracketCheckerOutput => {
  if (!input.transcription.trim())
    return simpleError(
      "transcription",
      "Transcription text is required.",
      "invalid_transcription",
    );
  let openTopCount = 0;
  let closeTopCount = 0;
  let openBottomCount = 0;
  let closeBottomCount = 0;
  const stack: Array<{ char: string; index: number }> = [];
  let firstErrorPosition = -1;
  for (let i = 0; i < input.transcription.length; i += 1) {
    const ch = input.transcription[i];
    if (ch === OPEN_TOP) {
      openTopCount += 1;
      stack.push({ char: OPEN_TOP, index: i });
    } else if (ch === OPEN_BOTTOM) {
      openBottomCount += 1;
      stack.push({ char: OPEN_BOTTOM, index: i });
    } else if (ch === CLOSE_TOP) {
      closeTopCount += 1;
      const top = stack[stack.length - 1];
      if (!top || top.char !== OPEN_TOP) {
        if (firstErrorPosition === -1) firstErrorPosition = i;
      } else stack.pop();
    } else if (ch === CLOSE_BOTTOM) {
      closeBottomCount += 1;
      const top = stack[stack.length - 1];
      if (!top || top.char !== OPEN_BOTTOM) {
        if (firstErrorPosition === -1) firstErrorPosition = i;
      } else stack.pop();
    }
  }
  if (firstErrorPosition === -1 && stack.length > 0)
    firstErrorPosition = stack[0].index;
  return {
    openTopCount,
    closeTopCount,
    openBottomCount,
    closeBottomCount,
    balanced: firstErrorPosition === -1,
    firstErrorPosition,
  };
};

export const leidenHalfbracketCheckerExample = {
  input: { transcription: "\u231CDI\u231DO" },
  output: {
    openTopCount: 1,
    closeTopCount: 1,
    openBottomCount: 0,
    closeBottomCount: 0,
    balanced: true,
    firstErrorPosition: -1,
  },
} satisfies ToolExample<
  LeidenHalfbracketCheckerInput,
  LeidenHalfbracketCheckerOutput
>;

export const leidenHalfbracketCheckerTool = createSimpleTool({
  id: "epigraphy/leiden-halfbracket-checker",
  title: "Leiden Half-Bracket Lacuna Marker Checker ((.))",
  description:
    "Validate Leiden half-bracket corner marks U+231C-U+231F that frame partially preserved letters, counting each corner type and reporting the zero-based position of the first mismatched or unmatched corner (-1 when balanced).",
  inputs: [
    {
      description: "Transcription containing half-bracket corners.",
      id: "transcription",
      kind: "string",
      label: "Transcription",
    },
  ],
  outputs: [
    {
      description: "Number of opening top-left corners (U+231C).",
      id: "openTopCount",
      kind: "integer",
      label: "Open top",
    },
    {
      description: "Number of closing top-right corners (U+231D).",
      id: "closeTopCount",
      kind: "integer",
      label: "Close top",
    },
    {
      description: "Number of opening bottom-left corners (U+231E).",
      id: "openBottomCount",
      kind: "integer",
      label: "Open bottom",
    },
    {
      description: "Number of closing bottom-right corners (U+231F).",
      id: "closeBottomCount",
      kind: "integer",
      label: "Close bottom",
    },
    {
      description: "True when every corner pairs correctly.",
      id: "balanced",
      kind: "boolean",
      label: "Balanced",
    },
    {
      description:
        "Zero-based position of the first pairing error, -1 if balanced.",
      id: "firstErrorPosition",
      kind: "integer",
      label: "First error",
    },
  ],
  calculate: (input) =>
    calculateLeidenHalfbracketChecker(
      input as unknown as LeidenHalfbracketCheckerInput,
    ),
});

export const runLeidenHalfbracketChecker = leidenHalfbracketCheckerTool.execute;
export default leidenHalfbracketCheckerTool;
