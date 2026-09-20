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
import { calculate as orbit } from "../../astronomy/orbital-semi-major-from-period/tool.js";
import { calculate as equilibrium } from "../../astronomy/exoplanet-equilibrium-temperature/tool.js";
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
export type ToyPlanetarySystemInput = {
  readonly count: number;
  readonly centralGravitationalParameter: number;
  readonly stellarRadiusMeters: number;
  readonly stellarTemperatureKelvin: number;
  readonly orbitalPeriodSeconds: NumericRange;
  readonly minimumPeriodGapSeconds: number;
  readonly bondAlbedo: NumericRange;
  readonly reradiationAreaFactor: number;
  readonly seed?: number;
};
export type ToyPlanetarySystemOutput = {
  readonly centralGravitationalParameter: number;
  readonly stellarRadiusMeters: number;
  readonly stellarTemperatureKelvin: number;
  readonly reradiationAreaFactor: number;
  readonly planets: readonly {
    readonly id: number;
    readonly orbitalPeriodSeconds: number;
    readonly semiMajorAxisMeters: number;
    readonly bondAlbedo: number;
    readonly blackbodyEquilibriumKelvin: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: countSchema(32),
    centralGravitationalParameter: positiveSchema,
    stellarRadiusMeters: positiveSchema,
    stellarTemperatureKelvin: positiveSchema,
    orbitalPeriodSeconds: rangeSchema(positiveSchema),
    minimumPeriodGapSeconds: positiveSchema,
    bondAlbedo: rangeSchema({ type: "number", minimum: 0, maximum: 1 }),
    reradiationAreaFactor: positiveSchema,
    seed: generatorSeedSchema,
  },
  [
    "count",
    "centralGravitationalParameter",
    "stellarRadiusMeters",
    "stellarTemperatureKelvin",
    "orbitalPeriodSeconds",
    "minimumPeriodGapSeconds",
    "bondAlbedo",
    "reradiationAreaFactor",
  ],
);
export const outputSchema = objectSchema({
  centralGravitationalParameter: positiveSchema,
  stellarRadiusMeters: positiveSchema,
  stellarTemperatureKelvin: positiveSchema,
  reradiationAreaFactor: positiveSchema,
  planets: arraySchema(
    objectSchema({
      id: countSchema(31, 0),
      orbitalPeriodSeconds: positiveSchema,
      semiMajorAxisMeters: positiveSchema,
      bondAlbedo: { type: "number", minimum: 0, maximum: 1 },
      blackbodyEquilibriumKelvin: nonnegativeSchema,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ToyPlanetarySystemInput =>
  matchesModelInput(value, inputSchema);
export const calculateToyPlanetarySystem = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ToyPlanetarySystemOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.orbitalPeriodSeconds, "orbitalPeriodSeconds");
    orderedRange(input.bondAlbedo, "bondAlbedo");
    const span =
      input.orbitalPeriodSeconds.maximum - input.orbitalPeriodSeconds.minimum;
    if (
      !Number.isFinite(span) ||
      input.minimumPeriodGapSeconds * (input.count - 1) > span
    )
      simpleError(
        "count",
        "Requested orbital periods and gaps cannot fit the interval.",
        "infeasible_period_spacing",
      );
    const axis = (period: number) =>
      legacyScalar(
        orbit({
          actualCentralGravitationalParameter:
            input.centralGravitationalParameter,
          actualOrbitalPeriodSeconds: period,
        }),
      );
    if (axis(input.orbitalPeriodSeconds.minimum) <= input.stellarRadiusMeters)
      simpleError(
        "orbitalPeriodSeconds",
        "The entire supplied period interval must describe external stellar orbits.",
        "orbit_inside_star",
      );
    const random = createGeneratorRandom(input.seed, context);
    let lower = input.orbitalPeriodSeconds.minimum,
      previous: number | undefined;
    const planets = Array.from({ length: input.count }, (_, id) => {
      const upper =
        input.orbitalPeriodSeconds.maximum -
        (input.count - id - 1) * input.minimumPeriodGapSeconds;
      if (lower > upper)
        simpleError(
          "minimumPeriodGapSeconds",
          "Remaining spacing was lost to finite precision.",
          "numeric_range",
        );
      const orbitalPeriodSeconds = drawReal(
        { minimum: lower, maximum: upper },
        random,
        "orbitalPeriodSeconds",
      );
      if (
        previous !== undefined &&
        (orbitalPeriodSeconds <= previous ||
          orbitalPeriodSeconds - previous < input.minimumPeriodGapSeconds)
      )
        simpleError(
          "minimumPeriodGapSeconds",
          "Period increments are below representable precision.",
          "numeric_range",
        );
      previous = orbitalPeriodSeconds;
      if (id + 1 < input.count)
        lower = finiteNumber(
          orbitalPeriodSeconds + input.minimumPeriodGapSeconds,
          "minimumPeriodGapSeconds",
        );
      const semiMajorAxisMeters = axis(orbitalPeriodSeconds),
        bondAlbedo = drawReal(input.bondAlbedo, random, "bondAlbedo");
      const blackbodyEquilibriumKelvin = equilibrium({
        stellarTemperatureKelvin: input.stellarTemperatureKelvin,
        stellarRadiusSameUnits: input.stellarRadiusMeters,
        orbitalDistanceSameUnits: semiMajorAxisMeters,
        bondAlbedo,
        callerReradiationAreaFactor: input.reradiationAreaFactor,
      }).blackbodyEquilibriumKelvin;
      return {
        id,
        orbitalPeriodSeconds,
        semiMajorAxisMeters,
        bondAlbedo,
        blackbodyEquilibriumKelvin,
      };
    });
    return toolSuccess(
      ensureOutput(
        {
          centralGravitationalParameter: input.centralGravitationalParameter,
          stellarRadiusMeters: input.stellarRadiusMeters,
          stellarTemperatureKelvin: input.stellarTemperatureKelvin,
          reradiationAreaFactor: input.reradiationAreaFactor,
          planets,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const toyPlanetarySystemExample = {
  input: {
    count: 1,
    centralGravitationalParameter: 132712440018000000000,
    stellarRadiusMeters: 695700000,
    stellarTemperatureKelvin: 5772,
    orbitalPeriodSeconds: {
      minimum: 31557600,
      maximum: 31557600,
    },
    minimumPeriodGapSeconds: 86400,
    bondAlbedo: {
      minimum: 0.3,
      maximum: 0.3,
    },
    reradiationAreaFactor: 4,
    seed: 42,
  },
  output: {
    centralGravitationalParameter: 132712440018000000000,
    stellarRadiusMeters: 695700000,
    stellarTemperatureKelvin: 5772,
    reradiationAreaFactor: 4,
    planets: [
      {
        id: 0,
        orbitalPeriodSeconds: 31557600,
        semiMajorAxisMeters: 149595987125.067,
        bondAlbedo: 0.3,
        blackbodyEquilibriumKelvin: 254.5873756930518,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<ToyPlanetarySystemInput, ToyPlanetarySystemOutput>;
export const toyPlanetarySystemTool = createModelDefinition<
  ToyPlanetarySystemInput,
  ToyPlanetarySystemOutput
>({
  id: "random/toy-planetary-system",
  title: "Random Toy Planetary System Generator",
  description:
    "Generate ascending synthetic external orbits and equilibrium temperatures around explicit stellar parameters under simplified two-body and blackbody models.",
  inputSchema,
  outputSchema,
  execute: calculateToyPlanetarySystem,
});
export const runToyPlanetarySystem = toyPlanetarySystemTool.execute;
export default toyPlanetarySystemTool;
