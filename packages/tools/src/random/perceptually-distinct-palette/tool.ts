import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  paletteColorsSchema,
  paletteCountSchema,
  paletteAttemptSchema,
  paletteDistanceMatrixSchema,
  paletteHexSchema,
  generateSeparatedPalette,
} from "../palette-construction.js";

export type PerceptuallyDistinctPaletteInput = {
  readonly count: number;
  readonly minimumDistance: number;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type PerceptuallyDistinctPaletteOutput = {
  readonly colors: readonly string[];
  readonly pairDistances: readonly (readonly number[])[];
  readonly minimumPairDistance: number;
  readonly attempts: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: paletteCountSchema,
    minimumDistance: { type: "number", minimum: 0 },
    maximumAttempts: paletteAttemptSchema,
    seed: generatorSeedSchema,
  },
  required: ["count", "minimumDistance", "maximumAttempts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colors: paletteColorsSchema,
    pairDistances: paletteDistanceMatrixSchema,
    minimumPairDistance: { type: "number", minimum: 0 },
    attempts: paletteAttemptSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "colors",
    "pairDistances",
    "minimumPairDistance",
    "attempts",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is PerceptuallyDistinctPaletteInput =>
  matchesModelInput(input, inputSchema);
export const calculatePerceptuallyDistinctPalette = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PerceptuallyDistinctPaletteOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const count = input.count;
    if (input.maximumAttempts < count)
      simpleError(
        "maximumAttempts",
        "At least one attempt per requested color is required.",
        "insufficient_attempt_budget",
      );
    const random = createGeneratorRandom(input.seed, context),
      palette = generateSeparatedPalette(
        count,
        input.minimumDistance,
        input.maximumAttempts,
        random,
        false,
      );

    return toolSuccess({
      ...palette,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const perceptuallyDistinctPaletteExample = {
  input: {
    count: 3,
    minimumDistance: 0.08,
    maximumAttempts: 256,
    seed: 42,
  },
  output: {
    colors: ["#99E1EF", "#72C32B", "#DA3B32"],
    pairDistances: [
      [0, 0.23223162360349597, 0.3871507399281652],
      [0.23223162360349597, 0, 0.34629109143736014],
      [0.3871507399281652, 0.34629109143736014, 0],
    ],
    minimumPairDistance: 0.23223162360349597,
    attempts: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  PerceptuallyDistinctPaletteInput,
  PerceptuallyDistinctPaletteOutput
>;
export const perceptuallyDistinctPaletteTool = createModelDefinition<
  PerceptuallyDistinctPaletteInput,
  PerceptuallyDistinctPaletteOutput
>({
  id: "random/perceptually-distinct-palette",
  title: "Random Perceptually Distinct Palette Generator",
  description:
    "Generate distinct sRGB hex colors separated by a caller OKLab Euclidean threshold using the existing hex generator, with finite rejection sampling and no perceptual guarantee for every observer.",
  inputSchema,
  outputSchema,
  execute: calculatePerceptuallyDistinctPalette,
});
export const runPerceptuallyDistinctPalette =
  perceptuallyDistinctPaletteTool.execute;
export default perceptuallyDistinctPaletteTool;
