import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UviInterchangeEraCheckerInput = {
  readonly text: string;
};

export type UviInterchangeEraCheckerOutput = {
  readonly ueFinalTokenCount: number;
  readonly veFinalTokenCount: number;
  readonly orthographyHint:
    | "pre_standardization_spelling_likely"
    | "post_standardization_spelling_likely"
    | "indeterminate";
};

export const calculateUviInterchangeEraChecker = (
  input: UviInterchangeEraCheckerInput,
): UviInterchangeEraCheckerOutput => {
  const trimmed = input.text.trim();
  if (trimmed.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const tokens = trimmed
    .split(/\s+/)
    .map((token) => token.toLowerCase().replace(/^\P{L}+|\P{L}+$/gu, ""));
  const ueFinalTokenCount = tokens.filter((token) =>
    token.endsWith("ue"),
  ).length;
  const veFinalTokenCount = tokens.filter((token) =>
    token.endsWith("ve"),
  ).length;
  const orthographyHint =
    ueFinalTokenCount > veFinalTokenCount
      ? "pre_standardization_spelling_likely"
      : veFinalTokenCount > ueFinalTokenCount
        ? "post_standardization_spelling_likely"
        : "indeterminate";
  return { ueFinalTokenCount, veFinalTokenCount, orthographyHint };
};

export const uviInterchangeEraCheckerExample = {
  input: { text: "Haue ye herd my loue" },
  output: {
    ueFinalTokenCount: 2,
    veFinalTokenCount: 0,
    orthographyHint: "pre_standardization_spelling_likely",
  },
} satisfies ToolExample<
  UviInterchangeEraCheckerInput,
  UviInterchangeEraCheckerOutput
>;

export const uviInterchangeEraCheckerTool = createSimpleTool({
  id: "paleography/uvi-interchange-era-checker",
  title: "U/V Interchange Era Checker",
  description:
    "Compare word-final '-ue' versus '-ve' spellings in a sample under the stated heuristic: more -ue endings (haue, loue) suggests pre-standardization u/v interchange, more -ve endings suggests the later positional convention, and ties are indeterminate.",
  inputs: [
    {
      description: "Transcription sample to scan.",
      id: "text",
      kind: "string",
      label: "Text sample",
    },
  ],
  outputs: [
    {
      description:
        "Tokens ending in 'ue' after surrounding punctuation is ignored (case-insensitive).",
      id: "ueFinalTokenCount",
      kind: "integer",
      label: "-ue tokens",
    },
    {
      description:
        "Tokens ending in 've' after surrounding punctuation is ignored (case-insensitive).",
      id: "veFinalTokenCount",
      kind: "integer",
      label: "-ve tokens",
    },
    {
      description: "Stated-heuristic era hint from the ending counts.",
      id: "orthographyHint",
      enum: [
        "pre_standardization_spelling_likely",
        "post_standardization_spelling_likely",
        "indeterminate",
      ],
      kind: "string",
      label: "Orthography hint",
    },
  ],
  calculate: (input) =>
    calculateUviInterchangeEraChecker({ text: input.text as string }),
});

export const runUviInterchangeEraChecker = uviInterchangeEraCheckerTool.execute;
export default uviInterchangeEraCheckerTool;
