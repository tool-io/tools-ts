import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DivineMortalClassifierInput = {
  readonly deityNamed: boolean;
  readonly hasDativeCase: boolean;
  readonly formulaWords: readonly string[];
};

export type DivineMortalClassifierOutput = {
  readonly classification: "divine" | "mortal" | "uncertain";
  readonly matchedEvidence: string;
  readonly rationale: string;
};

const DIVINE_TOKENS = ["deo", "deae", "deis", "dis", "numini"];
const MORTAL_PHRASES = ["dis manibus", "manibus"];
const MORTAL_TOKENS = [
  "memoriae",
  "pientissimo",
  "pientissimae",
  "karissimo",
  "karissimae",
  "dulcissimo",
  "dulcissimae",
];
const MORTAL_PHRASE_EXTRA = "bene merenti";

export const calculateDivineMortalClassifier = (
  input: DivineMortalClassifierInput,
): DivineMortalClassifierOutput => {
  if (typeof input.deityNamed !== "boolean")
    return simpleError(
      "deityNamed",
      "deityNamed must be a boolean.",
      "invalid_flag",
    );
  if (typeof input.hasDativeCase !== "boolean")
    return simpleError(
      "hasDativeCase",
      "hasDativeCase must be a boolean.",
      "invalid_flag",
    );
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
  if (input.deityNamed)
    return {
      classification: "divine",
      matchedEvidence: "deityNamed",
      rationale: "An explicit deity is named in the dedication.",
    };
  for (const phrase of MORTAL_PHRASES)
    if (joined.includes(phrase))
      return {
        classification: "mortal",
        matchedEvidence: phrase,
        rationale:
          "A Manes formula honors a deceased human dedicatee despite the divine framing.",
      };
  for (const token of DIVINE_TOKENS)
    if (tokens.has(token))
      return {
        classification: "divine",
        matchedEvidence: token,
        rationale: "The formula addresses a god or goddess directly.",
      };
  if (joined.includes(MORTAL_PHRASE_EXTRA))
    return {
      classification: "mortal",
      matchedEvidence: MORTAL_PHRASE_EXTRA,
      rationale: "The 'bene merenti' formula marks a human recipient.",
    };
  for (const token of MORTAL_TOKENS)
    if (tokens.has(token))
      return {
        classification: "mortal",
        matchedEvidence: token,
        rationale:
          "An affectionate funerary superlative marks a deceased person.",
      };
  return {
    classification: "uncertain",
    matchedEvidence: "",
    rationale: input.hasDativeCase
      ? "Dative dedication without explicit divine or funerary markers."
      : "No dedicatory markers were supplied.",
  };
};

export const divineMortalClassifierExample = {
  input: {
    deityNamed: false,
    hasDativeCase: true,
    formulaWords: ["Dis", "Manibus", "Sacrum"],
  },
  output: {
    classification: "mortal",
    matchedEvidence: "dis manibus",
    rationale:
      "A Manes formula honors a deceased human dedicatee despite the divine framing.",
  },
} satisfies ToolExample<
  DivineMortalClassifierInput,
  DivineMortalClassifierOutput
>;

export const divineMortalClassifierTool = createSimpleTool({
  id: "epigraphy/divine-mortal-classifier",
  title: "Dedicatee Divine vs Mortal Classifier by Title Tokens",
  description:
    "Classify the dedicatee as divine or mortal from explicit markers in this documented order: a named deity wins; then any 'manibus' formula marks a mortal deceased; then god tokens (deo, deae, deis, dis, numini) mark divine; then 'bene merenti' or affectionate superlatives (memoriae, pientissimo/a, karissimo/a, dulcissimo/a) mark mortal; otherwise the result is uncertain.",
  inputs: [
    {
      description: "True when an actual deity name appears as dedicatee.",
      id: "deityNamed",
      kind: "boolean",
      label: "Deity named",
    },
    {
      description: "True when the dedicatee phrase is dative.",
      id: "hasDativeCase",
      kind: "boolean",
      label: "Dative case",
    },
    {
      description: "Formula words of the dedication line.",
      id: "formulaWords",
      kind: "stringList",
      label: "Formula words",
    },
  ],
  outputs: [
    {
      description: "Classification outcome.",
      enum: ["divine", "mortal", "uncertain"],
      id: "classification",
      kind: "string",
      label: "Classification",
    },
    {
      description: "Marker that determined the decision, or empty string.",
      id: "matchedEvidence",
      kind: "string",
      label: "Evidence",
    },
    {
      description: "One-line justification of the rule applied.",
      id: "rationale",
      kind: "string",
      label: "Rationale",
    },
  ],
  calculate: (input) =>
    calculateDivineMortalClassifier(
      input as unknown as DivineMortalClassifierInput,
    ),
});

export const runDivineMortalClassifier = divineMortalClassifierTool.execute;
export default divineMortalClassifierTool;
