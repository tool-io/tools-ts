import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VotiveFuneraryGenreClassifierInput = {
  readonly formulaWords: readonly string[];
};

export type VotiveFuneraryGenreClassifierOutput = {
  readonly genre: "votive" | "funerary" | "mixed" | "uncertain";
  readonly matchedMarkers: readonly string[];
};

const FUNERARY_PHRASES = [
  "dis manibus",
  "sit tibi terra levis",
  "hic iacet",
  "in pace",
];
const FUNERARY_TOKENS = ["manibus", "memoriae", "sttl"];
const VOTIVE_PHRASES = [
  "libens merito",
  "donum dedit",
  "votum solvit",
  "v s l m",
];
const VOTIVE_TOKENS = ["vslm", "donavit", "dedicavit"];

export const calculateVotiveFuneraryGenreClassifier = (
  input: VotiveFuneraryGenreClassifierInput,
): VotiveFuneraryGenreClassifierOutput => {
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
  for (const phrase of FUNERARY_PHRASES)
    if (joined.includes(phrase)) matchedMarkers.push(phrase);
  for (const token of FUNERARY_TOKENS)
    if (tokens.has(token)) matchedMarkers.push(token);
  for (const phrase of VOTIVE_PHRASES)
    if (joined.includes(phrase)) matchedMarkers.push(phrase);
  for (const token of VOTIVE_TOKENS)
    if (tokens.has(token)) matchedMarkers.push(token);
  const distinctMarkers = matchedMarkers.filter(
    (marker) =>
      !matchedMarkers.some(
        (other) => other !== marker && other.includes(marker),
      ),
  );
  const funeraryCount = distinctMarkers.filter((marker) =>
    [...FUNERARY_PHRASES, ...FUNERARY_TOKENS].includes(marker),
  ).length;
  const votiveCount = distinctMarkers.length - funeraryCount;
  const genre =
    votiveCount > 0 && funeraryCount > 0
      ? "mixed"
      : votiveCount > 0
        ? "votive"
        : funeraryCount > 0
          ? "funerary"
          : "uncertain";
  return { genre, matchedMarkers: distinctMarkers };
};

export const votiveFuneraryGenreClassifierExample = {
  input: { formulaWords: ["V", "S", "L", "M"] },
  output: { genre: "votive", matchedMarkers: ["v s l m"] },
} satisfies ToolExample<
  VotiveFuneraryGenreClassifierInput,
  VotiveFuneraryGenreClassifierOutput
>;

export const votiveFuneraryGenreClassifierTool = createSimpleTool({
  id: "epigraphy/votive-funerary-genre-classifier",
  title: "Votive versus Funerary Genre Quick Classifier",
  description:
    "Quickly label an inscription votive, funerary, mixed, or uncertain by matching documented marker sets in the joined formula words (votive: 'v s l m', libens merito, donum dedit, votum solvit, vslm, donavit, dedicavit; funerary: dis manibus, sit tibi terra levis, hic iacet, in pace, manibus, memoriae, sttl).",
  inputs: [
    {
      description: "Formula words of the inscription.",
      id: "formulaWords",
      kind: "stringList",
      label: "Formula words",
    },
  ],
  outputs: [
    {
      description: "Quick genre label.",
      enum: ["votive", "funerary", "mixed", "uncertain"],
      id: "genre",
      kind: "string",
      label: "Genre",
    },
    {
      description: "Matched markers that determined the label.",
      id: "matchedMarkers",
      kind: "stringList",
      label: "Matched markers",
    },
  ],
  calculate: (input) =>
    calculateVotiveFuneraryGenreClassifier(
      input as unknown as VotiveFuneraryGenreClassifierInput,
    ),
});

export const runVotiveFuneraryGenreClassifier =
  votiveFuneraryGenreClassifierTool.execute;
export default votiveFuneraryGenreClassifierTool;
