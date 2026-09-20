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
import { calculateBilinearInterpolation } from "../../interpolation/bilinear/tool.js";
import { runRgbToHex } from "../../convert/rgb-to-hex/tool.js";
import {
  paletteHexSchema,
  paletteRgb,
  drawPaletteColor,
} from "../palette-construction.js";

export type MeshColorPatternInput = {
  readonly controlRows: number;
  readonly controlColumns: number;
  readonly samplesPerCell: number;
  readonly seed?: number;
};
export type MeshColorPatternOutput = {
  readonly controlColors: readonly (readonly string[])[];
  readonly colors: readonly (readonly string[])[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    controlRows: { type: "integer", minimum: 2, maximum: 8 },
    controlColumns: { type: "integer", minimum: 2, maximum: 8 },
    samplesPerCell: { type: "integer", minimum: 1, maximum: 8 },
    seed: generatorSeedSchema,
  },
  required: ["controlRows", "controlColumns", "samplesPerCell"],
} as const;
const colorGrid = {
  type: "array",
  minItems: 2,
  maxItems: 57,
  items: { type: "array", minItems: 2, maxItems: 57, items: paletteHexSchema },
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    controlColors: {
      ...colorGrid,
      maxItems: 8,
      items: { ...colorGrid.items, maxItems: 8 },
    },
    colors: colorGrid,
    randomness: generatorReplaySchema,
  },
  required: ["controlColors", "colors", "randomness"],
} as const;

const isInput = (input: unknown): input is MeshColorPatternInput =>
  matchesModelInput(input, inputSchema);
export const calculateMeshColorPattern = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MeshColorPatternOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const controlColors = Array.from({ length: input.controlRows }, () =>
      Array.from({ length: input.controlColumns }, () =>
        drawPaletteColor(random),
      ),
    );
    const controlRgb = controlColors.map((row) =>
      row.map((color) =>
        paletteRgb(color).map((channel) => Math.round(channel * 255)),
      ),
    );
    const rows = (input.controlRows - 1) * input.samplesPerCell + 1,
      columns = (input.controlColumns - 1) * input.samplesPerCell + 1;
    const colors = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: columns }, (_, x) => {
        const cellY = Math.min(
            input.controlRows - 2,
            Math.floor(y / input.samplesPerCell),
          ),
          cellX = Math.min(
            input.controlColumns - 2,
            Math.floor(x / input.samplesPerCell),
          );
        const channels = [0, 1, 2].map(
          (channel) =>
            calculateBilinearInterpolation({
              pointX: x / input.samplesPerCell - cellX,
              pointY: y / input.samplesPerCell - cellY,
              values: [
                [
                  controlRgb[cellY][cellX][channel],
                  controlRgb[cellY][cellX + 1][channel],
                ],
                [
                  controlRgb[cellY + 1][cellX][channel],
                  controlRgb[cellY + 1][cellX + 1][channel],
                ],
              ],
            }).value,
        );
        const result = runRgbToHex({
          red: channels[0],
          green: channels[1],
          blue: channels[2],
        });
        if (!result.ok)
          throw new Error(
            "Convex interpolated RGB channels could not be serialized.",
          );
        return result.output.hex;
      }),
    );
    return toolSuccess({
      controlColors,
      colors,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const meshColorPatternExample = {
  input: {
    controlRows: 2,
    controlColumns: 2,
    samplesPerCell: 2,
    seed: 42,
  },
  output: {
    controlColors: [
      ["#99E1EF", "#72C32B"],
      ["#DA3B32", "#AB73B0"],
    ],
    colors: [
      ["#99E1EF", "#86D28D", "#72C32B"],
      ["#BA8E91", "#A4957F", "#8F9B6E"],
      ["#DA3B32", "#C35771", "#AB73B0"],
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MeshColorPatternInput, MeshColorPatternOutput>;
export const meshColorPatternTool = createModelDefinition<
  MeshColorPatternInput,
  MeshColorPatternOutput
>({
  id: "random/mesh-color-pattern",
  title: "Random Mesh Color Pattern Generator",
  description:
    "Generate random hex control nodes and a shared-edge bilinear encoded-sRGB color grid via the existing interpolator, retaining its numeric precision and byte quantization; this is a rectangular mesh approximation, not a perceptual or linear-light blend.",
  inputSchema,
  outputSchema,
  execute: calculateMeshColorPattern,
});
export const runMeshColorPattern = meshColorPatternTool.execute;
export default meshColorPatternTool;
