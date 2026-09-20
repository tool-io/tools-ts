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
import { calculateCubicHermite } from "../../interpolation/cubic-hermite/tool.js";
import {
  generatedDrawingPointSchema,
  generatedSvgSchema,
  generatedPolylineLength,
} from "../drawing-construction.js";

export type TerrainProfileInput = {
  readonly controlCount: number;
  readonly width: number;
  readonly minimumHeight: number;
  readonly maximumHeight: number;
  readonly tangentMode: "flat" | "cardinal";
  readonly subdivisions: number;
  readonly seed?: number;
};
export type TerrainProfileOutput = {
  readonly controls: readonly { readonly x: number; readonly y: number }[];
  readonly samples: readonly { readonly x: number; readonly y: number }[];
  readonly sampledPathLength: number;
  readonly svg: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    controlCount: { type: "integer", minimum: 2, maximum: 64 },
    width: { type: "number", exclusiveMinimum: 0 },
    minimumHeight: { type: "integer" },
    maximumHeight: { type: "integer" },
    tangentMode: { type: "string", enum: ["flat", "cardinal"] },
    subdivisions: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: [
    "controlCount",
    "width",
    "minimumHeight",
    "maximumHeight",
    "tangentMode",
    "subdivisions",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    controls: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: generatedDrawingPointSchema,
    },
    samples: {
      type: "array",
      minItems: 2,
      maxItems: 4033,
      items: generatedDrawingPointSchema,
    },
    sampledPathLength: { type: "number", minimum: 0 },
    svg: generatedSvgSchema,
    randomness: generatorReplaySchema,
  },
  required: ["controls", "samples", "sampledPathLength", "svg", "randomness"],
} as const;

const isInput = (input: unknown): input is TerrainProfileInput =>
  matchesModelInput(input, inputSchema);
export const calculateTerrainProfile = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TerrainProfileOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumHeight > input.maximumHeight)
      simpleError(
        "maximumHeight",
        "Height bounds must be ordered.",
        "invalid_height_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const controls = Array.from({ length: input.controlCount }, (_, i) => ({
      x: input.width * (i / (input.controlCount - 1)),
      y: random.integer(input.minimumHeight, input.maximumHeight),
    }));
    if (controls.some((point, i) => i > 0 && point.x <= controls[i - 1].x))
      simpleError(
        "width",
        "Control x coordinates are not distinct at floating-point precision.",
        "collapsed_coordinate_grid",
      );
    const scale = Math.max(1, ...controls.map((point) => Math.abs(point.y))),
      heights = controls.map((point) => point.y / scale);
    const tangents = heights.map((height, i) =>
      input.tangentMode === "flat"
        ? 0
        : i === 0
          ? heights[1] - height
          : i === heights.length - 1
            ? height - heights[i - 1]
            : (heights[i + 1] - heights[i - 1]) / 2,
    );
    const samples: { x: number; y: number }[] = [];
    for (let segment = 0; segment < controls.length - 1; segment += 1)
      for (let step = 0; step < input.subdivisions; step += 1) {
        const t = step / input.subdivisions;
        const y =
          step === 0
            ? controls[segment].y
            : calculateCubicHermite({
                p0: heights[segment],
                p1: heights[segment + 1],
                m0: tangents[segment],
                m1: tangents[segment + 1],
                t,
              }).value * scale;
        if (!Number.isFinite(y))
          simpleError(
            "maximumHeight",
            "The interpolated height is not representable.",
            "numeric_overflow",
          );
        samples.push({
          x: input.width * ((segment + t) / (controls.length - 1)),
          y: y === 0 ? 0 : y,
        });
      }
    samples.push({ ...controls[controls.length - 1] });
    if (samples.some((point, i) => i > 0 && point.x <= samples[i - 1].x))
      simpleError(
        "width",
        "Sample x coordinates are not distinct at floating-point precision.",
        "collapsed_coordinate_grid",
      );
    const sampledPathLength = generatedPolylineLength(samples, "width");
    const svgScale = Math.max(1, ...samples.map((point) => Math.abs(point.y))),
      normalized = samples.map((point) => point.y / svgScale);
    const low = Math.min(...normalized),
      high = Math.max(...normalized),
      range = high - low;
    const points = samples
      .map(
        (point, i) =>
          point.x / input.width +
          "," +
          (range === 0 ? 0.5 : 1 - (normalized[i] - low) / range),
      )
      .join(" ");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" preserveAspectRatio="none"><polyline points="' +
      points +
      '" fill="none" stroke="#245B36" stroke-width="0.005"/></svg>';
    return toolSuccess({
      controls,
      samples,
      sampledPathLength,
      svg,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const terrainProfileExample = {
  input: {
    controlCount: 3,
    width: 4,
    minimumHeight: 0,
    maximumHeight: 4,
    tangentMode: "flat",
    subdivisions: 2,
    seed: 42,
  },
  output: {
    controls: [
      {
        x: 0,
        y: 3,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 4,
        y: 4,
      },
    ],
    samples: [
      {
        x: 0,
        y: 3,
      },
      {
        x: 1,
        y: 2.5,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 3,
        y: 3,
      },
      {
        x: 4,
        y: 4,
      },
    ],
    sampledPathLength: 5.06449510224598,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" preserveAspectRatio="none"><polyline points="0,0.5 0.25,0.75 0.5,1 0.75,0.5 1,0" fill="none" stroke="#245B36" stroke-width="0.005"/></svg>',
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<TerrainProfileInput, TerrainProfileOutput>;
export const terrainProfileTool = createModelDefinition<
  TerrainProfileInput,
  TerrainProfileOutput
>({
  id: "random/terrain-profile",
  title: "Random Terrain Profile Generator",
  description:
    "Generate uniform-x integer height controls, flat or cardinal finite-difference Hermite tangents, a bounded sampled decorative profile, polyline length, and normalized SVG; inherited Hermite rounding is 12 significant digits on normalized heights, not physical terrain or an exact arc length.",
  inputSchema,
  outputSchema,
  execute: calculateTerrainProfile,
});
export const runTerrainProfile = terrainProfileTool.execute;
export default terrainProfileTool;
