import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WordSpacingAdoptionRaterInput = {
  readonly century: number;
  readonly spacingConvention:
    "scriptio_continua" | "partial_word_separation" | "full_word_separation";
};

export type WordSpacingAdoptionRaterOutput = {
  readonly inTypicalPeriod: boolean;
  readonly separationScore: number;
};

const TYPICAL_BANDS: Record<
  WordSpacingAdoptionRaterInput["spacingConvention"],
  { readonly from: number; readonly to: number }
> = {
  scriptio_continua: { from: 1, to: 8 },
  partial_word_separation: { from: 6, to: 9 },
  full_word_separation: { from: 8, to: 21 },
};

const SCORES = {
  full_word_separation: 100,
  partial_word_separation: 50,
  scriptio_continua: 0,
} as const;

export const calculateWordSpacingAdoptionRater = (
  input: WordSpacingAdoptionRaterInput,
): WordSpacingAdoptionRaterOutput => {
  if (
    !Number.isSafeInteger(input.century) ||
    input.century < 1 ||
    input.century > 21
  )
    return simpleError(
      "century",
      "Century must be an integer from 1 to 21.",
      "invalid_century",
    );
  const band = TYPICAL_BANDS[input.spacingConvention];
  if (!band)
    return simpleError(
      "spacingConvention",
      "Choose a supported spacing convention.",
      "invalid_convention",
    );
  return {
    inTypicalPeriod: input.century >= band.from && input.century <= band.to,
    separationScore: SCORES[input.spacingConvention],
  };
};

export const wordSpacingAdoptionRaterExample = {
  input: { century: 10, spacingConvention: "full_word_separation" },
  output: { inTypicalPeriod: true, separationScore: 100 },
} satisfies ToolExample<
  WordSpacingAdoptionRaterInput,
  WordSpacingAdoptionRaterOutput
>;

export const wordSpacingAdoptionRaterTool = createSimpleTool({
  id: "paleography/word-spacing-adoption-rater",
  title: "Word Spacing Adoption Rater",
  description:
    "Rate an observed word-spacing convention on a fixed scale (scriptio continua 0, partial separation 50, full separation 100) and check it against the stated typical-period bands (continua to the 8th c., partial 6th-9th, full from the 8th c. onward).",
  inputs: [
    {
      description: "Century of the witness.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 21,
      minimum: 1,
    },
    {
      description: "Observed word-spacing convention.",
      enum: [
        "scriptio_continua",
        "partial_word_separation",
        "full_word_separation",
      ],
      id: "spacingConvention",
      kind: "string",
      label: "Spacing convention",
    },
  ],
  outputs: [
    {
      description: "True when the convention lies inside its stated band.",
      id: "inTypicalPeriod",
      kind: "boolean",
      label: "In typical period",
    },
    {
      description: "Fixed separation score for the convention.",
      id: "separationScore",
      kind: "number",
      label: "Separation score",
    },
  ],
  calculate: (input) =>
    calculateWordSpacingAdoptionRater({
      century: input.century as number,
      spacingConvention:
        input.spacingConvention as WordSpacingAdoptionRaterInput["spacingConvention"],
    }),
});

export const runWordSpacingAdoptionRater = wordSpacingAdoptionRaterTool.execute;
export default wordSpacingAdoptionRaterTool;
