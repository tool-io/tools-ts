import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SttlAcronymExpanderInput = {
  readonly text: string;
  readonly requireDots: boolean;
};

export type SttlAcronymExpanderOutput = {
  readonly expansion: string;
  readonly dotted: boolean;
  readonly occurrences: number;
};

export const calculateSttlAcronymExpander = (
  input: SttlAcronymExpanderInput,
): SttlAcronymExpanderOutput => {
  const pattern = input.requireDots
    ? /\bS[\u00B7.]T[\u00B7.]T[\u00B7.]L\.?\b/gi
    : /\bS[\u00B7.]?T[\u00B7.]?T[\u00B7.]?L\b/gi;
  const matches = input.text.match(pattern) ?? [];
  if (matches.length === 0)
    return { expansion: "", dotted: false, occurrences: 0 };
  return {
    expansion: "Sit Tibi Terra Levis",
    dotted: Boolean(matches[0]?.match(/[ST][\u00B7.]/i)),
    occurrences: matches.length,
  };
};

export const sttlAcronymExpanderExample = {
  input: {
    text: "Hic requiescit. S.T.T.L.",
    requireDots: true,
  },
  output: {
    expansion: "Sit Tibi Terra Levis",
    dotted: true,
    occurrences: 1,
  },
} satisfies ToolExample<SttlAcronymExpanderInput, SttlAcronymExpanderOutput>;

export const sttlAcronymExpanderTool = createSimpleTool({
  id: "epigraphy/sttl-acronym-expander",
  title: "STTL Funerary Acronym Expander",
  description:
    "Expand the funerary acronym STTL to Sit Tibi Terra Levis and report its dotted rendering.",
  inputs: [
    {
      description: "Inscription text containing the acronym.",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      description:
        "Require a period or middle dot between every pair of letters.",
      id: "requireDots",
      kind: "boolean",
      label: "Require dots",
    },
  ],
  outputs: [
    {
      description: "Expanded formula, empty when absent.",
      id: "expansion",
      kind: "string",
      label: "Expansion",
    },
    {
      description: "First occurrence rendered with interpuncts.",
      id: "dotted",
      kind: "boolean",
      label: "Dotted",
    },
    {
      description: "Occurrences found.",
      id: "occurrences",
      kind: "integer",
      label: "Occurrences",
    },
  ],
  calculate: (input) =>
    calculateSttlAcronymExpander(input as unknown as SttlAcronymExpanderInput),
});

export const runSttlAcronymExpander = sttlAcronymExpanderTool.execute;
export default sttlAcronymExpanderTool;
