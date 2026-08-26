import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SiglaStopmarkPositionCheckerInput = {
  readonly text: string;
};

export type SiglaStopmarkPositionCheckerOutput = {
  readonly tokenCount: number;
  readonly interpunctTokens: number;
  readonly interpunctCount: number;
  readonly invalidTokens: readonly string[];
  readonly isValidAll: boolean;
};

export const calculateSiglaStopmarkPositionChecker = (
  input: SiglaStopmarkPositionCheckerInput,
): SiglaStopmarkPositionCheckerOutput => {
  if (!input.text.trim())
    return simpleError("text", "Text is required.", "invalid_text");
  const tokens = input.text.split(/\s+/).filter((token) => token.length > 0);
  let interpunctTokens = 0;
  let interpunctCount = 0;
  const invalidTokens: string[] = [];
  for (const token of tokens) {
    if (!token.includes("\u00B7")) continue;
    interpunctTokens += 1;
    for (let i = 0; i < token.length; i += 1) {
      if (token[i] !== "\u00B7") continue;
      interpunctCount += 1;
      if (i === 0 || i === token.length - 1) {
        invalidTokens.push(token);
        break;
      }
    }
  }
  return {
    tokenCount: tokens.length,
    interpunctTokens,
    interpunctCount,
    invalidTokens,
    isValidAll: invalidTokens.length === 0,
  };
};

export const siglaStopmarkPositionCheckerExample = {
  input: { text: "C\u00B7IVLIVS C\u00B7F\u00B7 RVFVS" },
  output: {
    tokenCount: 3,
    interpunctTokens: 2,
    interpunctCount: 3,
    invalidTokens: ["C\u00B7F\u00B7"],
    isValidAll: false,
  },
} satisfies ToolExample<
  SiglaStopmarkPositionCheckerInput,
  SiglaStopmarkPositionCheckerOutput
>;

export const siglaStopmarkPositionCheckerTool = createSimpleTool({
  id: "epigraphy/sigla-stopmark-position-checker",
  title: "Sigla Abbreviation Stop Mark Position Checker (mid-dot)",
  description:
    "Check middle-dot (interpunct U+00B7) stop marks in name tokens of an inscription, counting their occurrences and flagging any token with a leading or trailing dot as malformed sigla punctuation.",
  inputs: [
    {
      description: "Inscription text; whitespace-separated name tokens.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Number of tokens examined.",
      id: "tokenCount",
      kind: "integer",
      label: "Tokens",
    },
    {
      description: "Tokens containing at least one interpunct.",
      id: "interpunctTokens",
      kind: "integer",
      label: "Dotted tokens",
    },
    {
      description: "Total interpunct characters found.",
      id: "interpunctCount",
      kind: "integer",
      label: "Interpuncts",
    },
    {
      description: "Tokens with leading or trailing dots.",
      id: "invalidTokens",
      kind: "stringList",
      label: "Invalid tokens",
    },
    {
      description: "True when no token has a misplaced dot.",
      id: "isValidAll",
      kind: "boolean",
      label: "All valid",
    },
  ],
  calculate: (input) =>
    calculateSiglaStopmarkPositionChecker(
      input as unknown as SiglaStopmarkPositionCheckerInput,
    ),
});

export const runSiglaStopmarkPositionChecker =
  siglaStopmarkPositionCheckerTool.execute;
export default siglaStopmarkPositionCheckerTool;
