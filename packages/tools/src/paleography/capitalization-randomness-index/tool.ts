import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapitalizationRandomnessIndexInput = {
  readonly text: string;
};

export type CapitalizationRandomnessIndexOutput = {
  readonly capitalizationRate: number;
  readonly distinctCapitalizedInitials: number;
  readonly tokenCount: number;
};

const INITIAL_UPPER = /^\p{Lu}/u;

const initialLetter = (token: string): string =>
  token.match(/\p{L}/u)?.[0] ?? "";

export const calculateCapitalizationRandomnessIndex = (
  input: CapitalizationRandomnessIndexInput,
): CapitalizationRandomnessIndexOutput => {
  const trimmed = input.text.trim();
  if (trimmed.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const initials = trimmed
    .split(/\s+/)
    .map(initialLetter)
    .filter((initial) => initial.length > 0);
  if (initials.length === 0)
    return simpleError(
      "text",
      "Provide text containing at least one letter.",
      "invalid_text",
    );
  const capitalizedInitials = initials.filter((initial) =>
    INITIAL_UPPER.test(initial),
  );
  return {
    capitalizationRate: capitalizedInitials.length / initials.length,
    distinctCapitalizedInitials: new Set(capitalizedInitials).size,
    tokenCount: initials.length,
  };
};

export const capitalizationRandomnessIndexExample = {
  input: { text: "In \u00FEe begynnyng God created heuen and erthe" },
  output: {
    capitalizationRate: 0.25,
    distinctCapitalizedInitials: 2,
    tokenCount: 8,
  },
} satisfies ToolExample<
  CapitalizationRandomnessIndexInput,
  CapitalizationRandomnessIndexOutput
>;

export const capitalizationRandomnessIndexTool = createSimpleTool({
  id: "paleography/capitalization-randomness-index",
  title: "Capitalization Randomness Index",
  description:
    "Measure how liberally a manuscript sample capitalizes word initials: the exact fraction of whitespace tokens beginning with an uppercase letter (a rate near one reflects the medieval habit of decorating most words) plus the number of distinct capitalized initial letters.",
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
      description: "Uppercase-initial tokens divided by all tokens.",
      id: "capitalizationRate",
      kind: "number",
      label: "Cap rate",
    },
    {
      description: "Distinct uppercase initial letters observed.",
      id: "distinctCapitalizedInitials",
      kind: "integer",
      label: "Distinct initials",
    },
    {
      description:
        "Whitespace-delimited tokens containing at least one letter.",
      id: "tokenCount",
      kind: "integer",
      label: "Tokens",
    },
  ],
  calculate: (input) =>
    calculateCapitalizationRandomnessIndex({ text: input.text as string }),
});

export const runCapitalizationRandomnessIndex =
  capitalizationRandomnessIndexTool.execute;
export default capitalizationRandomnessIndexTool;
