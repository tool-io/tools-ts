import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const glossaryEntries = {
  balancier: {
    english: "balance wheel",
    term: "balancier",
  },
  chronometre: {
    english: "chronometer or stopwatch depending on context",
    term: "chronomètre",
  },
  echappement: {
    english: "escapement",
    term: "échappement",
  },
  remontoire: {
    english: "remontoire or constant-force remontoire",
    term: "remontoire",
  },
  spiral: {
    english: "balance spring or hairspring",
    term: "spiral",
  },
  tourbillon: {
    english: "tourbillon",
    term: "tourbillon",
  },
} as const;

export type FrenchHorologyTerm = keyof typeof glossaryEntries;

export type FrenchHorologyGlossaryInput = {
  readonly termFocus: FrenchHorologyTerm;
};

export type FrenchHorologyGlossaryOutput = {
  readonly englishMeaning: string;
  readonly frenchTerm: string;
  readonly terminologyCaution: string;
};

export const lookupFrenchHorologyTerm = (
  input: FrenchHorologyGlossaryInput,
): FrenchHorologyGlossaryOutput => {
  const entry = glossaryEntries[input.termFocus];
  if (entry === undefined)
    simpleError(
      "termFocus",
      "French horology term is not supported.",
      "unsupported_term_focus",
    );
  return {
    englishMeaning: entry.english,
    frenchTerm: entry.term,
    terminologyCaution:
      "Translations follow Swiss horology usage where applicable; chronomètre and remontoire require context, and a French word can have meanings outside watchmaking.",
  };
};

export const frenchGlossaryExample = {
  input: { termFocus: "echappement" },
  output: {
    englishMeaning: "escapement",
    frenchTerm: "échappement",
    terminologyCaution:
      "Translations follow Swiss horology usage where applicable; chronomètre and remontoire require context, and a French word can have meanings outside watchmaking.",
  },
} satisfies ToolExample<
  FrenchHorologyGlossaryInput,
  FrenchHorologyGlossaryOutput
>;

export const frenchGlossaryTool = createSimpleTool({
  calculate: (input) =>
    lookupFrenchHorologyTerm({
      termFocus: input.termFocus as FrenchHorologyTerm,
    }),
  description:
    "Translate six foundational French horology terms through the Federation of the Swiss Watch Industry dictionary with context cautions.",
  id: "horology/french-horology-glossary-translation-lookup",
  inputs: [
    {
      enum: [
        "balancier",
        "chronometre",
        "echappement",
        "remontoire",
        "spiral",
        "tourbillon",
      ],
      id: "termFocus",
      kind: "string",
      label: "French horology glossary focus",
    },
  ],
  outputs: [
    { id: "englishMeaning", kind: "string", label: "English horology meaning" },
    { id: "frenchTerm", kind: "string", label: "French horology term" },
    {
      id: "terminologyCaution",
      kind: "string",
      label: "Translation context caution",
    },
  ],
  title: "French Horology Glossary Translation Lookup",
});

export const runFrenchGlossary = frenchGlossaryTool.execute;
export default frenchGlossaryTool;
