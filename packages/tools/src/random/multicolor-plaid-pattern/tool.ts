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
import { calculate as midpoint } from "../../color/midpoint-color-linear-interpolation-rgb/tool.js";
import { hex as rgbHex } from "../../color/spaces.js";
import {
  paletteHexSchema,
  paletteRgb,
  drawPaletteColor,
} from "../palette-construction.js";
import {
  positiveInstanceIntegerSchema,
  exactInstanceSum,
  orderedInstanceRange,
} from "../optimization-instance-integers.js";

export type PlaidStripe = {
  readonly width: number;
  readonly colorIndex: number;
};
export type MulticolorPlaidPatternInput = {
  readonly verticalStripeCount: number;
  readonly horizontalStripeCount: number;
  readonly colorCount: number;
  readonly minimumStripeWidth: number;
  readonly maximumStripeWidth: number;
  readonly seed?: number;
};
export type MulticolorPlaidPatternOutput = {
  readonly colors: readonly string[];
  readonly verticalStripes: readonly PlaidStripe[];
  readonly horizontalStripes: readonly PlaidStripe[];
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly intersectionColors: readonly (readonly string[])[];
  readonly randomness: GeneratorReplay;
};
const stripes = {
  type: "array",
  minItems: 2,
  maxItems: 16,
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      width: positiveInstanceIntegerSchema,
      colorIndex: { type: "integer", minimum: 0, maximum: 7 },
    },
    required: ["width", "colorIndex"],
  },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalStripeCount: { type: "integer", minimum: 2, maximum: 16 },
    horizontalStripeCount: { type: "integer", minimum: 2, maximum: 16 },
    colorCount: { type: "integer", minimum: 2, maximum: 8 },
    minimumStripeWidth: positiveInstanceIntegerSchema,
    maximumStripeWidth: positiveInstanceIntegerSchema,
    seed: generatorSeedSchema,
  },
  required: [
    "verticalStripeCount",
    "horizontalStripeCount",
    "colorCount",
    "minimumStripeWidth",
    "maximumStripeWidth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colors: {
      type: "array",
      minItems: 2,
      maxItems: 8,
      items: paletteHexSchema,
    },
    verticalStripes: stripes,
    horizontalStripes: stripes,
    tileWidth: positiveInstanceIntegerSchema,
    tileHeight: positiveInstanceIntegerSchema,
    intersectionColors: {
      type: "array",
      minItems: 2,
      maxItems: 16,
      items: {
        type: "array",
        minItems: 2,
        maxItems: 16,
        items: paletteHexSchema,
      },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "colors",
    "verticalStripes",
    "horizontalStripes",
    "tileWidth",
    "tileHeight",
    "intersectionColors",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MulticolorPlaidPatternInput =>
  matchesModelInput(input, inputSchema);
export const calculateMulticolorPlaidPattern = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MulticolorPlaidPatternOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumStripeWidth,
      input.maximumStripeWidth,
      "maximumStripeWidth",
    );
    const random = createGeneratorRandom(input.seed, context),
      colors = Array.from({ length: input.colorCount }, () =>
        drawPaletteColor(random),
      );
    const stripe = (): PlaidStripe => ({
      width: random.integer(input.minimumStripeWidth, input.maximumStripeWidth),
      colorIndex: random.integer(0, input.colorCount - 1),
    });
    const verticalStripes = Array.from(
        { length: input.verticalStripeCount },
        stripe,
      ),
      horizontalStripes = Array.from(
        { length: input.horizontalStripeCount },
        stripe,
      );
    const intersectionColors = horizontalStripes.map((horizontal) =>
      verticalStripes.map((vertical) => {
        const result = midpoint({
          encodedRgbA: paletteRgb(colors[horizontal.colorIndex]),
          encodedRgbB: paletteRgb(colors[vertical.colorIndex]),
        });
        const value = result.result.encodedRgbMidpoint;
        if (
          !matchesModelInput(value, {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "number", minimum: 0, maximum: 1 },
          }) ||
          !Array.isArray(value)
        )
          throw new Error("Midpoint core violated its RGB output contract.");
        const channels: number[] = [];
        for (const channel of value) {
          if (typeof channel !== "number")
            throw new Error("Midpoint channel is not numeric.");
          channels.push(channel);
        }
        return rgbHex(channels);
      }),
    );
    return toolSuccess({
      colors,
      verticalStripes,
      horizontalStripes,
      tileWidth: exactInstanceSum(
        verticalStripes.map((stripe) => stripe.width),
        "maximumStripeWidth",
      ),
      tileHeight: exactInstanceSum(
        horizontalStripes.map((stripe) => stripe.width),
        "maximumStripeWidth",
      ),
      intersectionColors,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const multicolorPlaidPatternExample = {
  input: {
    verticalStripeCount: 3,
    horizontalStripeCount: 2,
    colorCount: 3,
    minimumStripeWidth: 1,
    maximumStripeWidth: 4,
    seed: 42,
  },
  output: {
    colors: ["#99E1EF", "#72C32B", "#DA3B32"],
    verticalStripes: [
      {
        width: 3,
        colorIndex: 0,
      },
      {
        width: 3,
        colorIndex: 0,
      },
      {
        width: 3,
        colorIndex: 2,
      },
    ],
    horizontalStripes: [
      {
        width: 2,
        colorIndex: 0,
      },
      {
        width: 4,
        colorIndex: 2,
      },
    ],
    tileWidth: 9,
    tileHeight: 6,
    intersectionColors: [
      ["#99E1EF", "#99E1EF", "#BA8E91"],
      ["#BA8E91", "#BA8E91", "#DA3B32"],
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MulticolorPlaidPatternInput,
  MulticolorPlaidPatternOutput
>;
export const multicolorPlaidPatternTool = createModelDefinition<
  MulticolorPlaidPatternInput,
  MulticolorPlaidPatternOutput
>({
  id: "random/multicolor-plaid-pattern",
  title: "Random Multicolor Plaid Pattern Generator",
  description:
    "Generate two periodic variable-width colored stripe sets and their half-and-half encoded-sRGB intersection colors through the existing midpoint core; a portable plaid tile specification, not a physical cloth simulation.",
  inputSchema,
  outputSchema,
  execute: calculateMulticolorPlaidPattern,
});
export const runMulticolorPlaidPattern = multicolorPlaidPatternTool.execute;
export default multicolorPlaidPatternTool;
