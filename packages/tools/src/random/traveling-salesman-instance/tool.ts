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

export type TravelingSalesmanInstanceInput = {
  readonly cityCount: number;
  readonly minimumCoordinate: number;
  readonly maximumCoordinate: number;
  readonly seed?: number;
};
export type TravelingSalesmanInstanceOutput = {
  readonly points: readonly InstancePoint[];
  readonly distances: readonly (readonly number[])[];
  readonly tour: readonly number[];
  readonly tourLength: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cityCount: { type: "integer", minimum: 2, maximum: 64 },
    minimumCoordinate: { type: "integer" },
    maximumCoordinate: { type: "integer" },
    seed: generatorSeedSchema,
  },
  required: ["cityCount", "minimumCoordinate", "maximumCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: routingPointsSchema,
    distances: routingMatrixSchema,
    tour: routingNodesSchema,
    tourLength: { type: "number", minimum: 0 },
    randomness: generatorReplaySchema,
  },
  required: ["points", "distances", "tour", "tourLength", "randomness"],
} as const;

const isInput = (input: unknown): input is TravelingSalesmanInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateTravelingSalesmanInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TravelingSalesmanInstanceOutput> => {
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
    const tour = [
      0,
      ...random.shuffle(
        Array.from({ length: input.cityCount - 1 }, (_, i) => i + 1),
      ),
      0,
    ];
    return toolSuccess({
      ...geometry,
      tour,
      tourLength: routingTourLength(tour, geometry.distances),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const travelingSalesmanInstanceExample = {
  input: {
    cityCount: 4,
    minimumCoordinate: -10,
    maximumCoordinate: 10,
    seed: 42,
  },
  output: {
    points: [
      [2, -1],
      [7, 4],
      [-7, 1],
      [-5, 3],
    ],
    distances: [
      [0, 7.0710678118654755, 9.219544457292889, 8.06225774829855],
      [7.0710678118654755, 0, 14.317821063276352, 12.041594578792294],
      [9.219544457292889, 14.317821063276352, 0, 2.8284271247461903],
      [8.06225774829855, 12.041594578792294, 2.8284271247461903, 0],
    ],
    tour: [0, 2, 1, 3, 0],
    tourLength: 43.64121784766008,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  TravelingSalesmanInstanceInput,
  TravelingSalesmanInstanceOutput
>;
export const travelingSalesmanInstanceTool = createModelDefinition<
  TravelingSalesmanInstanceInput,
  TravelingSalesmanInstanceOutput
>({
  id: "random/traveling-salesman-instance",
  title: "Random Euclidean Traveling Salesman Instance Generator",
  description:
    "Generate labeled integer-coordinate cities and their complete symmetric Euclidean distance matrix, plus a randomized depot-return tour and its measured length; coincident cities are allowed and the tour is not claimed optimal.",
  inputSchema,
  outputSchema,
  execute: calculateTravelingSalesmanInstance,
});
export const runTravelingSalesmanInstance =
  travelingSalesmanInstanceTool.execute;
export default travelingSalesmanInstanceTool;
