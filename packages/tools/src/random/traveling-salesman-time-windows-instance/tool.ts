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
  constructRoutingGeometry,
  routingTourLength,
  routingPointsSchema,
  routingNodesSchema,
  routingMatrixSchema,
  type InstancePoint,
} from "../routing-instance-construction.js";
import {
  positiveInstanceIntegerSchema as positive,
  nonnegativeInstanceIntegerSchema as nonnegative,
  exactInstanceSum,
} from "../optimization-instance-integers.js";

export type TravelingSalesmanTimeWindowsInstanceInput = {
  readonly cityCount: number;
  readonly minimumCoordinate: number;
  readonly maximumCoordinate: number;
  readonly serviceDuration: number;
  readonly windowSlack: number;
  readonly seed?: number;
};
export type TravelingSalesmanTimeWindowsInstanceOutput = {
  readonly points: readonly InstancePoint[];
  readonly travelTimes: readonly (readonly number[])[];
  readonly serviceDurations: readonly number[];
  readonly timeWindows: readonly (readonly [number, number])[];
  readonly tour: readonly number[];
  readonly arrivalTimes: readonly number[];
  readonly returnTime: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cityCount: { type: "integer", minimum: 2, maximum: 64 },
    minimumCoordinate: { type: "integer" },
    maximumCoordinate: { type: "integer" },
    serviceDuration: nonnegative,
    windowSlack: nonnegative,
    seed: generatorSeedSchema,
  },
  required: [
    "cityCount",
    "minimumCoordinate",
    "maximumCoordinate",
    "serviceDuration",
    "windowSlack",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: routingPointsSchema,
    travelTimes: {
      ...routingMatrixSchema,
      items: { ...routingMatrixSchema.items, items: nonnegative },
    },
    serviceDurations: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: nonnegative,
    },
    timeWindows: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: { type: "array", minItems: 2, maxItems: 2, items: nonnegative },
    },
    tour: routingNodesSchema,
    arrivalTimes: {
      type: "array",
      minItems: 3,
      maxItems: 65,
      items: nonnegative,
    },
    returnTime: nonnegative,
    randomness: generatorReplaySchema,
  },
  required: [
    "points",
    "travelTimes",
    "serviceDurations",
    "timeWindows",
    "tour",
    "arrivalTimes",
    "returnTime",
    "randomness",
  ],
} as const;

const isInput = (
  input: unknown,
): input is TravelingSalesmanTimeWindowsInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateTravelingSalesmanTimeWindowsInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TravelingSalesmanTimeWindowsInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const geometry = constructRoutingGeometry(
      input.cityCount,
      input.minimumCoordinate,
      input.maximumCoordinate,
      random,
    );
    const travelTimes = geometry.distances.map((row) =>
      row.map((distance) => {
        const time = Math.ceil(distance);
        if (!Number.isSafeInteger(time))
          simpleError(
            "maximumCoordinate",
            "Every rounded travel time must be a safe integer.",
            "unsafe_travel_time",
          );
        return time;
      }),
    );
    const serviceDurations = geometry.points.map((_, i) =>
      i === 0 ? 0 : input.serviceDuration,
    );
    const tour = [
      0,
      ...random.shuffle(
        Array.from({ length: input.cityCount - 1 }, (_, i) => i + 1),
      ),
      0,
    ];
    const arrivalTimes = [0];
    let time = 0;
    for (let i = 1; i < tour.length; i += 1) {
      time = exactInstanceSum(
        [
          time,
          serviceDurations[tour[i - 1]],
          travelTimes[tour[i - 1]][tour[i]],
        ],
        "serviceDuration",
      );
      arrivalTimes.push(time);
    }
    const timeWindows: [number, number][] = geometry.points.map(() => [0, 0]);
    for (let i = 1; i < tour.length - 1; i += 1)
      timeWindows[tour[i]] = [
        Math.max(0, arrivalTimes[i] - input.windowSlack),
        exactInstanceSum([arrivalTimes[i], input.windowSlack], "windowSlack"),
      ];
    timeWindows[0] = [
      0,
      exactInstanceSum([time, input.windowSlack], "windowSlack"),
    ];
    return toolSuccess({
      points: geometry.points,
      travelTimes,
      serviceDurations,
      timeWindows,
      tour,
      arrivalTimes,
      returnTime: time,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const travelingSalesmanTimeWindowsInstanceExample = {
  input: {
    cityCount: 4,
    minimumCoordinate: -10,
    maximumCoordinate: 10,
    serviceDuration: 2,
    windowSlack: 3,
    seed: 42,
  },
  output: {
    points: [
      [2, -1],
      [7, 4],
      [-7, 1],
      [-5, 3],
    ],
    travelTimes: [
      [0, 8, 10, 9],
      [8, 0, 15, 13],
      [10, 15, 0, 3],
      [9, 13, 3, 0],
    ],
    serviceDurations: [0, 2, 2, 2],
    timeWindows: [
      [0, 56],
      [24, 30],
      [7, 13],
      [39, 45],
    ],
    tour: [0, 2, 1, 3, 0],
    arrivalTimes: [0, 10, 27, 42, 53],
    returnTime: 53,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  TravelingSalesmanTimeWindowsInstanceInput,
  TravelingSalesmanTimeWindowsInstanceOutput
>;
export const travelingSalesmanTimeWindowsInstanceTool = createModelDefinition<
  TravelingSalesmanTimeWindowsInstanceInput,
  TravelingSalesmanTimeWindowsInstanceOutput
>({
  id: "random/traveling-salesman-time-windows-instance",
  title: "Random Traveling Salesman With Time Windows Instance Generator",
  description:
    "Generate integer-coordinate cities, ceiling-Euclidean travel times in abstract time units, fixed customer service times and inclusive windows around a feasible randomized depot-return tour; no optimality or real routing claim.",
  inputSchema,
  outputSchema,
  execute: calculateTravelingSalesmanTimeWindowsInstance,
});
export const runTravelingSalesmanTimeWindowsInstance =
  travelingSalesmanTimeWindowsInstanceTool.execute;
export default travelingSalesmanTimeWindowsInstanceTool;
