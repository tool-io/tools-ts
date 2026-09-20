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
  positiveInstanceIntegerSchema as positive,
  nonnegativeInstanceIntegerSchema as nonnegative,
  exactInstanceSum,
  orderedInstanceRange,
} from "../optimization-instance-integers.js";

export type StripPackingInstanceInput = {
  readonly rectangleCount: number;
  readonly stripWidth: number;
  readonly minimumWidth: number;
  readonly maximumWidth: number;
  readonly minimumHeight: number;
  readonly maximumHeight: number;
  readonly seed?: number;
};
export type StripPackingInstanceOutput = {
  readonly stripWidth: number;
  readonly rectangles: readonly {
    readonly width: number;
    readonly height: number;
  }[];
  readonly placements: readonly {
    readonly rectangle: number;
    readonly x: number;
    readonly y: number;
  }[];
  readonly usedHeight: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rectangleCount: { type: "integer", minimum: 1, maximum: 128 },
    stripWidth: positive,
    minimumWidth: positive,
    maximumWidth: positive,
    minimumHeight: positive,
    maximumHeight: positive,
    seed: generatorSeedSchema,
  },
  required: [
    "rectangleCount",
    "stripWidth",
    "minimumWidth",
    "maximumWidth",
    "minimumHeight",
    "maximumHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stripWidth: positive,
    rectangles: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { width: positive, height: positive },
        required: ["width", "height"],
      },
    },
    placements: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          rectangle: { type: "integer", minimum: 0, maximum: 127 },
          x: nonnegative,
          y: nonnegative,
        },
        required: ["rectangle", "x", "y"],
      },
    },
    usedHeight: positive,
    randomness: generatorReplaySchema,
  },
  required: [
    "stripWidth",
    "rectangles",
    "placements",
    "usedHeight",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is StripPackingInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateStripPackingInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StripPackingInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumWidth,
      input.maximumWidth,
      "maximumWidth",
    );
    orderedInstanceRange(
      input.minimumHeight,
      input.maximumHeight,
      "maximumHeight",
    );
    if (input.maximumWidth > input.stripWidth)
      simpleError(
        "maximumWidth",
        "Every rectangle must fit the strip width without rotation.",
        "rectangle_exceeds_strip",
      );
    const random = createGeneratorRandom(input.seed, context);
    const rectangles = Array.from({ length: input.rectangleCount }, () => ({
      width: random.integer(input.minimumWidth, input.maximumWidth),
      height: random.integer(input.minimumHeight, input.maximumHeight),
    }));
    let x = 0,
      y = 0,
      shelfHeight = 0;
    const placements = rectangles.map((rectangle, index) => {
      if (rectangle.width > input.stripWidth - x) {
        y = exactInstanceSum([y, shelfHeight], "maximumHeight");
        x = 0;
        shelfHeight = 0;
      }
      const placement = { rectangle: index, x, y };
      x += rectangle.width;
      shelfHeight = Math.max(shelfHeight, rectangle.height);
      return placement;
    });
    const usedHeight = exactInstanceSum([y, shelfHeight], "maximumHeight");
    return toolSuccess({
      stripWidth: input.stripWidth,
      rectangles,
      placements,
      usedHeight,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const stripPackingInstanceExample = {
  input: {
    rectangleCount: 5,
    stripWidth: 12,
    minimumWidth: 2,
    maximumWidth: 8,
    minimumHeight: 2,
    maximumHeight: 6,
    seed: 42,
  },
  output: {
    stripWidth: 12,
    rectangles: [
      {
        width: 6,
        height: 4,
      },
      {
        width: 7,
        height: 5,
      },
      {
        width: 3,
        height: 4,
      },
      {
        width: 3,
        height: 5,
      },
      {
        width: 8,
        height: 4,
      },
    ],
    placements: [
      {
        rectangle: 0,
        x: 0,
        y: 0,
      },
      {
        rectangle: 1,
        x: 0,
        y: 4,
      },
      {
        rectangle: 2,
        x: 7,
        y: 4,
      },
      {
        rectangle: 3,
        x: 0,
        y: 9,
      },
      {
        rectangle: 4,
        x: 3,
        y: 9,
      },
    ],
    usedHeight: 14,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<StripPackingInstanceInput, StripPackingInstanceOutput>;
export const stripPackingInstanceTool = createModelDefinition<
  StripPackingInstanceInput,
  StripPackingInstanceOutput
>({
  id: "random/strip-packing-instance",
  title: "Random Two-Dimensional Strip Packing Instance Generator",
  description:
    "Generate nonrotated integer rectangles for a fixed-width, unbounded-height strip with a feasible next-fit shelf placement; no minimum-height claim.",
  inputSchema,
  outputSchema,
  execute: calculateStripPackingInstance,
});
export const runStripPackingInstance = stripPackingInstanceTool.execute;
export default stripPackingInstanceTool;
