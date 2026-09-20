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

export type CategoricalColorPaletteInput = {
  readonly categories: readonly string[];
  readonly minimumDistance: number;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type CategoricalColorPaletteOutput = {
  readonly assignments: readonly {
    readonly category: string;
    readonly color: string;
  }[];
  readonly pairDistances: readonly (readonly number[])[];
  readonly minimumPairDistance: number;
  readonly attempts: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categories: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: { type: "string", minLength: 1, maxLength: 128 },
    },
    minimumDistance: { type: "number", minimum: 0 },
    maximumAttempts: paletteAttemptSchema,
    seed: generatorSeedSchema,
  },
  required: ["categories", "minimumDistance", "maximumAttempts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignments: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string", minLength: 1, maxLength: 128 },
          color: paletteHexSchema,
        },
        required: ["category", "color"],
      },
    },
    pairDistances: paletteDistanceMatrixSchema,
    minimumPairDistance: { type: "number", minimum: 0 },
    attempts: paletteAttemptSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "assignments",
    "pairDistances",
    "minimumPairDistance",
    "attempts",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is CategoricalColorPaletteInput =>
  matchesModelInput(input, inputSchema);
export const calculateCategoricalColorPalette = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CategoricalColorPaletteOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.categories).size !== input.categories.length)
      simpleError(
        "categories",
        "Category labels must be distinct.",
        "duplicate_categories",
      );
    const count = input.categories.length;
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
    const { colors, ...metrics } = palette;
    return toolSuccess({
      ...metrics,
      assignments: input.categories.map((category, i) => ({
        category,
        color: colors[i],
      })),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const categoricalColorPaletteExample = {
  input: {
    categories: ["North", "South", "East"],
    minimumDistance: 0.08,
    maximumAttempts: 256,
    seed: 42,
  },
  output: {
    assignments: [
      {
        category: "North",
        color: "#99E1EF",
      },
      {
        category: "South",
        color: "#72C32B",
      },
      {
        category: "East",
        color: "#DA3B32",
      },
    ],
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
  CategoricalColorPaletteInput,
  CategoricalColorPaletteOutput
>;
export const categoricalColorPaletteTool = createModelDefinition<
  CategoricalColorPaletteInput,
  CategoricalColorPaletteOutput
>({
  id: "random/categorical-color-palette",
  title: "Random Categorical Color Palette Generator",
  description:
    "Assign generated distinct hex colors to distinct supplied category labels under a caller OKLab distance threshold and finite attempt limit; assignments preserve category order and do not imply universal distinguishability.",
  inputSchema,
  outputSchema,
  execute: calculateCategoricalColorPalette,
});
export const runCategoricalColorPalette = categoricalColorPaletteTool.execute;
export default categoricalColorPaletteTool;
