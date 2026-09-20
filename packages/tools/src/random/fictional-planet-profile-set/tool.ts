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
import { calculate as density } from "../../astronomy/exoplanet-density-gcc/tool.js";
import { calculate as gravity } from "../../astronomy/exoplanet-surface-gravity/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  nonnegativeSchema,
  rangeSchema,
  drawReal,
  orderedRange,
  legacyScalar,
  finiteNumber,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type FictionalPlanetProfileSetInput = {
  readonly count: number;
  readonly massKg: NumericRange;
  readonly radiusMeters: NumericRange;
  readonly seed?: number;
};
export type FictionalPlanetProfileSetOutput = {
  readonly planets: readonly {
    readonly id: number;
    readonly massKg: number;
    readonly radiusMeters: number;
    readonly densityGramsPerCubicCentimeter: number;
    readonly surfaceGravityMetersPerSecondSquared: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: countSchema(128),
    massKg: rangeSchema(nonnegativeSchema),
    radiusMeters: rangeSchema(positiveSchema),
    seed: generatorSeedSchema,
  },
  ["count", "massKg", "radiusMeters"],
);
export const outputSchema = objectSchema({
  planets: arraySchema(
    objectSchema({
      id: countSchema(127, 0),
      massKg: nonnegativeSchema,
      radiusMeters: positiveSchema,
      densityGramsPerCubicCentimeter: nonnegativeSchema,
      surfaceGravityMetersPerSecondSquared: nonnegativeSchema,
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is FictionalPlanetProfileSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateFictionalPlanetProfileSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FictionalPlanetProfileSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.massKg, "massKg");
    orderedRange(input.radiusMeters, "radiusMeters");
    const random = createGeneratorRandom(input.seed, context);
    const planets = Array.from({ length: input.count }, (_, id) => {
      const massKg = drawReal(input.massKg, random, "massKg"),
        radiusMeters = drawReal(input.radiusMeters, random, "radiusMeters"),
        massGrams = finiteNumber(massKg * 1000, "massKg"),
        radiusCentimeters = finiteNumber(radiusMeters * 100, "radiusMeters");
      if (
        !Number.isFinite(radiusCentimeters ** 3) ||
        radiusCentimeters ** 3 === 0 ||
        !Number.isFinite(radiusMeters ** 2) ||
        radiusMeters ** 2 === 0
      )
        simpleError(
          "radiusMeters",
          "The inherited spherical cores cannot represent the radius powers.",
          "numeric_range",
        );
      const densityGramsPerCubicCentimeter = legacyScalar(
          density({
            actualExoplanetMassGrams: massGrams,
            actualExoplanetRadiusCentimeters: radiusCentimeters,
          }),
        ),
        surfaceGravityMetersPerSecondSquared = legacyScalar(
          gravity({
            actualExoplanetMassKg: massKg,
            actualExoplanetRadiusMeters: radiusMeters,
          }),
        );
      if (
        massKg > 0 &&
        (densityGramsPerCubicCentimeter === 0 ||
          surfaceGravityMetersPerSecondSquared === 0)
      )
        simpleError(
          "massKg",
          "Positive derived density or gravity underflowed representation.",
          "numeric_range",
        );
      return {
        id,
        massKg,
        radiusMeters,
        densityGramsPerCubicCentimeter,
        surfaceGravityMetersPerSecondSquared,
      };
    });
    return toolSuccess(
      ensureOutput(
        { planets, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fictionalPlanetProfileSetExample = {
  input: {
    count: 2,
    massKg: {
      minimum: 5e24,
      maximum: 7e24,
    },
    radiusMeters: {
      minimum: 6400000,
      maximum: 6400000,
    },
    seed: 42,
  },
  output: {
    planets: [
      {
        id: 0,
        massKg: 6.202207503840327e24,
        radiusMeters: 6400000,
        densityGramsPerCubicCentimeter: 5.648300069720269,
        surfaceGravityMetersPerSecondSquared: 10.106297251680052,
      },
      {
        id: 1,
        massKg: 6.70493158698082e24,
        radiusMeters: 6400000,
        densityGramsPerCubicCentimeter: 6.106126814809708,
        surfaceGravityMetersPerSecondSquared: 10.9254699440884,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FictionalPlanetProfileSetInput,
  FictionalPlanetProfileSetOutput
>;
export const fictionalPlanetProfileSetTool = createModelDefinition<
  FictionalPlanetProfileSetInput,
  FictionalPlanetProfileSetOutput
>({
  id: "random/fictional-planet-profile-set",
  title: "Random Fictional Planet Profile Set Generator",
  description:
    "Generate fictional SI mass and radius records with delegated spherical density and Newtonian surface gravity, without composition screening.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalPlanetProfileSet,
});
export const runFictionalPlanetProfileSet =
  fictionalPlanetProfileSetTool.execute;
export default fictionalPlanetProfileSetTool;
