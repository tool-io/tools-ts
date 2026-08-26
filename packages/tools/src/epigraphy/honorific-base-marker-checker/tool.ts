import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HonorificBaseMarkerCheckerInput = {
  readonly formulaWords: readonly string[];
  readonly hasDativeDedicatee?: boolean;
};

export type HonorificBaseMarkerCheckerOutput = {
  readonly markerScore: number;
  readonly classification: "honorific-high" | "honorific-low" | "not-honorific";
  readonly matchedMarkers: readonly string[];
};

const HONORIFIC_PHRASES = [
  "ob merita",
  "ob excellentem",
  "ob insignem",
  "ob munificentiam",
];
const HONORIFIC_TOKENS = [
  "honori",
  "honore",
  "patrono",
  "patronae",
  "civi",
  "beneficiario",
  "equiti",
];

export const calculateHonorificBaseMarkerChecker = (
  input: HonorificBaseMarkerCheckerInput,
): HonorificBaseMarkerCheckerOutput => {
  const words: string[] = [];
  for (const word of input.formulaWords) {
    const trimmed = word.trim();
    if (!trimmed)
      return simpleError(
        "formulaWords",
        "Formula words must be non-empty strings.",
        "empty_word",
      );
    words.push(trimmed.toLowerCase());
  }
  const joined = words.join(" ");
  const tokens = new Set(joined.split(/\s+/));
  const matchedMarkers: string[] = [];
  for (const phrase of HONORIFIC_PHRASES)
    if (joined.includes(phrase)) matchedMarkers.push(phrase);
  for (const token of HONORIFIC_TOKENS)
    if (tokens.has(token)) matchedMarkers.push(token);
  const hasDativeDedicatee = input.hasDativeDedicatee ?? false;
  const markerScore =
    matchedMarkers.length +
    (hasDativeDedicatee && matchedMarkers.length > 0 ? 1 : 0);
  return {
    markerScore,
    classification:
      markerScore >= 2
        ? "honorific-high"
        : markerScore === 1
          ? "honorific-low"
          : "not-honorific",
    matchedMarkers,
  };
};

export const honorificBaseMarkerCheckerExample = {
  input: { formulaWords: ["Ob", "Merita", "Patrono"] },
  output: {
    markerScore: 2,
    classification: "honorific-high",
    matchedMarkers: ["ob merita", "patrono"],
  },
} satisfies ToolExample<
  HonorificBaseMarkerCheckerInput,
  HonorificBaseMarkerCheckerOutput
>;

export const honorificBaseMarkerCheckerTool = createSimpleTool({
  id: "epigraphy/honorific-base-marker-checker",
  title: "Honorific Statue Base Genre Marker Checker",
  description:
    "Score honorific statue-base markers by matching documented phrases ('ob merita', 'ob excellentem', 'ob insignem', 'ob munificentiam') and tokens (honori, honore, patrono, patronae, civi, beneficiario, equiti), add one point for a dative dedicatee when any marker matches, and label the base honorific-high at a score of two or more, honorific-low at one, otherwise not-honorific.",
  inputs: [
    {
      description: "Formula words from the statue base.",
      id: "formulaWords",
      kind: "stringList",
      label: "Formula words",
    },
    {
      default: false,
      description: "True when the dedicatee stands in the dative.",
      id: "hasDativeDedicatee",
      kind: "boolean",
      label: "Dative dedicatee",
    },
  ],
  outputs: [
    {
      description: "Number of distinct markers plus the dative bonus.",
      id: "markerScore",
      kind: "integer",
      label: "Marker score",
    },
    {
      description: "Genre verdict for the base.",
      enum: ["honorific-high", "honorific-low", "not-honorific"],
      id: "classification",
      kind: "string",
      label: "Classification",
    },
    {
      description: "Matched markers in check order.",
      id: "matchedMarkers",
      kind: "stringList",
      label: "Matched markers",
    },
  ],
  calculate: (input) =>
    calculateHonorificBaseMarkerChecker(
      input as unknown as HonorificBaseMarkerCheckerInput,
    ),
});

export const runHonorificBaseMarkerChecker =
  honorificBaseMarkerCheckerTool.execute;
export default honorificBaseMarkerCheckerTool;
