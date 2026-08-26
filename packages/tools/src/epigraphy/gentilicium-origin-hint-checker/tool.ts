import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GentiliciumOriginHintCheckerInput = {
  readonly nomen: string;
};

export type GentiliciumOriginHintCheckerOutput = {
  readonly matchedEnding: "ius" | "ia" | "none";
  readonly suggestsItalianOrigin: boolean;
};

export const calculateGentiliciumOriginHintChecker = (
  input: GentiliciumOriginHintCheckerInput,
): GentiliciumOriginHintCheckerOutput => {
  const nomen = input.nomen.trim();
  if (!nomen)
    return simpleError(
      "nomen",
      "The nomen must be a non-empty string.",
      "empty_nomen",
    );
  if (!/^\p{L}+$/u.test(nomen))
    return simpleError(
      "nomen",
      "The nomen must be a single alphabetic word.",
      "invalid_nomen",
    );
  const lowered = nomen.toLowerCase();
  if (lowered.endsWith("ius"))
    return { matchedEnding: "ius", suggestsItalianOrigin: true };
  if (lowered.endsWith("ia") && lowered.length >= 5)
    return { matchedEnding: "ia", suggestsItalianOrigin: true };
  return { matchedEnding: "none", suggestsItalianOrigin: false };
};

export const gentiliciumOriginHintCheckerExample = {
  input: { nomen: "Valerius" },
  output: { matchedEnding: "ius", suggestsItalianOrigin: true },
} satisfies ToolExample<
  GentiliciumOriginHintCheckerInput,
  GentiliciumOriginHintCheckerOutput
>;

export const gentiliciumOriginHintCheckerTool = createSimpleTool({
  id: "epigraphy/gentilicium-origin-hint-checker",
  title: "Gentilicium Italian Origin Hint Checker",
  description:
    "Apply a transparent typological heuristic in which a single-word nomen ending in -ius (masculine) or -ia with at least five letters (feminine) hints at an Italian/Latin gentilicial origin.",
  inputs: [
    {
      description: "Single-word Roman nomen gentilicium.",
      id: "nomen",
      kind: "string",
      label: "Nomen",
    },
  ],
  outputs: [
    {
      description: "Which characteristic ending was matched.",
      enum: ["ius", "ia", "none"],
      id: "matchedEnding",
      kind: "string",
      label: "Matched ending",
    },
    {
      description: "True when the heuristic suggests an Italian origin.",
      id: "suggestsItalianOrigin",
      kind: "boolean",
      label: "Italian hint",
    },
  ],
  calculate: (input) =>
    calculateGentiliciumOriginHintChecker(
      input as unknown as GentiliciumOriginHintCheckerInput,
    ),
});

export const runGentiliciumOriginHintChecker =
  gentiliciumOriginHintCheckerTool.execute;
export default gentiliciumOriginHintCheckerTool;
