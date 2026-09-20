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
  generatedDrawingPointSchema,
  generatedDrawingDistance,
  generatedLinearValue,
} from "../drawing-construction.js";

export type CssKeyframeMotionInput = {
  readonly waypointCount: number;
  readonly minimumX: number;
  readonly maximumX: number;
  readonly minimumY: number;
  readonly maximumY: number;
  readonly durationSeconds: number;
  readonly sampleCount: number;
  readonly seed?: number;
};
export type CssKeyframeMotionOutput = {
  readonly keyframes: readonly {
    readonly time: number;
    readonly x: number;
    readonly y: number;
  }[];
  readonly samples: readonly {
    readonly time: number;
    readonly x: number;
    readonly y: number;
  }[];
  readonly pathLengthPixels: number;
  readonly css: string;
  readonly randomness: GeneratorReplay;
};
const timedPointSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...generatedDrawingPointSchema.properties,
    time: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["time", "x", "y"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waypointCount: { type: "integer", minimum: 2, maximum: 64 },
    minimumX: { type: "integer" },
    maximumX: { type: "integer" },
    minimumY: { type: "integer" },
    maximumY: { type: "integer" },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
    sampleCount: { type: "integer", minimum: 2, maximum: 1024 },
    seed: generatorSeedSchema,
  },
  required: [
    "waypointCount",
    "minimumX",
    "maximumX",
    "minimumY",
    "maximumY",
    "durationSeconds",
    "sampleCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keyframes: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: timedPointSchema,
    },
    samples: {
      type: "array",
      minItems: 2,
      maxItems: 1024,
      items: timedPointSchema,
    },
    pathLengthPixels: { type: "number", minimum: 0 },
    css: { type: "string", minLength: 1, maxLength: 32768, format: "text/css" },
    randomness: generatorReplaySchema,
  },
  required: ["keyframes", "samples", "pathLengthPixels", "css", "randomness"],
} as const;

const isInput = (input: unknown): input is CssKeyframeMotionInput =>
  matchesModelInput(input, inputSchema);
export const calculateCssKeyframeMotion = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CssKeyframeMotionOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumX > input.maximumX || input.minimumY > input.maximumY)
      simpleError(
        "maximumX",
        "Both pixel-coordinate ranges must be ordered.",
        "invalid_coordinate_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const keyframes = Array.from({ length: input.waypointCount }, (_, i) => ({
      time:
        i === 0
          ? 0
          : i === input.waypointCount - 1
            ? 1
            : (i - 0.25 + 0.5 * random.unit()) / (input.waypointCount - 1),
      x: random.integer(input.minimumX, input.maximumX),
      y: random.integer(input.minimumY, input.maximumY),
    }));
    let segment = 0;
    const samples = Array.from({ length: input.sampleCount }, (_, i) => {
      const time = i / (input.sampleCount - 1);
      while (
        segment < keyframes.length - 2 &&
        time > keyframes[segment + 1].time
      )
        segment += 1;
      const first = keyframes[segment],
        last = keyframes[segment + 1],
        local = (time - first.time) / (last.time - first.time);
      return {
        time,
        x: generatedLinearValue(first.x, last.x, local, "maximumX"),
        y: generatedLinearValue(first.y, last.y, local, "maximumY"),
      };
    });
    let pathLengthPixels = 0;
    for (let i = 1; i < keyframes.length; i += 1)
      pathLengthPixels += generatedDrawingDistance(
        keyframes[i - 1],
        keyframes[i],
        "maximumX",
      );
    if (!Number.isFinite(pathLengthPixels))
      simpleError(
        "maximumX",
        "The accumulated path length is not representable.",
        "numeric_overflow",
      );
    const css =
      "@keyframes toolio-motion {" +
      keyframes
        .map(
          (frame) =>
            "\n  " +
            frame.time * 100 +
            "% { transform: translate(" +
            frame.x +
            "px, " +
            frame.y +
            "px); }",
        )
        .join("") +
      "\n}\n.toolio-motion { animation: toolio-motion " +
      input.durationSeconds +
      "s linear 1 both; }\n@media (prefers-reduced-motion: reduce) { .toolio-motion { animation: none; } }";
    return toolSuccess({
      keyframes,
      samples,
      pathLengthPixels,
      css,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cssKeyframeMotionExample = {
  input: {
    waypointCount: 2,
    minimumX: 0,
    maximumX: 10,
    minimumY: 0,
    maximumY: 10,
    durationSeconds: 2,
    sampleCount: 3,
    seed: 42,
  },
  output: {
    keyframes: [
      {
        time: 0,
        x: 6,
        y: 4,
      },
      {
        time: 1,
        x: 9,
        y: 7,
      },
    ],
    samples: [
      {
        time: 0,
        x: 6,
        y: 4,
      },
      {
        time: 0.5,
        x: 7.5,
        y: 5.5,
      },
      {
        time: 1,
        x: 9,
        y: 7,
      },
    ],
    pathLengthPixels: 4.242640687119286,
    css: "@keyframes toolio-motion {\n  0% { transform: translate(6px, 4px); }\n  100% { transform: translate(9px, 7px); }\n}\n.toolio-motion { animation: toolio-motion 2s linear 1 both; }\n@media (prefers-reduced-motion: reduce) { .toolio-motion { animation: none; } }",
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CssKeyframeMotionInput, CssKeyframeMotionOutput>;
export const cssKeyframeMotionTool = createModelDefinition<
  CssKeyframeMotionInput,
  CssKeyframeMotionOutput
>({
  id: "random/css-keyframe-motion",
  title: "Random CSS Keyframe Motion Generator",
  description:
    "Generate integer-pixel random waypoints on a strictly ordered jittered time grid, piecewise-linear samples, measured path length, and portable CSS translate keyframes with a reduced-motion override; no browser rendering or physical-motion model.",
  inputSchema,
  outputSchema,
  execute: calculateCssKeyframeMotion,
});
export const runCssKeyframeMotion = cssKeyframeMotionTool.execute;
export default cssKeyframeMotionTool;
