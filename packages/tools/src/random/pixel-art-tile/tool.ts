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
  paletteAttemptSchema,
  generateSeparatedPalette,
} from "../palette-construction.js";
import {
  pixelGridSchema,
  symmetrizePixelGrid,
  pixelGridSvg,
  type PixelSymmetry,
} from "../pixel-grid-construction.js";

export type PixelArtTileInput = {
  readonly size: number;
  readonly colorCount: number;
  readonly symmetry: PixelSymmetry;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type PixelArtTileOutput = {
  readonly colors: readonly string[];
  readonly cells: readonly (readonly number[])[];
  readonly svg: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    size: { type: "integer", minimum: 2, maximum: 32 },
    colorCount: { type: "integer", minimum: 2, maximum: 8 },
    symmetry: {
      type: "string",
      enum: ["none", "left-right", "top-bottom", "both", "quarter-turn"],
    },
    maximumAttempts: paletteAttemptSchema,
    seed: generatorSeedSchema,
  },
  required: ["size", "colorCount", "symmetry", "maximumAttempts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colors: { ...paletteColorsSchema, maxItems: 8 },
    cells: pixelGridSchema,
    svg: {
      type: "string",
      minLength: 1,
      maxLength: 131072,
      format: "image/svg+xml",
    },
    randomness: generatorReplaySchema,
  },
  required: ["colors", "cells", "svg", "randomness"],
} as const;

const isInput = (input: unknown): input is PixelArtTileInput =>
  matchesModelInput(input, inputSchema);
export const calculatePixelArtTile = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PixelArtTileOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumAttempts < input.colorCount)
      simpleError(
        "maximumAttempts",
        "At least one attempt per requested palette color is required.",
        "insufficient_attempt_budget",
      );
    const random = createGeneratorRandom(input.seed, context),
      colors = generateSeparatedPalette(
        input.colorCount,
        0,
        input.maximumAttempts,
        random,
        false,
      ).colors;
    const source = Array.from({ length: input.size }, () =>
      Array.from({ length: input.size }, () =>
        random.integer(0, input.colorCount - 1),
      ),
    );
    const cells = symmetrizePixelGrid(source, input.symmetry);
    return toolSuccess({
      colors,
      cells,
      svg: pixelGridSvg(cells, colors),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const pixelArtTileExample = {
  input: {
    size: 3,
    colorCount: 3,
    symmetry: "quarter-turn",
    maximumAttempts: 32,
    seed: 42,
  },
  output: {
    colors: ["#99E1EF", "#72C32B", "#DA3B32"],
    cells: [
      [2, 0, 2],
      [0, 1, 0],
      [2, 0, 2],
    ],
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 3" shape-rendering="crispEdges"><rect x="0" y="0" width="1" height="1" fill="#DA3B32"/><rect x="1" y="0" width="1" height="1" fill="#99E1EF"/><rect x="2" y="0" width="1" height="1" fill="#DA3B32"/><rect x="0" y="1" width="1" height="1" fill="#99E1EF"/><rect x="1" y="1" width="1" height="1" fill="#72C32B"/><rect x="2" y="1" width="1" height="1" fill="#99E1EF"/><rect x="0" y="2" width="1" height="1" fill="#DA3B32"/><rect x="1" y="2" width="1" height="1" fill="#99E1EF"/><rect x="2" y="2" width="1" height="1" fill="#DA3B32"/></svg>',
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<PixelArtTileInput, PixelArtTileOutput>;
export const pixelArtTileTool = createModelDefinition<
  PixelArtTileInput,
  PixelArtTileOutput
>({
  id: "random/pixel-art-tile",
  title: "Random Pixel Art Tile Generator",
  description:
    "Generate a small distinct-slot random hex palette and a numeric pixel tile under selectable reflection/quarter-turn symmetry, reusing matrix transform orbits and portable SVG; no semantic artwork, seamless-edge or global pattern-uniqueness promise.",
  inputSchema,
  outputSchema,
  execute: calculatePixelArtTile,
});
export const runPixelArtTile = pixelArtTileTool.execute;
export default pixelArtTileTool;
