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
import { calculate as modulus } from "../../astronomy/distance-modulus-parsecs/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  rangeSchema,
  drawReal,
  orderedRange,
  requireDistinct,
  distanceFromCore,
  finiteNumber,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type StarfieldLayer = {
  readonly id: string;
  readonly count: number;
  readonly depthParsecs: NumericRange;
};
export type DepthLayeredStarfieldDatasetInput = {
  readonly layers: readonly StarfieldLayer[];
  readonly xParsecs: NumericRange;
  readonly yParsecs: NumericRange;
  readonly absoluteMagnitude: NumericRange;
  readonly seed?: number;
};
export type DepthLayeredStarfieldDatasetOutput = {
  readonly stars: readonly {
    readonly id: string;
    readonly layerId: string;
    readonly xParsecs: number;
    readonly yParsecs: number;
    readonly zParsecs: number;
    readonly distanceParsecs: number;
    readonly absoluteMagnitude: number;
    readonly distanceModulus: number;
    readonly apparentMagnitude: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    layers: arraySchema(
      objectSchema({
        id: { type: "string", minLength: 1, maxLength: 64 },
        count: countSchema(64),
        depthParsecs: rangeSchema(positiveSchema),
      }),
      16,
      1,
    ),
    xParsecs: rangeSchema(),
    yParsecs: rangeSchema(),
    absoluteMagnitude: rangeSchema(),
    seed: generatorSeedSchema,
  },
  ["layers", "xParsecs", "yParsecs", "absoluteMagnitude"],
);
export const outputSchema = objectSchema({
  stars: arraySchema(
    objectSchema({
      id: { type: "string", maxLength: 80 },
      layerId: { type: "string", maxLength: 64 },
      xParsecs: numberSchema,
      yParsecs: numberSchema,
      zParsecs: positiveSchema,
      distanceParsecs: positiveSchema,
      absoluteMagnitude: numberSchema,
      distanceModulus: numberSchema,
      apparentMagnitude: numberSchema,
    }),
    256,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is DepthLayeredStarfieldDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateDepthLayeredStarfieldDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DepthLayeredStarfieldDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    requireDistinct(
      input.layers.map((l) => l.id),
      "layers",
    );
    for (const field of ["xParsecs", "yParsecs", "absoluteMagnitude"] as const)
      orderedRange(input[field], field);
    let total = 0;
    for (let i = 0; i < input.layers.length; i++) {
      const layer = input.layers[i];
      orderedRange(layer.depthParsecs, "layers." + i + ".depthParsecs");
      total += layer.count;
      if (
        i > 0 &&
        layer.depthParsecs.minimum < input.layers[i - 1].depthParsecs.maximum
      )
        simpleError(
          "layers." + i + ".depthParsecs",
          "Depth layers must be ordered without overlapping interiors.",
          "overlapping_depth_layers",
        );
    }
    if (total > 256)
      simpleError(
        "layers",
        "Total star count exceeds 256.",
        "star_resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      stars: DepthLayeredStarfieldDatasetOutput["stars"][number][] = [];
    for (const layer of input.layers)
      for (let i = 0; i < layer.count; i++) {
        const xParsecs = drawReal(input.xParsecs, random, "xParsecs"),
          yParsecs = drawReal(input.yParsecs, random, "yParsecs"),
          zParsecs = drawReal(
            layer.depthParsecs,
            random,
            "layers.depthParsecs",
          ),
          absoluteMagnitude = drawReal(
            input.absoluteMagnitude,
            random,
            "absoluteMagnitude",
          );
        const distanceParsecs = distanceFromCore(
          { x: 0, y: 0, z: 0 },
          { x: xParsecs, y: yParsecs, z: zParsecs },
          "layers",
        );
        if (distanceParsecs <= 0)
          simpleError(
            "layers",
            "Positive depth has an unrepresentable Euclidean distance.",
            "numeric_range",
          );
        const distanceModulus = modulus({ distanceParsecs }).distanceModulus,
          apparentMagnitude = finiteNumber(
            absoluteMagnitude + distanceModulus,
            "absoluteMagnitude",
          );
        stars.push({
          id: layer.id + "-" + i,
          layerId: layer.id,
          xParsecs,
          yParsecs,
          zParsecs,
          distanceParsecs,
          absoluteMagnitude,
          distanceModulus,
          apparentMagnitude,
        });
      }
    return toolSuccess(
      ensureOutput(
        { stars, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const depthLayeredStarfieldDatasetExample = {
  input: {
    layers: [
      {
        id: "near",
        count: 1,
        depthParsecs: {
          minimum: 10,
          maximum: 10,
        },
      },
      {
        id: "far",
        count: 1,
        depthParsecs: {
          minimum: 100,
          maximum: 100,
        },
      },
    ],
    xParsecs: {
      minimum: 0,
      maximum: 0,
    },
    yParsecs: {
      minimum: 0,
      maximum: 0,
    },
    absoluteMagnitude: {
      minimum: 4,
      maximum: 6,
    },
    seed: 42,
  },
  output: {
    stars: [
      {
        id: "near-0",
        layerId: "near",
        xParsecs: 0,
        yParsecs: 0,
        zParsecs: 10,
        distanceParsecs: 10,
        absoluteMagnitude: 5.339468082878739,
        distanceModulus: 0,
        apparentMagnitude: 5.339468082878739,
      },
      {
        id: "far-0",
        layerId: "far",
        xParsecs: 0,
        yParsecs: 0,
        zParsecs: 100,
        distanceParsecs: 100,
        absoluteMagnitude: 5.249489307869226,
        distanceModulus: 5,
        apparentMagnitude: 10.249489307869226,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  DepthLayeredStarfieldDatasetInput,
  DepthLayeredStarfieldDatasetOutput
>;
export const depthLayeredStarfieldDatasetTool = createModelDefinition<
  DepthLayeredStarfieldDatasetInput,
  DepthLayeredStarfieldDatasetOutput
>({
  id: "random/depth-layered-starfield-dataset",
  title: "Random Depth-Layered Starfield Dataset Generator",
  description:
    "Generate fictional stars in supplied ordered depth layers with Euclidean parsec distances and extinction-free apparent magnitudes.",
  inputSchema,
  outputSchema,
  execute: calculateDepthLayeredStarfieldDataset,
});
export const runDepthLayeredStarfieldDataset =
  depthLayeredStarfieldDatasetTool.execute;
export default depthLayeredStarfieldDatasetTool;
