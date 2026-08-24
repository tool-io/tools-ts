import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TreimanPrestigeScoreLookupInput = {
  readonly occupation: string;
};

export type TreimanPrestigeScoreLookupOutput = {
  readonly prestigeScore: number;
};

export const treimanPrestigeScoreLookupExample = {
  input: {
    occupation: "physician",
  },
  output: {
    prestigeScore: 76,
  },
} satisfies ToolExample<
  TreimanPrestigeScoreLookupInput,
  TreimanPrestigeScoreLookupOutput
>;

const TREIMAN_SIOPS_SCORES = {
  accountant: 65,
  carpenter: 39,
  dentist: 74,
  engineer: 66,
  farmer: 41,
  janitor: 17,
  lawyer: 71,
  nurse: 62,
  physician: 76,
  police_officer: 48,
  schoolteacher: 66,
  university_teacher: 78,
  waiter: 25,
} as const;

export const calculateTreimanPrestigeScore = (
  input: TreimanPrestigeScoreLookupInput,
): TreimanPrestigeScoreLookupOutput => {
  const score = Object.prototype.hasOwnProperty.call(
    TREIMAN_SIOPS_SCORES,
    input.occupation,
  )
    ? TREIMAN_SIOPS_SCORES[
        input.occupation as keyof typeof TREIMAN_SIOPS_SCORES
      ]
    : undefined;
  if (score === undefined)
    return simpleError(
      "occupation",
      `Occupation not in the embedded SIOPS table; supported keys: ${Object.keys(TREIMAN_SIOPS_SCORES).sort().join(", ")}.`,
      "invalid_value",
    );
  return { prestigeScore: score };
};

export const treimanPrestigeScoreLookupTool = createSimpleTool({
  calculate: (input) =>
    calculateTreimanPrestigeScore({ occupation: input.occupation as string }),
  description:
    "Look up approximate Treiman SIOPS occupational prestige scores for a small set of common occupations.",
  id: "sociology/treiman-prestige-score-lookup",
  inputs: [
    {
      description:
        "Occupation key from the embedded table, for example physician or schoolteacher.",
      id: "occupation",
      kind: "string",
      label: "Occupation",
      enum: Object.keys(TREIMAN_SIOPS_SCORES),
    },
  ],
  outputs: [
    {
      description: "Standard international occupational prestige score.",
      id: "prestigeScore",
      kind: "number",
      label: "Prestige score",
    },
  ],
  title: "Treiman Occupational Prestige Score Lookup",
});
export const runTreimanPrestigeScoreLookup =
  treimanPrestigeScoreLookupTool.execute;
export default treimanPrestigeScoreLookupTool;
