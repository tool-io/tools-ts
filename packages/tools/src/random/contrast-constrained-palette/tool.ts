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
  paletteHexSchema,
  paletteContrast,
  drawPaletteColor,
} from "../palette-construction.js";

export type ContrastConstrainedPaletteInput = {
  readonly count: number;
  readonly background: string;
  readonly minimumContrast: number;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type ContrastConstrainedPaletteOutput = {
  readonly colors: readonly string[];
  readonly contrastRatios: readonly number[];
  readonly attempts: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: paletteCountSchema,
    background: paletteHexSchema,
    minimumContrast: { type: "number", minimum: 1, maximum: 21 },
    maximumAttempts: paletteAttemptSchema,
    seed: generatorSeedSchema,
  },
  required: ["count", "background", "minimumContrast", "maximumAttempts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colors: paletteColorsSchema,
    contrastRatios: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: { type: "number", minimum: 1, maximum: 21 },
    },
    attempts: paletteAttemptSchema,
    randomness: generatorReplaySchema,
  },
  required: ["colors", "contrastRatios", "attempts", "randomness"],
} as const;

const isInput = (input: unknown): input is ContrastConstrainedPaletteInput =>
  matchesModelInput(input, inputSchema);
export const calculateContrastConstrainedPalette = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ContrastConstrainedPaletteOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumAttempts < input.count)
      simpleError(
        "maximumAttempts",
        "At least one attempt per requested color is required.",
        "insufficient_attempt_budget",
      );
    const random = createGeneratorRandom(input.seed, context),
      colors: string[] = [],
      contrastRatios: number[] = [];
    let attempts = 0;
    while (colors.length < input.count && attempts < input.maximumAttempts) {
      attempts += 1;
      const color = drawPaletteColor(random);
      if (colors.includes(color)) continue;
      const ratio = paletteContrast(color, input.background);
      if (ratio < input.minimumContrast) continue;
      colors.push(color);
      contrastRatios.push(ratio);
    }
    if (colors.length < input.count)
      simpleError(
        "maximumAttempts",
        "Only " +
          colors.length +
          " colors met the contrast policy before the attempt limit.",
        "palette_search_exhausted",
      );
    return toolSuccess({
      colors,
      contrastRatios,
      attempts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const contrastConstrainedPaletteExample = {
  input: {
    count: 3,
    background: "#FFFFFF",
    minimumContrast: 4.5,
    maximumAttempts: 256,
    seed: 42,
  },
  output: {
    colors: ["#DA3B32", "#327F3A", "#802FCE"],
    contrastRatios: [4.513480177756666, 4.961643701943919, 6.53047781897449],
    attempts: 16,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ContrastConstrainedPaletteInput,
  ContrastConstrainedPaletteOutput
>;
export const contrastConstrainedPaletteTool = createModelDefinition<
  ContrastConstrainedPaletteInput,
  ContrastConstrainedPaletteOutput
>({
  id: "random/contrast-constrained-palette",
  title: "Random Contrast-Constrained Palette Generator",
  description:
    "Generate distinct random hex colors meeting a caller WCAG luminance contrast ratio against one fixed opaque hex background, with a finite attempt budget; this is not a complete accessibility audit.",
  inputSchema,
  outputSchema,
  execute: calculateContrastConstrainedPalette,
});
export const runContrastConstrainedPalette =
  contrastConstrainedPaletteTool.execute;
export default contrastConstrainedPaletteTool;
