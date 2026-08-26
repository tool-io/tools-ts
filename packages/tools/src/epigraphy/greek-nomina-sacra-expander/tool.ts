import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GreekNominaSacraExpanderInput = {
  readonly text: string;
};

export type GreekNominaSacraExpanderOutput = {
  readonly nominaSacraCount: number;
  readonly expandedText: string;
  readonly expansions: readonly string[];
};

const LEMMAS: Record<string, string> = {
  "\u0398\u03A3": "\u0398\u03B5\u03BF\u03C2",
  "\u039A\u03A3": "\u039A\u03C5\u03C1\u03B9\u03BF\u03C2",
  "\u0399\u0397\u03A3": "\u0399\u03B7\u03C3\u03BF\u03C5\u03C2",
  "\u0399\u03A3": "\u0399\u03B7\u03C3\u03BF\u03C5\u03C2",
  "\u03A7\u03A3": "\u03A7\u03C1\u03B9\u03C3\u03C4\u03BF\u03C2",
  "\u03A0\u039D\u0391": "\u03A0\u03BD\u03B5\u03C5\u03BC\u03B1",
  "\u03A3\u03A9\u03A1": "\u03A3\u03C9\u03C4\u03B7\u03C1",
  "\u03A0\u0397\u03A1": "\u03A0\u03B1\u03C4\u03B7\u03C1",
  "\u039C\u0397\u03A1": "\u039C\u03B7\u03C4\u03B7\u03C1",
  "\u03A5\u03A3": "\u03A5\u03B9\u03BF\u03C2",
  "\u0394\u0391\u0394": "\u0394\u03B1\u03C5\u03B9\u03B4",
  "\u0399\u039B\u0397\u039C":
    "\u0399\u03B5\u03C1\u03BF\u03C5\u03C3\u03B1\u03BB\u03B7\u03BC",
  "\u0399\u03A3\u03A1\u039B": "\u0399\u03C3\u03C1\u03B1\u03B7\u03BB",
  "\u0395\u039A\u039A\u039B\u03A3":
    "\u0395\u03BA\u03BA\u03BB\u03B7\u03C3\u03B9\u03B1",
};
const KEYS = Object.keys(LEMMAS).sort((a, b) => b.length - a.length);

export const calculateGreekNominaSacraExpander = (
  input: GreekNominaSacraExpanderInput,
): GreekNominaSacraExpanderOutput => {
  if (!input.text.trim())
    return simpleError("text", "Text is required.", "invalid_text");
  const tokens = input.text.trim().split(/\s+/);
  const expansions: string[] = [];
  let nominaSacraCount = 0;
  const parts = tokens.map((token) => {
    const lemma = LEMMAS[token.toUpperCase()];
    if (lemma === undefined) return token;
    nominaSacraCount += 1;
    expansions.push(`${token.toUpperCase()} -> ${lemma}`);
    return lemma;
  });
  return {
    nominaSacraCount,
    expandedText: parts.join(" "),
    expansions,
  };
};

export const greekNominaSacraExpanderExample = {
  input: { text: "\u0398\u03A3 \u039A\u03A3 \u0399\u03A3 \u03A7\u03A3" },
  output: {
    nominaSacraCount: 4,
    expandedText:
      "\u0398\u03B5\u03BF\u03C2 \u039A\u03C5\u03C1\u03B9\u03BF\u03C2 \u0399\u03B7\u03C3\u03BF\u03C5\u03C2 \u03A7\u03C1\u03B9\u03C3\u03C4\u03BF\u03C2",
    expansions: [
      "\u0398\u03A3 -> \u0398\u03B5\u03BF\u03C2",
      "\u039A\u03A3 -> \u039A\u03C5\u03C1\u03B9\u03BF\u03C2",
      "\u0399\u03A3 -> \u0399\u03B7\u03C3\u03BF\u03C5\u03C2",
      "\u03A7\u03A3 -> \u03A7\u03C1\u03B9\u03C3\u03C4\u03BF\u03C2",
    ],
  },
} satisfies ToolExample<
  GreekNominaSacraExpanderInput,
  GreekNominaSacraExpanderOutput
>;

export const greekNominaSacraExpanderTool = createSimpleTool({
  id: "epigraphy/greek-nomina-sacra-expander",
  title: "Greek Inscription Abbreviation Expander Nomina Sacra",
  description:
    "Expand Greek nomen sacrum abbreviations (\u0398\u03A3 \u039A\u03A3 \u0399\u03A3/\u0399\u0397\u03A3 \u03A7\u03A3 \u03A0\u039D\u0391 \u03A3\u03A9\u03A1 \u03A0\u0397\u03A1 \u039C\u0397\u03A1 \u03A5\u03A3 \u0394\u0391\u0394 \u0399\u039B\u0397\u039C \u0399\u03A3\u03A1\u039B \u0395\u039A\u039A\u039B\u03A3) to their uninflected nominative lemmas by convention, matching whole case-insensitive tokens.",
  inputs: [
    {
      description: "Greek inscription text with nomen sacrum abbreviations.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Number of nomina sacra expanded.",
      id: "nominaSacraCount",
      kind: "integer",
      label: "Nomina sacra",
    },
    {
      description: "Text with abbreviations replaced by lemmas.",
      id: "expandedText",
      kind: "string",
      label: "Expanded text",
    },
    {
      description: "Per-match notes formatted 'ABBREV -> lemma'.",
      id: "expansions",
      kind: "stringList",
      label: "Expansion list",
    },
  ],
  calculate: (input) =>
    calculateGreekNominaSacraExpander(
      input as unknown as GreekNominaSacraExpanderInput,
    ),
});

export const runGreekNominaSacraExpander = greekNominaSacraExpanderTool.execute;
export default greekNominaSacraExpanderTool;
