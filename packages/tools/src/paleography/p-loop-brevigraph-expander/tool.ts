import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PLoopBrevigraphExpanderInput = {
  readonly stemBefore?: string;
  readonly endingAfter?: string;
  readonly sense?: "per" | "par";
};

export type PLoopBrevigraphExpanderOutput = {
  readonly expandedForm: string;
  readonly appliedSense: "per" | "par";
};

const LETTERS_ONLY = /^[A-Za-z]*$/;

export const calculatePLoopBrevigraphExpander = (
  input: PLoopBrevigraphExpanderInput,
): PLoopBrevigraphExpanderOutput => {
  const stemBefore = input.stemBefore ?? "";
  const endingAfter = input.endingAfter ?? "";
  const sense = input.sense ?? "per";
  if (sense !== "per" && sense !== "par")
    return simpleError(
      "sense",
      "Sense must be either 'per' or 'par'.",
      "invalid_sense",
    );
  if (!LETTERS_ONLY.test(stemBefore))
    return simpleError(
      "stemBefore",
      "Letters before the sign must contain alphabetic characters only.",
      "invalid_stem",
    );
  if (!LETTERS_ONLY.test(endingAfter))
    return simpleError(
      "endingAfter",
      "Letters after the sign must contain alphabetic characters only.",
      "invalid_ending",
    );
  if (stemBefore.length + endingAfter.length === 0)
    return simpleError(
      "stemBefore",
      "Provide letters before or after the barred-p sign.",
      "invalid_token",
    );
  return {
    expandedForm: stemBefore + sense + endingAfter,
    appliedSense: sense,
  };
};

export const pLoopBrevigraphExpanderExample = {
  input: { stemBefore: "", endingAfter: "petuus", sense: "per" },
  output: { expandedForm: "perpetuus", appliedSense: "per" },
} satisfies ToolExample<
  PLoopBrevigraphExpanderInput,
  PLoopBrevigraphExpanderOutput
>;

export const pLoopBrevigraphExpanderTool = createSimpleTool({
  id: "paleography/p-loop-brevigraph-expander",
  title: "P-Loop Brevigraph Expander",
  description:
    "Expand the barred/looped -p- brevigraph by joining surrounding letters with your chosen attested reading of the sign, 'per' or 'par' (the sign itself is ambiguous; the sense is a declared enum choice).",
  inputs: [
    {
      default: "",
      description: "Letters written before the -p- sign.",
      id: "stemBefore",
      kind: "string",
      label: "Letters before",
    },
    {
      default: "",
      description: "Letters written after the -p- sign.",
      id: "endingAfter",
      kind: "string",
      label: "Letters after",
    },
    {
      default: "per",
      description: "Your chosen attested expansion of the sign.",
      enum: ["per", "par"],
      id: "sense",
      kind: "string",
      label: "Sense",
    },
  ],
  outputs: [
    {
      description: "Fully expanded word.",
      id: "expandedForm",
      kind: "string",
      label: "Expanded form",
    },
    {
      description: "Expansion sense actually applied.",
      id: "appliedSense",
      enum: ["per", "par"],
      kind: "string",
      label: "Applied sense",
    },
  ],
  calculate: (input) =>
    calculatePLoopBrevigraphExpander({
      stemBefore: input.stemBefore as string,
      endingAfter: input.endingAfter as string,
      sense: input.sense as PLoopBrevigraphExpanderInput["sense"],
    }),
});

export const runPLoopBrevigraphExpander = pLoopBrevigraphExpanderTool.execute;
export default pLoopBrevigraphExpanderTool;
