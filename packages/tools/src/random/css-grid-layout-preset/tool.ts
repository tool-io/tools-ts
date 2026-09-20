import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateGridRepeatCountFromGapWidth } from "../../css/grid-repeat-count-from-gap-width/tool.js";
import { calculate as calculateFr } from "../../css/grid-fr-unit-free-space-share/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  coreOutput,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type CssGridLayoutPresetInput = {
  readonly containerWidthPx: NumericRange;
  readonly gapPx: NumericRange;
  readonly minimumTrackPx: NumericRange;
  readonly trackWeight: NumericRange;
  readonly seed?: number;
};
export type CssGridLayoutPresetOutput = {
  readonly containerWidthPx: number;
  readonly gapPx: number;
  readonly minimumTrackPx: number;
  readonly fitCount: number;
  readonly trackWeights: readonly number[];
  readonly initialTrackSharesPx: readonly number[];
  readonly unallocatedFreeSpacePx: number;
  readonly oneTrackOverflows: boolean;
  readonly css: string;
  readonly randomness: GeneratorReplay;
};
const positiveInteger = { type: "integer", minimum: 1 } as const;
export const inputSchema = objectSchema(
  {
    containerWidthPx: rangeSchema(positiveInteger),
    gapPx: rangeSchema({ type: "integer", minimum: 0 }),
    minimumTrackPx: rangeSchema(positiveInteger),
    trackWeight: rangeSchema(positiveInteger),
    seed: generatorSeedSchema,
  },
  ["containerWidthPx", "gapPx", "minimumTrackPx", "trackWeight"],
);
export const outputSchema = objectSchema({
  containerWidthPx: numberSchema,
  gapPx: numberSchema,
  minimumTrackPx: numberSchema,
  fitCount: countSchema(32, 0),
  trackWeights: arraySchema(positiveInteger, 32, 1),
  initialTrackSharesPx: arraySchema(numberSchema, 32, 1),
  unallocatedFreeSpacePx: numberSchema,
  oneTrackOverflows: { type: "boolean" },
  css: { type: "string", maxLength: 2048 },
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is CssGridLayoutPresetInput =>
  matchesModelInput(value, inputSchema);
export const calculateCssGridLayoutPreset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CssGridLayoutPresetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const field of [
      "containerWidthPx",
      "gapPx",
      "minimumTrackPx",
      "trackWeight",
    ] as const)
      orderedRange(input[field], field);
    const random = createGeneratorRandom(input.seed, context);
    const containerWidthPx = drawInteger(
        input.containerWidthPx,
        random,
        "containerWidthPx",
      ),
      gapPx = drawInteger(input.gapPx, random, "gapPx"),
      minimumTrackPx = drawInteger(
        input.minimumTrackPx,
        random,
        "minimumTrackPx",
      );
    const fitted = coreOutput(
      calculateGridRepeatCountFromGapWidth({
        containerWidth: containerWidthPx,
        trackWidth: minimumTrackPx,
        gap: gapPx,
      }),
      {
        containerWidth: "containerWidthPx",
        trackWidth: "minimumTrackPx",
        gap: "gapPx",
      },
    );
    if (fitted.repeatCount > 32)
      simpleError(
        "minimumTrackPx",
        "Generated preset exceeds 32 tracks.",
        "track_resource_limit",
      );
    const trackWeights = Array.from({ length: fitted.repeatCount }, () =>
      drawInteger(input.trackWeight, random, "trackWeight"),
    );
    const shares = calculateFr({
      definiteContainerPx: containerWidthPx,
      nonFlexibleTrackTotalPx: 0,
      explicitGapTotalPx: gapPx * (trackWeights.length - 1),
      flexTrackFactors: trackWeights,
    });
    const css =
      "display: grid; width: " +
      containerWidthPx +
      "px; gap: " +
      gapPx +
      "px; grid-template-columns: " +
      trackWeights.map((w) => "minmax(0, " + w + "fr)").join(" ") +
      ";";
    return toolSuccess(
      ensureOutput(
        {
          containerWidthPx,
          gapPx,
          minimumTrackPx,
          fitCount: fitted.fitCount,
          trackWeights,
          initialTrackSharesPx: shares.initialFrSharesPx,
          unallocatedFreeSpacePx: shares.unallocatedFreeSpacePx,
          oneTrackOverflows: fitted.oneTrackOverflows,
          css,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cssGridLayoutPresetExample = {
  input: {
    containerWidthPx: {
      minimum: 640,
      maximum: 640,
    },
    gapPx: {
      minimum: 20,
      maximum: 20,
    },
    minimumTrackPx: {
      minimum: 200,
      maximum: 200,
    },
    trackWeight: {
      minimum: 1,
      maximum: 3,
    },
    seed: 42,
  },
  output: {
    containerWidthPx: 640,
    gapPx: 20,
    minimumTrackPx: 200,
    fitCount: 3,
    trackWeights: [3, 1, 2],
    initialTrackSharesPx: [300, 100, 200],
    unallocatedFreeSpacePx: 0,
    oneTrackOverflows: false,
    css: "display: grid; width: 640px; gap: 20px; grid-template-columns: minmax(0, 3fr) minmax(0, 1fr) minmax(0, 2fr);",
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CssGridLayoutPresetInput, CssGridLayoutPresetOutput>;
export const cssGridLayoutPresetTool = createModelDefinition<
  CssGridLayoutPresetInput,
  CssGridLayoutPresetOutput
>({
  id: "random/css-grid-layout-preset",
  title: "Random CSS Grid Layout Preset Generator",
  description:
    "Generate a definite-width grid preset with delegated fixed-track fit counts and initial fr shares, excluding intrinsic browser sizing.",
  inputSchema,
  outputSchema,
  execute: calculateCssGridLayoutPreset,
});
export const runCssGridLayoutPreset = cssGridLayoutPresetTool.execute;
export default cssGridLayoutPresetTool;
