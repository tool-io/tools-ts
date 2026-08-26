import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisManibusPresenceTagGeneratorInput = {
  readonly text: string;
};

export type DisManibusPresenceTagGeneratorOutput = {
  readonly present: boolean;
  readonly occurrenceCount: number;
  readonly tagString: string;
  readonly matchText: string;
};

const FORMULA = /\bD(?:IS)?\s?M(?:ANIB(?:[UV]S)?)?(?:\s?S)?\b/g;

export const calculateDisManibusPresenceTagGenerator = (
  input: DisManibusPresenceTagGeneratorInput,
): DisManibusPresenceTagGeneratorOutput => {
  if (!input.text.trim())
    return simpleError("text", "Inscription text is required.", "invalid_text");
  const normalized = input.text.replace(/\u00B7/g, " ").toUpperCase();
  const matches = [...normalized.matchAll(FORMULA)];
  return {
    present: matches.length > 0,
    occurrenceCount: matches.length,
    tagString: matches.length > 0 ? "formula:dis-manibus" : "formula:none",
    matchText: matches.length > 0 ? matches[0][0].trim() : "",
  };
};

export const disManibusPresenceTagGeneratorExample = {
  input: { text: "DIS MANIBVS SACRVM MEMORIAE" },
  output: {
    present: true,
    occurrenceCount: 1,
    tagString: "formula:dis-manibus",
    matchText: "DIS MANIBVS",
  },
} satisfies ToolExample<
  DisManibusPresenceTagGeneratorInput,
  DisManibusPresenceTagGeneratorOutput
>;

export const disManibusPresenceTagGeneratorTool = createSimpleTool({
  id: "epigraphy/dis-manibus-presence-tag-generator",
  title: "Dis Manibus Formula Presence Frequency Tag Generator",
  description:
    "Tag an inscription with a presence label for the Dis Manibus formula family (D M, DM, D M S, DIS MANIB- in U/V spellings), reporting occurrence frequency, a 'formula:dis-manibus'/'formula:none' tag, and the first matched form as normalized uppercase.",
  inputs: [
    {
      description: "Inscription text (interpuncts are treated as spaces).",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "True when any Dis Manibus variant occurs.",
      id: "present",
      kind: "boolean",
      label: "Present",
    },
    {
      description: "Number of variant occurrences.",
      id: "occurrenceCount",
      kind: "integer",
      label: "Occurrences",
    },
    {
      description: "Tag string 'formula:dis-manibus' or 'formula:none'.",
      id: "tagString",
      kind: "string",
      label: "Tag",
    },
    {
      description: "First matched formula text (empty when absent).",
      id: "matchText",
      kind: "string",
      label: "Match text",
    },
  ],
  calculate: (input) =>
    calculateDisManibusPresenceTagGenerator(
      input as unknown as DisManibusPresenceTagGeneratorInput,
    ),
});

export const runDisManibusPresenceTagGenerator =
  disManibusPresenceTagGeneratorTool.execute;
export default disManibusPresenceTagGeneratorTool;
