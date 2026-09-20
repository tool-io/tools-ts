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
import { runLightTravelTime } from "../../astronomy/light-travel-time/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  rangeSchema,
  drawReal,
  orderedRange,
  coreOutput,
  distanceFromCore,
  finiteNumber,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type LightTravelTimeNetworkInput = {
  readonly locationCount: number;
  readonly x: NumericRange;
  readonly y: NumericRange;
  readonly z: NumericRange;
  readonly coordinateUnit: string;
  readonly kilometersPerUnit: number;
  readonly seed?: number;
};
export type LightTravelTimeNetworkOutput = {
  readonly coordinateUnit: string;
  readonly kilometersPerUnit: number;
  readonly locations: readonly {
    readonly id: number;
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }[];
  readonly distanceUnits: readonly (readonly number[])[];
  readonly distanceKilometers: readonly (readonly number[])[];
  readonly lightTimeSeconds: readonly (readonly number[])[];
  readonly lightTimeDays: readonly (readonly number[])[];
  readonly randomness: GeneratorReplay;
};
const matrix = arraySchema(
  arraySchema({ type: "number", minimum: 0 }, 32, 1),
  32,
  1,
);
export const inputSchema = objectSchema(
  {
    locationCount: countSchema(32),
    x: rangeSchema(),
    y: rangeSchema(),
    z: rangeSchema(),
    coordinateUnit: { type: "string", minLength: 1, maxLength: 64 },
    kilometersPerUnit: positiveSchema,
    seed: generatorSeedSchema,
  },
  ["locationCount", "x", "y", "z", "coordinateUnit", "kilometersPerUnit"],
);
export const outputSchema = objectSchema({
  coordinateUnit: { type: "string", minLength: 1, maxLength: 64 },
  kilometersPerUnit: positiveSchema,
  locations: arraySchema(
    objectSchema({
      id: countSchema(31, 0),
      x: numberSchema,
      y: numberSchema,
      z: numberSchema,
    }),
    32,
    1,
  ),
  distanceUnits: matrix,
  distanceKilometers: matrix,
  lightTimeSeconds: matrix,
  lightTimeDays: matrix,
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is LightTravelTimeNetworkInput =>
  matchesModelInput(value, inputSchema);
export const calculateLightTravelTimeNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LightTravelTimeNetworkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const field of ["x", "y", "z"] as const)
      orderedRange(input[field], field);
    if (!input.coordinateUnit.trim())
      simpleError(
        "coordinateUnit",
        "Coordinate unit label must be nonempty text.",
        "empty_unit",
      );
    const random = createGeneratorRandom(input.seed, context),
      locations = Array.from({ length: input.locationCount }, (_, id) => ({
        id,
        x: drawReal(input.x, random, "x"),
        y: drawReal(input.y, random, "y"),
        z: drawReal(input.z, random, "z"),
      }));
    const blank = () =>
        Array.from({ length: input.locationCount }, () =>
          Array<number>(input.locationCount).fill(0),
        ),
      distanceUnits = blank(),
      distanceKilometers = blank(),
      lightTimeSeconds = blank(),
      lightTimeDays = blank();
    for (let i = 0; i < locations.length; i++)
      for (let j = i + 1; j < locations.length; j++) {
        const a = locations[i],
          b = locations[j],
          distance = distanceFromCore(a, b, "x"),
          kilometers = finiteNumber(
            distance * input.kilometersPerUnit,
            "kilometersPerUnit",
          );
        if (distance > 0 && kilometers === 0)
          simpleError(
            "kilometersPerUnit",
            "Positive converted distance underflowed representation.",
            "numeric_range",
          );
        const time = coreOutput(runLightTravelTime({ distanceKm: kilometers }));
        if (kilometers > 0 && time.seconds === 0)
          simpleError(
            "kilometersPerUnit",
            "Positive light time underflowed representation.",
            "numeric_range",
          );
        for (const [matrix, value] of [
          [distanceUnits, distance],
          [distanceKilometers, kilometers],
          [lightTimeSeconds, time.seconds],
          [lightTimeDays, time.days],
        ] as const) {
          matrix[i][j] = value;
          matrix[j][i] = value;
        }
      }
    return toolSuccess(
      ensureOutput(
        {
          coordinateUnit: input.coordinateUnit,
          kilometersPerUnit: input.kilometersPerUnit,
          locations,
          distanceUnits,
          distanceKilometers,
          lightTimeSeconds,
          lightTimeDays,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const lightTravelTimeNetworkExample = {
  input: {
    locationCount: 2,
    x: {
      minimum: 0,
      maximum: 10,
    },
    y: {
      minimum: 0,
      maximum: 0,
    },
    z: {
      minimum: 0,
      maximum: 0,
    },
    coordinateUnit: "light-second",
    kilometersPerUnit: 299792.458,
    seed: 42,
  },
  output: {
    coordinateUnit: "light-second",
    kilometersPerUnit: 299792.458,
    locations: [
      {
        id: 0,
        x: 6.011037519201636,
        y: 0,
        z: 0,
      },
      {
        id: 1,
        x: 6.697340414393693,
        y: 0,
        z: 0,
      },
    ],
    distanceUnits: [
      [0, 0.6863028951920569],
      [0.6863028951920569, 0],
    ],
    distanceKilometers: [
      [0, 205748.4318821431],
      [205748.4318821431, 0],
    ],
    lightTimeSeconds: [
      [0, 0.6863028951920569],
      [0.6863028951920569, 0],
    ],
    lightTimeDays: [
      [0, 0.000007943320546204362],
      [0.000007943320546204362, 0],
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  LightTravelTimeNetworkInput,
  LightTravelTimeNetworkOutput
>;
export const lightTravelTimeNetworkTool = createModelDefinition<
  LightTravelTimeNetworkInput,
  LightTravelTimeNetworkOutput
>({
  id: "random/light-travel-time-network",
  title: "Random Light Travel Time Network Generator",
  description:
    "Generate fictional 3D locations and symmetric distance and vacuum light-time matrices using an explicit kilometers-per-unit conversion.",
  inputSchema,
  outputSchema,
  execute: calculateLightTravelTimeNetwork,
});
export const runLightTravelTimeNetwork = lightTravelTimeNetworkTool.execute;
export default lightTravelTimeNetworkTool;
