import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CatchwordPresenceCheckerInput = {
  readonly versoTailText: string;
  readonly followingRectoHeadText: string;
};

export type CatchwordPresenceCheckerOutput = {
  readonly catchwordMatch: boolean;
  readonly matchedWord: string;
};

const normalizeToken = (token: string): string =>
  token
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
    .toLowerCase();

export const calculateCatchwordPresenceChecker = (
  input: CatchwordPresenceCheckerInput,
): CatchwordPresenceCheckerOutput => {
  if (input.versoTailText.trim().length === 0)
    return simpleError(
      "versoTailText",
      "Provide the closing line text of the verso.",
      "invalid_text",
    );
  if (input.followingRectoHeadText.trim().length === 0)
    return simpleError(
      "followingRectoHeadText",
      "Provide the opening line text of the next recto.",
      "invalid_text",
    );
  const tailTokens = input.versoTailText
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token.length > 0);
  const headTokens = input.followingRectoHeadText
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token.length > 0);
  if (tailTokens.length === 0)
    return simpleError(
      "versoTailText",
      "The verso tail must contain at least one letter or number.",
      "invalid_text",
    );
  if (headTokens.length === 0)
    return simpleError(
      "followingRectoHeadText",
      "The recto head must contain at least one letter or number.",
      "invalid_text",
    );
  const lastTailWord = tailTokens[tailTokens.length - 1] ?? "";
  const firstHeadWord = headTokens[0] ?? "";
  const catchwordMatch =
    lastTailWord.length > 0 && lastTailWord === firstHeadWord;
  return {
    catchwordMatch,
    matchedWord: catchwordMatch ? lastTailWord : "",
  };
};

export const catchwordPresenceCheckerExample = {
  input: {
    versoTailText: "explicit liber primus qui dicitur genesis.",
    followingRectoHeadText: "Genesis incipit liber secundus;",
  },
  output: { catchwordMatch: true, matchedWord: "genesis" },
} satisfies ToolExample<
  CatchwordPresenceCheckerInput,
  CatchwordPresenceCheckerOutput
>;

export const catchwordPresenceCheckerTool = createSimpleTool({
  id: "paleography/catchword-presence-checker",
  title: "Catchword Presence Checker",
  description:
    "Check for a catchword by comparing the last word of a verso's closing line with the first word of the following recto after exact normalization (case-folding, accent-stripping and trimming of punctuation).",
  inputs: [
    {
      description: "Closing-line transcription of the verso.",
      id: "versoTailText",
      kind: "string",
      label: "Verso tail",
    },
    {
      description: "Opening-line transcription of the next recto.",
      id: "followingRectoHeadText",
      kind: "string",
      label: "Recto head",
    },
  ],
  outputs: [
    {
      description:
        "True when the tail's last word repeats as the head's first word.",
      id: "catchwordMatch",
      kind: "boolean",
      label: "Catchword match",
    },
    {
      description: "The matching word, or an empty string when absent.",
      id: "matchedWord",
      kind: "string",
      label: "Matched word",
    },
  ],
  calculate: (input) =>
    calculateCatchwordPresenceChecker({
      followingRectoHeadText: input.followingRectoHeadText as string,
      versoTailText: input.versoTailText as string,
    }),
});

export const runCatchwordPresenceChecker = catchwordPresenceCheckerTool.execute;
export default catchwordPresenceCheckerTool;
