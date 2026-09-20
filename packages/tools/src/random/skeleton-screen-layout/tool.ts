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
import { calculateRectangleArea } from "../../geometry/rectangle-area/tool.js";
import {
  calculateBoundingBox,
  type BoundingBoxOutput,
} from "../../geometry/bounding-box/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  requireDistinct,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type SkeletonSlot = {
  readonly id: string;
  readonly kind: "text" | "avatar" | "image";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};
export type SkeletonScreenLayoutInput = {
  readonly canvasWidthPx: number;
  readonly canvasHeightPx: number;
  readonly slots: readonly SkeletonSlot[];
  readonly textLines: NumericRange;
  readonly lineHeightPx: number;
  readonly lineGapPx: number;
  readonly textWidthPercent: NumericRange;
  readonly seed?: number;
};
export type SkeletonScreenLayoutOutput = {
  readonly rectangles: readonly {
    readonly slotId: string;
    readonly kind: "text" | "avatar" | "image";
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly areaPxSquared: number;
  }[];
  readonly bounds: BoundingBoxOutput;
  readonly randomness: GeneratorReplay;
};
const positive = { type: "number", exclusiveMinimum: 0 } as const,
  nonnegative = { type: "number", minimum: 0 } as const;
const slotSchema = objectSchema({
  id: { type: "string", minLength: 1, maxLength: 64 },
  kind: { type: "string", enum: ["text", "avatar", "image"] },
  x: nonnegative,
  y: nonnegative,
  width: positive,
  height: positive,
});
export const inputSchema = objectSchema(
  {
    canvasWidthPx: positive,
    canvasHeightPx: positive,
    slots: arraySchema(slotSchema, 32, 1),
    textLines: rangeSchema(countSchema(16)),
    lineHeightPx: positive,
    lineGapPx: nonnegative,
    textWidthPercent: rangeSchema({
      type: "integer",
      minimum: 1,
      maximum: 100,
    }),
    seed: generatorSeedSchema,
  },
  [
    "canvasWidthPx",
    "canvasHeightPx",
    "slots",
    "textLines",
    "lineHeightPx",
    "lineGapPx",
    "textWidthPercent",
  ],
);
export const outputSchema = objectSchema({
  rectangles: arraySchema(
    objectSchema({
      slotId: { type: "string" },
      kind: { type: "string", enum: ["text", "avatar", "image"] },
      x: nonnegative,
      y: nonnegative,
      width: positive,
      height: positive,
      areaPxSquared: positive,
    }),
    256,
    1,
  ),
  bounds: objectSchema({
    minX: numberSchema,
    minY: numberSchema,
    maxX: numberSchema,
    maxY: numberSchema,
    width: numberSchema,
    height: numberSchema,
  }),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SkeletonScreenLayoutInput =>
  matchesModelInput(value, inputSchema);
export const calculateSkeletonScreenLayout = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SkeletonScreenLayoutOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.textLines, "textLines");
    orderedRange(input.textWidthPercent, "textWidthPercent");
    requireDistinct(
      input.slots.map((x) => x.id),
      "slots",
    );
    for (let i = 0; i < input.slots.length; i++) {
      const a = input.slots[i];
      if (
        a.x + a.width > input.canvasWidthPx ||
        a.y + a.height > input.canvasHeightPx
      )
        simpleError(
          "slots." + i,
          "Component slot exceeds the canvas.",
          "slot_out_of_bounds",
        );
      for (let j = 0; j < i; j++) {
        const b = input.slots[j];
        if (
          a.x < b.x + b.width &&
          b.x < a.x + a.width &&
          a.y < b.y + b.height &&
          b.y < a.y + a.height
        )
          simpleError(
            "slots." + i,
            "Component slots must not overlap.",
            "overlapping_slots",
          );
      }
      if (
        a.kind === "text" &&
        input.textLines.maximum * input.lineHeightPx +
          (input.textLines.maximum - 1) * input.lineGapPx >
          a.height
      )
        simpleError(
          "textLines",
          "Maximum line count must fit every text slot.",
          "infeasible_text_lines",
        );
    }
    if (
      input.slots.reduce(
        (s, x) => s + (x.kind === "text" ? input.textLines.maximum : 1),
        0,
      ) > 256
    )
      simpleError(
        "slots",
        "Generated rectangles exceed the 256-rectangle budget.",
        "rectangle_resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      rectangles: SkeletonScreenLayoutOutput["rectangles"][number][] = [];
    for (const slot of input.slots) {
      if (slot.kind === "text") {
        const lines = drawInteger(input.textLines, random, "textLines");
        for (let i = 0; i < lines; i++) {
          const percent = drawInteger(
              input.textWidthPercent,
              random,
              "textWidthPercent",
            ),
            product = slot.width * percent,
            width = Number.isFinite(product)
              ? product / 100
              : slot.width * (percent / 100);
          if (width <= 0)
            simpleError(
              "textWidthPercent",
              "Positive text width underflowed representation.",
              "numeric_range",
            );
          rectangles.push({
            slotId: slot.id,
            kind: "text",
            x: slot.x,
            y: slot.y + i * (input.lineHeightPx + input.lineGapPx),
            width,
            height: input.lineHeightPx,
            areaPxSquared: calculateRectangleArea({
              width,
              height: input.lineHeightPx,
            }).area,
          });
        }
      } else {
        random.unit();
        const width =
            slot.kind === "avatar"
              ? Math.min(slot.width, slot.height)
              : slot.width,
          height = slot.kind === "avatar" ? width : slot.height;
        rectangles.push({
          slotId: slot.id,
          kind: slot.kind,
          x: slot.x,
          y: slot.y,
          width,
          height,
          areaPxSquared: calculateRectangleArea({ width, height }).area,
        });
      }
    }
    const points = rectangles.flatMap((r) => [
      [r.x, r.y],
      [r.x + r.width, r.y + r.height],
    ]);
    return toolSuccess(
      ensureOutput(
        {
          rectangles,
          bounds: calculateBoundingBox({ points }),
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const skeletonScreenLayoutExample = {
  input: {
    canvasWidthPx: 200,
    canvasHeightPx: 60,
    slots: [
      {
        id: "title",
        kind: "text",
        x: 0,
        y: 0,
        width: 120,
        height: 40,
      },
      {
        id: "avatar",
        kind: "avatar",
        x: 140,
        y: 0,
        width: 40,
        height: 40,
      },
    ],
    textLines: {
      minimum: 2,
      maximum: 2,
    },
    lineHeightPx: 10,
    lineGapPx: 5,
    textWidthPercent: {
      minimum: 50,
      maximum: 100,
    },
    seed: 42,
  },
  output: {
    rectangles: [
      {
        slotId: "title",
        kind: "text",
        x: 0,
        y: 0,
        width: 86.4,
        height: 10,
        areaPxSquared: 864,
      },
      {
        slotId: "title",
        kind: "text",
        x: 0,
        y: 15,
        width: 111.6,
        height: 10,
        areaPxSquared: 1116,
      },
      {
        slotId: "avatar",
        kind: "avatar",
        x: 140,
        y: 0,
        width: 40,
        height: 40,
        areaPxSquared: 1600,
      },
    ],
    bounds: {
      minX: 0,
      minY: 0,
      maxX: 180,
      maxY: 40,
      width: 180,
      height: 40,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<SkeletonScreenLayoutInput, SkeletonScreenLayoutOutput>;
export const skeletonScreenLayoutTool = createModelDefinition<
  SkeletonScreenLayoutInput,
  SkeletonScreenLayoutOutput
>({
  id: "random/skeleton-screen-layout",
  title: "Random Skeleton Screen Layout Generator",
  description:
    "Generate static placeholder rectangles inside supplied nonoverlapping component slots with delegated area and bounding-box evidence.",
  inputSchema,
  outputSchema,
  execute: calculateSkeletonScreenLayout,
});
export const runSkeletonScreenLayout = skeletonScreenLayoutTool.execute;
export default skeletonScreenLayoutTool;
