import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatinAbbreviationExpanderInput = {
  readonly text: string;
};

export type LatinAbbreviationExpanderOutput = {
  readonly expansionCount: number;
  readonly expandedText: string;
  readonly expansions: readonly string[];
};

const TABLE: ReadonlyArray<readonly [readonly string[], string]> = [
  [["S", "T", "T", "L"], "Sit Tibi Terra Levis"],
  [["V", "S", "L", "M"], "Votum Solvit Libens Merito"],
  [["D", "M", "S"], "Dis Manibus Sacrum"],
  [["H", "S", "E"], "Hic Situs Est"],
  [["DIS", "MANIB"], "Dis Manibus"],
  [["DIS", "MAN"], "Dis Manibus"],
  [["D", "M"], "Dis Manibus"],
  [["TR", "P"], "Tribunicia Potestas"],
  [["P", "M"], "Pontifex Maximus"],
  [["DM"], "Dis Manibus"],
  [["DMS"], "Dis Manibus Sacrum"],
  [["STTL"], "Sit Tibi Terra Levis"],
  [["VSLM"], "Votum Solvit Libens Merito"],
  [["HSE"], "Hic Situs Est"],
  [["PM"], "Pontifex Maximus"],
  [["TRP"], "Tribunicia Potestas"],
  [["COS"], "Consul"],
  [["HS"], "Sestertii"],
];
const ORDERED = [...TABLE].sort(
  (a, b) =>
    b[0].length - a[0].length || b[0].join(" ").length - a[0].join(" ").length,
);

export const calculateLatinAbbreviationExpander = (
  input: LatinAbbreviationExpanderInput,
): LatinAbbreviationExpanderOutput => {
  const tokens = input.text
    .replace(/\u00B7/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);
  if (tokens.length === 0)
    return simpleError("text", "Text is required.", "invalid_text");
  const upper = tokens.map((token) => token.toUpperCase());
  const used = new Array<boolean>(tokens.length).fill(false);
  const replacementAt = new Map<number, string>();
  const expansions: string[] = [];
  for (const [words, expansion] of ORDERED) {
    const joined = words.join(" ");
    for (let i = 0; i + words.length <= tokens.length; i += 1) {
      if (used[i]) continue;
      let free = true;
      for (let k = 0; k < words.length; k += 1)
        if (used[i + k]) {
          free = false;
          break;
        }
      if (!free || upper.slice(i, i + words.length).join(" ") !== joined)
        continue;
      expansions.push(
        `${tokens.slice(i, i + words.length).join(" ")} -> ${expansion}`,
      );
      replacementAt.set(i, expansion);
      for (let k = 0; k < words.length; k += 1) used[i + k] = true;
    }
  }
  const parts: string[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const replacement = replacementAt.get(i);
    if (replacement !== undefined) parts.push(replacement);
    else if (!used[i]) parts.push(tokens[i]);
  }
  return {
    expansionCount: expansions.length,
    expandedText: parts.join(" "),
    expansions,
  };
};

export const latinAbbreviationExpanderExample = {
  input: { text: "D\u00B7M\u00B7S ET STTL" },
  output: {
    expansionCount: 2,
    expandedText: "Dis Manibus Sacrum ET Sit Tibi Terra Levis",
    expansions: ["D M S -> Dis Manibus Sacrum", "STTL -> Sit Tibi Terra Levis"],
  },
} satisfies ToolExample<
  LatinAbbreviationExpanderInput,
  LatinAbbreviationExpanderOutput
>;

export const latinAbbreviationExpanderTool = createSimpleTool({
  id: "epigraphy/latin-abbreviation-expander",
  title: "Common Latin Epigraphic Abbreviation Expander (DIS MANIBUS etc.)",
  description:
    "Expand common Latin epigraphic abbreviations (DM, DIS MAN, D M S, STTL, VSLM, HSE, PM, TR P, COS, HS and spaced variants) to full formulas, matching whole case-insensitive tokens after normalizing mid-dots to spaces.",
  inputs: [
    {
      description: "Inscription text with abbreviations.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Number of abbreviations expanded.",
      id: "expansionCount",
      kind: "integer",
      label: "Expansions",
    },
    {
      description: "Text with abbreviations replaced by their formulas.",
      id: "expandedText",
      kind: "string",
      label: "Expanded text",
    },
    {
      description: "Per-match notes formatted 'ABBREVIATION -> expansion'.",
      id: "expansions",
      kind: "stringList",
      label: "Expansion list",
    },
  ],
  calculate: (input) =>
    calculateLatinAbbreviationExpander(
      input as unknown as LatinAbbreviationExpanderInput,
    ),
});

export const runLatinAbbreviationExpander =
  latinAbbreviationExpanderTool.execute;
export default latinAbbreviationExpanderTool;
