import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CohortCenturyTokenClassifierInput = {
  readonly text: string;
};

export type CohortCenturyTokenClassifierOutput = {
  readonly cohortMentions: number;
  readonly centuryMentions: number;
  readonly classification: "cohort" | "century" | "mixed" | "none";
};

const COHORT_PATTERN = /\bcoh(?:ors|ortium|ortes|orti|ortem|ortis)?\b\.?/gi;
const CENTURY_PATTERN = /\bcen(?:t(?:ur[a-z]*)?)?\b\.?/gi;

export const calculateCohortCenturyTokenClassifier = (
  input: CohortCenturyTokenClassifierInput,
): CohortCenturyTokenClassifierOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const cohortMentions = Array.from(input.text.matchAll(COHORT_PATTERN)).length;
  const centuryMentions = Array.from(
    input.text.matchAll(CENTURY_PATTERN),
  ).length;
  const classification =
    cohortMentions > 0 && centuryMentions > 0
      ? "mixed"
      : cohortMentions > 0
        ? "cohort"
        : centuryMentions > 0
          ? "century"
          : "none";
  return { cohortMentions, centuryMentions, classification };
};

export const cohortCenturyTokenClassifierExample = {
  input: { text: "cohors XIII urbana" },
  output: { cohortMentions: 1, centuryMentions: 0, classification: "cohort" },
} satisfies ToolExample<
  CohortCenturyTokenClassifierInput,
  CohortCenturyTokenClassifierOutput
>;

export const cohortCenturyTokenClassifierTool = createSimpleTool({
  id: "epigraphy/cohort-century-token-classifier",
  title: "Cohort Century Rank Token Classifier",
  description:
    "Classifies military unit references by counting cohort (cohors, coh.) and century (centuria, cen.) tokens.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Military unit description.",
    },
  ],
  outputs: [
    {
      id: "cohortMentions",
      kind: "integer",
      label: "Cohort mentions",
      description: "Count of cohort-type tokens.",
    },
    {
      id: "centuryMentions",
      kind: "integer",
      label: "Century mentions",
      description: "Count of century-type tokens.",
    },
    {
      id: "classification",
      kind: "string",
      enum: ["cohort", "century", "mixed", "none"],
      label: "Classification",
      description: "Dominant rank token category.",
    },
  ],
  calculate: (input) =>
    calculateCohortCenturyTokenClassifier(
      input as unknown as CohortCenturyTokenClassifierInput,
    ),
});

export const runCohortCenturyTokenClassifier =
  cohortCenturyTokenClassifierTool.execute;
export default cohortCenturyTokenClassifierTool;
