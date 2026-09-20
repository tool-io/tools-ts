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
  calculateDestinationPoint,
  destinationPointInputSchema,
} from "../../geo/destination-point/tool.js";
import {
  calculateHaversineDistance,
  haversineDistanceInputSchema,
  type GeoCoordinate,
} from "../../geo/haversine-distance/tool.js";
import { sumParsedValues } from "../../arithmetic/sum/tool.js";
import { generatedLinearValue } from "../drawing-construction.js";

export type GeodesicRouteSetInput = {
  readonly start: GeoCoordinate;
  readonly routeCount: number;
  readonly legCount: number;
  readonly minimumLegKm: number;
  readonly maximumLegKm: number;
  readonly seed?: number;
};
export type GeneratedGeodesicLeg = {
  readonly from: GeoCoordinate;
  readonly to: GeoCoordinate;
  readonly bearingDegrees: number;
  readonly requestedKilometers: number;
  readonly endpointKilometers: number;
};
export type GeodesicRouteSetOutput = {
  readonly routes: readonly {
    readonly legs: readonly GeneratedGeodesicLeg[];
    readonly totalRequestedKilometers: number;
    readonly totalEndpointKilometers: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const coordinateSchema = haversineDistanceInputSchema.properties.from;
const distanceSchema = destinationPointInputSchema.properties.distanceKm;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: coordinateSchema,
    routeCount: { type: "integer", minimum: 1, maximum: 16 },
    legCount: { type: "integer", minimum: 1, maximum: 32 },
    minimumLegKm: distanceSchema,
    maximumLegKm: distanceSchema,
    seed: generatorSeedSchema,
  },
  required: ["start", "routeCount", "legCount", "minimumLegKm", "maximumLegKm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    routes: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          legs: {
            type: "array",
            minItems: 1,
            maxItems: 32,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                from: coordinateSchema,
                to: coordinateSchema,
                bearingDegrees: { type: "integer", minimum: 0, maximum: 359 },
                requestedKilometers: distanceSchema,
                endpointKilometers: { type: "number", minimum: 0 },
              },
              required: [
                "from",
                "to",
                "bearingDegrees",
                "requestedKilometers",
                "endpointKilometers",
              ],
            },
          },
          totalRequestedKilometers: { type: "number", minimum: 0 },
          totalEndpointKilometers: { type: "number", minimum: 0 },
        },
        required: [
          "legs",
          "totalRequestedKilometers",
          "totalEndpointKilometers",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["routes", "randomness"],
} as const;
const globalDestination = (
  from: GeoCoordinate,
  bearingDegrees: number,
  distanceKm: number,
): GeoCoordinate => {
  // The old input guard rejects signed start coordinates. Reflect latitude and
  // rotate longitude using a zero-meridian nonnegative-latitude core call.
  const reflected = from.latitudeDeg < 0;
  const result = calculateDestinationPoint({
    startLatitudeDeg: Math.abs(from.latitudeDeg),
    startLongitudeDeg: 0,
    bearingDegrees: reflected
      ? (180 - bearingDegrees + 360) % 360
      : bearingDegrees,
    distanceKm,
  });
  if (!result.ok)
    throw new Error(
      "Supported reflected destination parameters were rejected by the destination core.",
    );
  const latitudeDeg = result.output.latitudeDeg * (reflected ? -1 : 1);
  const longitudeDeg =
    Math.round(
      (((result.output.longitudeDeg + from.longitudeDeg + 540) % 360) - 180) *
        100,
    ) / 100;
  if (![latitudeDeg, longitudeDeg].every(Number.isFinite))
    return simpleError(
      "start",
      "The spherical destination is not numerically representable.",
      "numeric_overflow",
    );
  return {
    latitudeDeg: latitudeDeg === 0 ? 0 : latitudeDeg,
    longitudeDeg: longitudeDeg === 0 ? 0 : longitudeDeg,
  };
};
const totalKilometers = (values: readonly number[]): number => {
  const result = sumParsedValues(values.join(","), "numbers");
  if (result === null || !Number.isFinite(result))
    throw new Error(
      "Bounded positive route distances were rejected by the sum core.",
    );
  return result;
};
const isInput = (input: unknown): input is GeodesicRouteSetInput =>
  matchesModelInput(input, inputSchema);
export const calculateGeodesicRouteSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GeodesicRouteSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumLegKm > input.maximumLegKm)
      simpleError(
        "maximumLegKm",
        "Leg-distance bounds must be ordered.",
        "invalid_distance_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const routes = Array.from({ length: input.routeCount }, () => {
      let from: GeoCoordinate = input.start;
      const legs: GeneratedGeodesicLeg[] = [];
      for (let i = 0; i < input.legCount; i += 1) {
        const bearingDegrees = random.integer(0, 359),
          requestedKilometers = generatedLinearValue(
            input.minimumLegKm,
            input.maximumLegKm,
            random.unit(),
            "maximumLegKm",
          ),
          to = globalDestination(from, bearingDegrees, requestedKilometers);
        const result = calculateHaversineDistance({ from, to });
        if (!result.ok || !Number.isFinite(result.output.kilometers))
          throw new Error(
            "Generated bounded route endpoints were rejected by the haversine core.",
          );
        legs.push({
          from,
          to,
          bearingDegrees,
          requestedKilometers,
          endpointKilometers: result.output.kilometers,
        });
        from = to;
      }
      return {
        legs,
        totalRequestedKilometers: totalKilometers(
          legs.map((leg) => leg.requestedKilometers),
        ),
        totalEndpointKilometers: totalKilometers(
          legs.map((leg) => leg.endpointKilometers),
        ),
      };
    });
    return toolSuccess({
      routes,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const geodesicRouteSetExample = {
  input: {
    start: {
      latitudeDeg: 0,
      longitudeDeg: 0,
    },
    routeCount: 1,
    legCount: 2,
    minimumLegKm: 1000,
    maximumLegKm: 1000,
    seed: 42,
  },
  output: {
    routes: [
      {
        legs: [
          {
            from: {
              latitudeDeg: 0,
              longitudeDeg: 0,
            },
            to: {
              latitudeDeg: -7.27,
              longitudeDeg: -5.31,
            },
            bearingDegrees: 216,
            requestedKilometers: 1000,
            endpointKilometers: 1000.12,
          },
          {
            from: {
              latitudeDeg: -7.27,
              longitudeDeg: -5.31,
            },
            to: {
              latitudeDeg: -1.94,
              longitudeDeg: -12.58,
            },
            bearingDegrees: 306,
            requestedKilometers: 1000,
            endpointKilometers: 1000.03,
          },
        ],
        totalRequestedKilometers: 2000,
        totalEndpointKilometers: 2000.15,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<GeodesicRouteSetInput, GeodesicRouteSetOutput>;
export const geodesicRouteSetTool = createModelDefinition<
  GeodesicRouteSetInput,
  GeodesicRouteSetOutput
>({
  id: "random/geodesic-route-set",
  title: "Random Geodesic Route Set Generator",
  description:
    "Generate seeded bearing/distance leg sequences from a supplied global start using the existing IUGG spherical destination/haversine cores, with a reflection/meridian adapter for negative coordinates; coordinates and endpoint distances inherit two-decimal rounding, and totals sum rounded endpoint legs, not road lengths or safe-navigation routes.",
  inputSchema,
  outputSchema,
  execute: calculateGeodesicRouteSet,
});
export const runGeodesicRouteSet = geodesicRouteSetTool.execute;
export default geodesicRouteSetTool;
