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
import { calculateFlipHorizontal } from "../../matrix/flip-horizontal/tool.js";
import { paletteHexSchema, drawPaletteColor } from "../palette-construction.js";
import { pixelGridSchema, pixelGridSvg } from "../pixel-grid-construction.js";

export type IdenticonInput = {
  readonly size: number;
  readonly fillProbability: number;
  readonly background: string;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type IdenticonOutput = {
  readonly cells: readonly (readonly number[])[];
  readonly foreground: string;
  readonly background: string;
  readonly svg: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    size: { type: "integer", minimum: 2, maximum: 32 },
    fillProbability: { type: "number", minimum: 0, maximum: 1 },
    background: paletteHexSchema,
    maximumAttempts: { type: "integer", minimum: 1, maximum: 8192 },
    seed: generatorSeedSchema,
  },
  required: ["size", "fillProbability", "background", "maximumAttempts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cells: {
      ...pixelGridSchema,
      items: {
        ...pixelGridSchema.items,
        items: { type: "integer", minimum: 0, maximum: 1 },
      },
    },
    foreground: paletteHexSchema,
    background: paletteHexSchema,
    svg: {
      type: "string",
      minLength: 1,
      maxLength: 131072,
      format: "image/svg+xml",
    },
    randomness: generatorReplaySchema,
  },
  required: ["cells", "foreground", "background", "svg", "randomness"],
} as const;

const isInput = (input: unknown): input is IdenticonInput =>
  matchesModelInput(input, inputSchema);
export const calculateIdenticon = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IdenticonOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      background = input.background.toUpperCase();
    let foreground: string | null = null;
    for (let attempt = 0; attempt < input.maximumAttempts; attempt += 1) {
      const candidate = drawPaletteColor(random);
      if (candidate !== background) {
        foreground = candidate;
        break;
      }
    }
    if (foreground === null)
      return simpleError(
        "maximumAttempts",
        "No foreground distinct from the background was generated before the attempt limit.",
        "palette_search_exhausted",
      );
    const width = Math.ceil(input.size / 2),
      half = Array.from({ length: input.size }, () =>
        Array.from({ length: width }, () =>
          Number(random.unit() < input.fillProbability),
        ),
      );
    const reflected = calculateFlipHorizontal({ matrix: half }).flipped;
    const cells = half.map((row, i) => [
      ...row,
      ...reflected[i].slice(input.size % 2),
    ]);
    return toolSuccess({
      cells,
      foreground,
      background,
      svg: pixelGridSvg(cells, [background, foreground]),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const identiconExample = {
  input: {
    size: 5,
    fillProbability: 0.55,
    background: "#202020",
    maximumAttempts: 8,
    seed: 42,
  },
  output: {
    cells: [
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
    foreground: "#99E1EF",
    background: "#202020",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5" shape-rendering="crispEdges"><rect x="0" y="0" width="1" height="1" fill="#99E1EF"/><rect x="1" y="0" width="1" height="1" fill="#202020"/><rect x="2" y="0" width="1" height="1" fill="#202020"/><rect x="3" y="0" width="1" height="1" fill="#202020"/><rect x="4" y="0" width="1" height="1" fill="#99E1EF"/><rect x="0" y="1" width="1" height="1" fill="#99E1EF"/><rect x="1" y="1" width="1" height="1" fill="#99E1EF"/><rect x="2" y="1" width="1" height="1" fill="#99E1EF"/><rect x="3" y="1" width="1" height="1" fill="#99E1EF"/><rect x="4" y="1" width="1" height="1" fill="#99E1EF"/><rect x="0" y="2" width="1" height="1" fill="#202020"/><rect x="1" y="2" width="1" height="1" fill="#202020"/><rect x="2" y="2" width="1" height="1" fill="#99E1EF"/><rect x="3" y="2" width="1" height="1" fill="#202020"/><rect x="4" y="2" width="1" height="1" fill="#202020"/><rect x="0" y="3" width="1" height="1" fill="#99E1EF"/><rect x="1" y="3" width="1" height="1" fill="#202020"/><rect x="2" y="3" width="1" height="1" fill="#202020"/><rect x="3" y="3" width="1" height="1" fill="#202020"/><rect x="4" y="3" width="1" height="1" fill="#99E1EF"/><rect x="0" y="4" width="1" height="1" fill="#99E1EF"/><rect x="1" y="4" width="1" height="1" fill="#99E1EF"/><rect x="2" y="4" width="1" height="1" fill="#99E1EF"/><rect x="3" y="4" width="1" height="1" fill="#99E1EF"/><rect x="4" y="4" width="1" height="1" fill="#99E1EF"/></svg>',
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<IdenticonInput, IdenticonOutput>;
export const identiconTool = createModelDefinition<
  IdenticonInput,
  IdenticonOutput
>({
  id: "random/identicon",
  title: "Random Identicon Generator",
  description:
    "Generate a reproducible left-right mirrored binary avatar grid and portable SVG with a distinct generated foreground and supplied background; fill-probability endpoints may yield blank/solid patterns and the seed is not a unique identity or cryptographic hash.",
  inputSchema,
  outputSchema,
  execute: calculateIdenticon,
});
export const runIdenticon = identiconTool.execute;
export default identiconTool;
