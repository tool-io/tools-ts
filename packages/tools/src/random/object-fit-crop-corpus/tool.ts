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
import { calculateObjectFitContainLetterboxDims } from "../../css/object-fit-contain-letterbox-dims/tool.js";
import { calculateObjectFitCoverScaleFactor } from "../../css/object-fit-cover-scale-factor/tool.js";
import { calculate as objectPosition } from "../../css/object-position-focal-percent/tool.js";
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
export type ObjectFitCropCorpusInput = {
  readonly count: number;
  readonly imageWidthPx: NumericRange;
  readonly imageHeightPx: NumericRange;
  readonly boxWidthPx: NumericRange;
  readonly boxHeightPx: NumericRange;
  readonly xPercent: NumericRange;
  readonly yPercent: NumericRange;
  readonly positionMode: "alignment" | "source-focal";
  readonly seed?: number;
};
export type ObjectFitCrop = {
  readonly mode: "contain" | "cover";
  readonly scale: number;
  readonly renderedWidthPx: number;
  readonly renderedHeightPx: number;
  readonly alignmentXPercent: number;
  readonly alignmentYPercent: number;
  readonly offsetXPx: number;
  readonly offsetYPx: number;
  readonly sourceCrop: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
};
export type ObjectFitCropCorpusOutput = {
  readonly cases: readonly {
    readonly imageWidthPx: number;
    readonly imageHeightPx: number;
    readonly boxWidthPx: number;
    readonly boxHeightPx: number;
    readonly inputXPercent: number;
    readonly inputYPercent: number;
    readonly fits: readonly ObjectFitCrop[];
  }[];
  readonly randomness: GeneratorReplay;
};
const pixels = rangeSchema({ type: "integer", minimum: 1 }),
  percent = rangeSchema({ type: "integer", minimum: 0, maximum: 100 });
const fit = objectSchema({
  mode: { type: "string", enum: ["contain", "cover"] },
  scale: numberSchema,
  renderedWidthPx: numberSchema,
  renderedHeightPx: numberSchema,
  alignmentXPercent: numberSchema,
  alignmentYPercent: numberSchema,
  offsetXPx: numberSchema,
  offsetYPx: numberSchema,
  sourceCrop: objectSchema({
    x: numberSchema,
    y: numberSchema,
    width: numberSchema,
    height: numberSchema,
  }),
});
export const inputSchema = objectSchema(
  {
    count: countSchema(64),
    imageWidthPx: pixels,
    imageHeightPx: pixels,
    boxWidthPx: pixels,
    boxHeightPx: pixels,
    xPercent: percent,
    yPercent: percent,
    positionMode: { type: "string", enum: ["alignment", "source-focal"] },
    seed: generatorSeedSchema,
  },
  [
    "count",
    "imageWidthPx",
    "imageHeightPx",
    "boxWidthPx",
    "boxHeightPx",
    "xPercent",
    "yPercent",
    "positionMode",
  ],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      imageWidthPx: numberSchema,
      imageHeightPx: numberSchema,
      boxWidthPx: numberSchema,
      boxHeightPx: numberSchema,
      inputXPercent: numberSchema,
      inputYPercent: numberSchema,
      fits: arraySchema(fit, 2, 2),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ObjectFitCropCorpusInput =>
  matchesModelInput(value, inputSchema);
export const calculateObjectFitCropCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ObjectFitCropCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const field of [
      "imageWidthPx",
      "imageHeightPx",
      "boxWidthPx",
      "boxHeightPx",
      "xPercent",
      "yPercent",
    ] as const)
      orderedRange(input[field], field);
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const imageWidthPx = drawInteger(
          input.imageWidthPx,
          random,
          "imageWidthPx",
        ),
        imageHeightPx = drawInteger(
          input.imageHeightPx,
          random,
          "imageHeightPx",
        ),
        boxWidthPx = drawInteger(input.boxWidthPx, random, "boxWidthPx"),
        boxHeightPx = drawInteger(input.boxHeightPx, random, "boxHeightPx"),
        inputXPercent = drawInteger(input.xPercent, random, "xPercent"),
        inputYPercent = drawInteger(input.yPercent, random, "yPercent");
      const dimensions = {
        imageWidth: imageWidthPx,
        imageHeight: imageHeightPx,
        boxWidth: boxWidthPx,
        boxHeight: boxHeightPx,
      };
      const fieldMap = {
        imageWidth: "imageWidthPx",
        imageHeight: "imageHeightPx",
        boxWidth: "boxWidthPx",
        boxHeight: "boxHeightPx",
      };
      const contain = coreOutput(
          calculateObjectFitContainLetterboxDims(dimensions),
          fieldMap,
        ),
        cover = coreOutput(
          calculateObjectFitCoverScaleFactor(dimensions),
          fieldMap,
        );
      const fits = (["contain", "cover"] as const).map((mode) => {
        const sized = mode === "contain" ? contain : cover,
          renderedWidthPx = sized.renderedWidth,
          renderedHeightPx = sized.renderedHeight;
        const align = (box: number, rendered: number, focal: number): number =>
          box === rendered
            ? 50
            : Math.max(
                0,
                Math.min(
                  100,
                  ((box / 2 - rendered * (focal / 100)) / (box - rendered)) *
                    100,
                ),
              );
        const alignmentXPercent =
            input.positionMode === "alignment"
              ? inputXPercent
              : align(boxWidthPx, renderedWidthPx, inputXPercent),
          alignmentYPercent =
            input.positionMode === "alignment"
              ? inputYPercent
              : align(boxHeightPx, renderedHeightPx, inputYPercent);
        const offsets = objectPosition({
          contentWidthPx: boxWidthPx,
          contentHeightPx: boxHeightPx,
          renderedObjectWidthPx: renderedWidthPx,
          renderedObjectHeightPx: renderedHeightPx,
          positionXPercent: alignmentXPercent,
          positionYPercent: alignmentYPercent,
        });
        const sourceCrop = {
          x: Math.max(0, -offsets.objectOffsetX / sized.scale),
          y: Math.max(0, -offsets.objectOffsetY / sized.scale),
          width: Math.min(imageWidthPx, boxWidthPx / sized.scale),
          height: Math.min(imageHeightPx, boxHeightPx / sized.scale),
        };
        return {
          mode,
          scale: sized.scale,
          renderedWidthPx,
          renderedHeightPx,
          alignmentXPercent,
          alignmentYPercent,
          offsetXPx: offsets.objectOffsetX,
          offsetYPx: offsets.objectOffsetY,
          sourceCrop,
        };
      });
      return {
        imageWidthPx,
        imageHeightPx,
        boxWidthPx,
        boxHeightPx,
        inputXPercent,
        inputYPercent,
        fits,
      };
    });
    return toolSuccess(
      ensureOutput(
        { cases, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const objectFitCropCorpusExample = {
  input: {
    count: 1,
    imageWidthPx: {
      minimum: 400,
      maximum: 400,
    },
    imageHeightPx: {
      minimum: 200,
      maximum: 200,
    },
    boxWidthPx: {
      minimum: 100,
      maximum: 100,
    },
    boxHeightPx: {
      minimum: 100,
      maximum: 100,
    },
    xPercent: {
      minimum: 25,
      maximum: 25,
    },
    yPercent: {
      minimum: 50,
      maximum: 50,
    },
    positionMode: "alignment",
    seed: 42,
  },
  output: {
    cases: [
      {
        imageWidthPx: 400,
        imageHeightPx: 200,
        boxWidthPx: 100,
        boxHeightPx: 100,
        inputXPercent: 25,
        inputYPercent: 50,
        fits: [
          {
            mode: "contain",
            scale: 0.25,
            renderedWidthPx: 100,
            renderedHeightPx: 50,
            alignmentXPercent: 25,
            alignmentYPercent: 50,
            offsetXPx: 0,
            offsetYPx: 25,
            sourceCrop: {
              x: 0,
              y: 0,
              width: 400,
              height: 200,
            },
          },
          {
            mode: "cover",
            scale: 0.5,
            renderedWidthPx: 200,
            renderedHeightPx: 100,
            alignmentXPercent: 25,
            alignmentYPercent: 50,
            offsetXPx: -25,
            offsetYPx: 0,
            sourceCrop: {
              x: 50,
              y: 0,
              width: 200,
              height: 200,
            },
          },
        ],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<ObjectFitCropCorpusInput, ObjectFitCropCorpusOutput>;
export const objectFitCropCorpusTool = createModelDefinition<
  ObjectFitCropCorpusInput,
  ObjectFitCropCorpusOutput
>({
  id: "random/object-fit-crop-corpus",
  title: "Random Object-Fit Crop Corpus Generator",
  description:
    "Generate image and box sizes with delegated contain/cover geometry and reconstruct source crops from alignment or clamped source focal coordinates.",
  inputSchema,
  outputSchema,
  execute: calculateObjectFitCropCorpus,
});
export const runObjectFitCropCorpus = objectFitCropCorpusTool.execute;
export default objectFitCropCorpusTool;
