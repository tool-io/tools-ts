import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly abbreviations: readonly string[];
  readonly expansions: readonly string[];
  readonly legend: string;
}>;
export type Output = Readonly<{
  readonly matchedExpansions: readonly string[];
  readonly unmatchedTokens: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.abbreviations.length === 0 ||
    input.abbreviations.length !== input.expansions.length
  )
    simpleError(
      "abbreviations",
      "Abbreviation and expansion lists must be nonempty and equal in length.",
      "dictionary_length_mismatch",
    );
  const dictionary = new Map<string, string>();
  for (let index = 0; index < input.abbreviations.length; index += 1) {
    const key = input.abbreviations[index]?.trim().toUpperCase();
    const value = input.expansions[index];
    if (!key || value === undefined || value.trim().length === 0)
      simpleError(
        "abbreviations",
        "Dictionary entries must not be empty.",
        "invalid_dictionary_entry",
      );
    dictionary.set(key, value);
  }
  const tokens = input.legend.toUpperCase().match(/[A-Z]+/g) ?? [];
  if (tokens.length === 0)
    simpleError(
      "legend",
      "Legend must contain Latin-letter tokens.",
      "legend_empty",
    );
  const matchedExpansions: string[] = [];
  const unmatchedTokens: string[] = [];
  for (const token of tokens) {
    const expansion = dictionary.get(token);
    if (expansion === undefined) unmatchedTokens.push(token);
    else matchedExpansions.push(expansion);
  }
  return { matchedExpansions, unmatchedTokens };
};

export const example = {
  input: {
    abbreviations: ["LENT", "MAR"],
    expansions: ["Lentulus", "Marcellus"],
    legend: "LENT MAR",
  },
  output: { matchedExpansions: ["Lentulus", "Marcellus"], unmatchedTokens: [] },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    abbreviations: ["L"],
    expansions: ["Caller-defined Lucius"],
    legend: "L XYZ",
  },
  output: {
    matchedExpansions: ["Caller-defined Lucius"],
    unmatchedTokens: ["XYZ"],
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      abbreviations: input.abbreviations as string[],
      expansions: input.expansions as string[],
      legend: input.legend as string,
    }),
  description:
    "Match normalized Roman Republican legend tokens against a caller-supplied abbreviation dictionary; it does not identify a moneyer from unconfigured initials.",
  id: "numismatics/roman-moneyer-legend-parser",
  inputs: [
    {
      id: "abbreviations",
      kind: "stringList",
      label: "Caller abbreviation keys",
    },
    { id: "expansions", kind: "stringList", label: "Caller expansions" },
    { id: "legend", kind: "string", label: "Coin legend" },
  ],
  outputs: [
    {
      id: "matchedExpansions",
      kind: "stringList",
      label: "Matched expansions",
    },
    { id: "unmatchedTokens", kind: "stringList", label: "Unmatched tokens" },
  ],
  title: "Roman Moneyer Legend Parser",
});

export const run = tool.execute;
export default tool;
