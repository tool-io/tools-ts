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
import { calculate as luminosity } from "../../astronomy/stefan-boltzmann-luminosity/tool.js";
import { calculate as wien } from "../../astronomy/wien-peak-wavelength/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  positiveSchema,
  rangeSchema,
  drawReal,
  orderedRange,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type FictionalStarProfileSetInput = {
  readonly count: number;
  readonly radiusMeters: NumericRange;
  readonly temperatureKelvin: NumericRange;
  readonly seed?: number;
};
export type FictionalStarProfileSetOutput = {
  readonly stars: readonly {
    readonly id: number;
    readonly radiusMeters: number;
    readonly temperatureKelvin: number;
    readonly blackbodyLuminosityWatts: number;
    readonly wavelengthRadiancePeakNm: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: countSchema(128),
    radiusMeters: rangeSchema(positiveSchema),
    temperatureKelvin: rangeSchema(positiveSchema),
    seed: generatorSeedSchema,
  },
  ["count", "radiusMeters", "temperatureKelvin"],
);
export const outputSchema = objectSchema({
  stars: arraySchema(
    objectSchema({
      id: countSchema(127, 0),
      radiusMeters: positiveSchema,
      temperatureKelvin: positiveSchema,
      blackbodyLuminosityWatts: positiveSchema,
      wavelengthRadiancePeakNm: positiveSchema,
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is FictionalStarProfileSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateFictionalStarProfileSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FictionalStarProfileSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.radiusMeters, "radiusMeters");
    orderedRange(input.temperatureKelvin, "temperatureKelvin");
    const random = createGeneratorRandom(input.seed, context);
    const stars = Array.from({ length: input.count }, (_, id) => {
      const radiusMeters = drawReal(input.radiusMeters, random, "radiusMeters"),
        temperatureKelvin = drawReal(
          input.temperatureKelvin,
          random,
          "temperatureKelvin",
        );
      const blackbodyLuminosityWatts = luminosity({
          stellarRadiusMeters: radiusMeters,
          temperatureKelvin,
        }).blackbodyLuminosityWatts,
        wavelengthRadiancePeakNm = wien({
          blackbodyTemperatureKelvin: temperatureKelvin,
        }).wavelengthRadiancePeakNm;
      if (blackbodyLuminosityWatts <= 0 || wavelengthRadiancePeakNm <= 0)
        simpleError(
          "temperatureKelvin",
          "Positive blackbody outputs underflowed representation.",
          "numeric_range",
        );
      return {
        id,
        radiusMeters,
        temperatureKelvin,
        blackbodyLuminosityWatts,
        wavelengthRadiancePeakNm,
      };
    });
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
export const fictionalStarProfileSetExample = {
  input: {
    count: 1,
    radiusMeters: {
      minimum: 500000000,
      maximum: 800000000,
    },
    temperatureKelvin: {
      minimum: 4000,
      maximum: 7000,
    },
    seed: 42,
  },
  output: {
    stars: [
      {
        id: 0,
        radiusMeters: 680331125.5760491,
        temperatureKelvin: 5344.871676992625,
        blackbodyLuminosityWatts: 2.6916055392485458e26,
        wavelengthRadiancePeakNm: 542.1593127246932,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FictionalStarProfileSetInput,
  FictionalStarProfileSetOutput
>;
export const fictionalStarProfileSetTool = createModelDefinition<
  FictionalStarProfileSetInput,
  FictionalStarProfileSetOutput
>({
  id: "random/fictional-star-profile-set",
  title: "Random Fictional Star Profile Set Generator",
  description:
    "Generate fictional radius and temperature profiles with delegated spherical blackbody luminosity and wavelength-radiance peak.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalStarProfileSet,
});
export const runFictionalStarProfileSet = fictionalStarProfileSetTool.execute;
export default fictionalStarProfileSetTool;
