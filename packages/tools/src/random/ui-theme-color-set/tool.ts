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
  paletteHexSchema,
  paletteAttemptSchema,
  paletteContrast,
  drawPaletteColor,
} from "../palette-construction.js";

export type UiThemeColorSetInput = {
  readonly background: string;
  readonly minimumTextContrast: number;
  readonly minimumAccentContrast: number;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type UiThemeColorSetOutput = {
  readonly background: string;
  readonly text: string;
  readonly accent: string;
  readonly onAccent: string;
  readonly textBackgroundContrast: number;
  readonly accentBackgroundContrast: number;
  readonly onAccentContrast: number;
  readonly attempts: number;
  readonly randomness: GeneratorReplay;
};
const contrastSchema = { type: "number", minimum: 1, maximum: 21 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    background: paletteHexSchema,
    minimumTextContrast: contrastSchema,
    minimumAccentContrast: contrastSchema,
    maximumAttempts: paletteAttemptSchema,
    seed: generatorSeedSchema,
  },
  required: [
    "background",
    "minimumTextContrast",
    "minimumAccentContrast",
    "maximumAttempts",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    background: paletteHexSchema,
    text: paletteHexSchema,
    accent: paletteHexSchema,
    onAccent: paletteHexSchema,
    textBackgroundContrast: contrastSchema,
    accentBackgroundContrast: contrastSchema,
    onAccentContrast: contrastSchema,
    attempts: { type: "integer", minimum: 1, maximum: 8192 },
    randomness: generatorReplaySchema,
  },
  required: [
    "background",
    "text",
    "accent",
    "onAccent",
    "textBackgroundContrast",
    "accentBackgroundContrast",
    "onAccentContrast",
    "attempts",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is UiThemeColorSetInput =>
  matchesModelInput(input, inputSchema);
export const calculateUiThemeColorSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UiThemeColorSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const textBlack = paletteContrast("#000000", input.background),
      textWhite = paletteContrast("#FFFFFF", input.background);
    const text = textBlack >= textWhite ? "#000000" : "#FFFFFF",
      textBackgroundContrast = Math.max(textBlack, textWhite);
    if (textBackgroundContrast < input.minimumTextContrast)
      simpleError(
        "minimumTextContrast",
        "Neither black nor white meets the supplied background text policy.",
        "infeasible_text_contrast",
      );
    const random = createGeneratorRandom(input.seed, context);
    for (let attempts = 1; attempts <= input.maximumAttempts; attempts += 1) {
      const accent = drawPaletteColor(random),
        accentBackgroundContrast = paletteContrast(accent, input.background);
      const black = paletteContrast("#000000", accent),
        white = paletteContrast("#FFFFFF", accent);
      const onAccent = black >= white ? "#000000" : "#FFFFFF",
        onAccentContrast = Math.max(black, white);
      if (
        accentBackgroundContrast >= input.minimumAccentContrast &&
        onAccentContrast >= input.minimumTextContrast
      )
        return toolSuccess({
          background: input.background.toUpperCase(),
          text,
          accent,
          onAccent,
          textBackgroundContrast,
          accentBackgroundContrast,
          onAccentContrast,
          attempts,
          randomness: generatorReplay(input.seed, context),
        });
    }
    return simpleError(
      "maximumAttempts",
      "No generated accent met both contrast policies before the attempt limit.",
      "palette_search_exhausted",
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const uiThemeColorSetExample = {
  input: {
    background: "#FFFFFF",
    minimumTextContrast: 4.5,
    minimumAccentContrast: 3,
    maximumAttempts: 256,
    seed: 42,
  },
  output: {
    background: "#FFFFFF",
    text: "#000000",
    accent: "#DA3B32",
    onAccent: "#000000",
    textBackgroundContrast: 21,
    accentBackgroundContrast: 4.513480177756666,
    onAccentContrast: 4.652728974748179,
    attempts: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<UiThemeColorSetInput, UiThemeColorSetOutput>;
export const uiThemeColorSetTool = createModelDefinition<
  UiThemeColorSetInput,
  UiThemeColorSetOutput
>({
  id: "random/ui-theme-color-set",
  title: "Random UI Theme Color Set Generator",
  description:
    "Generate a random accent for a supplied opaque background under explicit contrast policies, select black/white text roles by the imported luminance contrast calculation and return role checks; not a complete theme or accessibility certification.",
  inputSchema,
  outputSchema,
  execute: calculateUiThemeColorSet,
});
export const runUiThemeColorSet = uiThemeColorSetTool.execute;
export default uiThemeColorSetTool;
