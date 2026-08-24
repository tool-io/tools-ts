import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GreekUncialMinusculeCheckerInput = {
  readonly century: number;
};

export type GreekUncialMinusculeCheckerOutput = {
  readonly dominantHand:
    "uncial_dominant" | "transitional_coexistence" | "minuscule_dominant";
  readonly coexistenceCentury: boolean;
};

export const calculateGreekUncialMinusculeChecker = (
  input: GreekUncialMinusculeCheckerInput,
): GreekUncialMinusculeCheckerOutput => {
  if (!(
    Number.isSafeInteger(input.century) &&
    input.century >= 1 &&
    input.century <= 15
  ))
    return simpleError(
      "century",
      "Century must be an integer from 1 through 15.",
      "invalid_century",
    );
  const century = input.century;
  const dominantHand =
    century <= 8
      ? "uncial_dominant"
      : century === 9
        ? "transitional_coexistence"
        : "minuscule_dominant";
  return { dominantHand, coexistenceCentury: century === 9 };
};

export const greekUncialMinusculeCheckerExample = {
  input: { century: 9 },
  output: {
    dominantHand: "transitional_coexistence",
    coexistenceCentury: true,
  },
} satisfies ToolExample<
  GreekUncialMinusculeCheckerInput,
  GreekUncialMinusculeCheckerOutput
>;

export const greekUncialMinusculeCheckerTool = createSimpleTool({
  id: "paleography/greek-uncial-minuscule-checker",
  title: "Greek Uncial / Minuscule Checker",
  description:
    "Check which Greek book hand dominates a century on the documented band stated plainly: uncial (biblical majuscule) dominates to the eighth century, both hands coexist through the ninth-century transition to minuscule, and minuscule dominates from the tenth century onward.",
  inputs: [
    {
      description: "Century number of the witness.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 15,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Dominant Greek book hand for the given century.",
      id: "dominantHand",
      enum: [
        "uncial_dominant",
        "transitional_coexistence",
        "minuscule_dominant",
      ],
      kind: "string",
      label: "Dominant hand",
    },
    {
      description: "True for the ninth-century coexistence window.",
      id: "coexistenceCentury",
      kind: "boolean",
      label: "Coexistence century",
    },
  ],
  calculate: (input) =>
    calculateGreekUncialMinusculeChecker({
      century: input.century as number,
    }),
});

export const runGreekUncialMinusculeChecker =
  greekUncialMinusculeCheckerTool.execute;
export default greekUncialMinusculeCheckerTool;
