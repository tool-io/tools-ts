import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MajusculeMinusculeBalanceCalculatorInput = {
  readonly text: string;
};

export type MajusculeMinusculeBalanceCalculatorOutput = {
  readonly majusculeCount: number;
  readonly minusculeCount: number;
  readonly majusculeSharePct: number;
  readonly balanceVerdict:
    "majuscule_dominant" | "minuscule_dominant" | "balanced";
};

const countMatches = (text: string, pattern: RegExp): number =>
  (text.match(pattern) ?? []).length;

export const calculateMajusculeMinusculeBalanceCalculator = (
  input: MajusculeMinusculeBalanceCalculatorInput,
): MajusculeMinusculeBalanceCalculatorOutput => {
  if (input.text.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const majusculeCount = countMatches(input.text, /\p{Lu}/gu);
  const minusculeCount = countMatches(input.text, /\p{Ll}/gu);
  if (majusculeCount + minusculeCount === 0)
    return simpleError(
      "text",
      "The sample contains no cased letters to balance.",
      "invalid_text",
    );
  const majusculeSharePct =
    (majusculeCount / (majusculeCount + minusculeCount)) * 100;
  return {
    balanceVerdict:
      Math.abs(majusculeSharePct - 50) <= 10
        ? "balanced"
        : majusculeSharePct > 50
          ? "majuscule_dominant"
          : "minuscule_dominant",
    majusculeCount,
    majusculeSharePct,
    minusculeCount,
  };
};

export const majusculeMinusculeBalanceCalculatorExample = {
  input: { text: "In Nomine Domini" },
  output: {
    balanceVerdict: "minuscule_dominant",
    majusculeCount: 3,
    majusculeSharePct: 21.428571428571427,
    minusculeCount: 11,
  },
} satisfies ToolExample<
  MajusculeMinusculeBalanceCalculatorInput,
  MajusculeMinusculeBalanceCalculatorOutput
>;

export const majusculeMinusculeBalanceCalculatorTool = createSimpleTool({
  id: "paleography/majuscule-minuscule-balance-calculator",
  title: "Majuscule Minuscule Balance Calculator",
  description:
    "Tally Unicode uppercase versus lowercase letters in a transcription and report the majuscule share plus a stated-heuristic balance verdict: within 10 percentage points of even is balanced, otherwise the majority case dominates.",
  inputs: [
    {
      description: "Transcription sample to scan.",
      id: "text",
      kind: "string",
      label: "Text sample",
    },
  ],
  outputs: [
    {
      description: "Occurrences of Unicode uppercase letters.",
      id: "majusculeCount",
      kind: "integer",
      label: "Majuscules",
    },
    {
      description: "Occurrences of Unicode lowercase letters.",
      id: "minusculeCount",
      kind: "integer",
      label: "Minuscules",
    },
    {
      description: "Majuscules as a percentage of all cased letters.",
      id: "majusculeSharePct",
      kind: "number",
      label: "Majuscule %",
    },
    {
      description: "Stated-heuristic balance verdict.",
      id: "balanceVerdict",
      enum: ["majuscule_dominant", "minuscule_dominant", "balanced"],
      kind: "string",
      label: "Verdict",
    },
  ],
  calculate: (input) =>
    calculateMajusculeMinusculeBalanceCalculator({
      text: input.text as string,
    }),
});

export const runMajusculeMinusculeBalanceCalculator =
  majusculeMinusculeBalanceCalculatorTool.execute;
export default majusculeMinusculeBalanceCalculatorTool;
