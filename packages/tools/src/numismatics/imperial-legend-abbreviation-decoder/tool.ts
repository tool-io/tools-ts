import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{ readonly legend: string }>;
export type Output = Readonly<{
  readonly decodedTerms: readonly string[];
  readonly unknownTokens: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const dictionary: Readonly<Record<string, string>> = {
    IMP: "Imperator",
    CAES: "Caesar",
    AVG: "Augustus or Augusta",
    P: "Pius when paired in P F; otherwise context-dependent",
    F: "Felix when paired in P F; otherwise context-dependent",
    PF: "Pius Felix",
    TRP: "Tribunicia Potestas",
    COS: "Consul",
    PP: "Pater Patriae",
  };
  const tokens =
    input.legend
      .toUpperCase()
      .replace(/TR\s*P/g, "TRP")
      .match(/[A-Z]+/g) ?? [];
  if (tokens.length === 0)
    simpleError(
      "legend",
      "Legend must contain Latin-letter tokens.",
      "legend_empty",
    );
  const decodedTerms: string[] = [];
  const unknownTokens: string[] = [];
  for (const token of tokens) {
    const decoded = dictionary[token];
    if (decoded === undefined) unknownTokens.push(token);
    else decodedTerms.push(decoded);
  }
  return { decodedTerms, unknownTokens };
};

export const example = {
  input: { legend: "IMP CAES AVG" },
  output: {
    decodedTerms: ["Imperator", "Caesar", "Augustus or Augusta"],
    unknownTokens: [],
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { legend: "P F XYZ" },
  output: {
    decodedTerms: [
      "Pius when paired in P F; otherwise context-dependent",
      "Felix when paired in P F; otherwise context-dependent",
    ],
    unknownTokens: ["XYZ"],
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) => calculate({ legend: input.legend as string }),
  description:
    "Decode a narrow set of common Roman imperial legend abbreviations while preserving unknown tokens for catalogue-level interpretation.",
  id: "numismatics/imperial-legend-abbreviation-decoder",
  inputs: [{ id: "legend", kind: "string", label: "Imperial coin legend" }],
  outputs: [
    { id: "decodedTerms", kind: "stringList", label: "Decoded terms" },
    { id: "unknownTokens", kind: "stringList", label: "Unknown tokens" },
  ],
  title: "Imperial Legend Abbreviation Decoder",
});

export const run = tool.execute;
export default tool;
