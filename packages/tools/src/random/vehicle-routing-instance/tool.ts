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

export type VehicleRoutingInstanceInput = {
  readonly customerCount: number;
  readonly vehicleCount: number;
  readonly vehicleCapacity: number;
  readonly minimumDemand: number;
  readonly maximumDemand: number;
  readonly minimumCoordinate: number;
  readonly maximumCoordinate: number;
  readonly seed?: number;
};
export type VehicleRoutingInstanceOutput = {
  readonly points: readonly InstancePoint[];
  readonly distances: readonly (readonly number[])[];
  readonly demands: readonly number[];
  readonly vehicleCapacity: number;
  readonly routes: readonly (readonly number[])[];
  readonly routeLoads: readonly number[];
  readonly routeLengths: readonly number[];
  readonly totalLength: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    customerCount: { type: "integer", minimum: 1, maximum: 63 },
    vehicleCount: { type: "integer", minimum: 1, maximum: 32 },
    vehicleCapacity: positive,
    minimumDemand: positive,
    maximumDemand: positive,
    minimumCoordinate: { type: "integer" },
    maximumCoordinate: { type: "integer" },
    seed: generatorSeedSchema,
  },
  required: [
    "customerCount",
    "vehicleCount",
    "vehicleCapacity",
    "minimumDemand",
    "maximumDemand",
    "minimumCoordinate",
    "maximumCoordinate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: routingPointsSchema,
    distances: routingMatrixSchema,
    demands: { type: "array", minItems: 2, maxItems: 64, items: nonnegative },
    vehicleCapacity: positive,
    routes: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: routingNodesSchema,
    },
    routeLoads: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: nonnegative,
    },
    routeLengths: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: { type: "number", minimum: 0 },
    },
    totalLength: { type: "number", minimum: 0 },
    randomness: generatorReplaySchema,
  },
  required: [
    "points",
    "distances",
    "demands",
    "vehicleCapacity",
    "routes",
    "routeLoads",
    "routeLengths",
    "totalLength",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is VehicleRoutingInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateVehicleRoutingInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<VehicleRoutingInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumDemand < input.minimumDemand)
      simpleError(
        "maximumDemand",
        "Demand bounds must be ordered.",
        "invalid_integer_range",
      );
    const largestRoute = Math.ceil(input.customerCount / input.vehicleCount);
    if (
      BigInt(largestRoute) * BigInt(input.maximumDemand) >
      BigInt(input.vehicleCapacity)
    )
      simpleError(
        "vehicleCapacity",
        "Capacity must cover ceil(customerCount / vehicleCount) times maximumDemand to guarantee the planted construction.",
        "insufficient_construction_capacity",
      );
    const random = createGeneratorRandom(input.seed, context);
    const geometry = constructRoutingGeometry(
      input.customerCount + 1,
      input.minimumCoordinate,
      input.maximumCoordinate,
      random,
    );
    const demands = [
      0,
      ...Array.from({ length: input.customerCount }, () =>
        random.integer(input.minimumDemand, input.maximumDemand),
      ),
    ];
    const routes: number[][] = Array.from(
      { length: input.vehicleCount },
      () => [0],
    );
    random
      .shuffle(Array.from({ length: input.customerCount }, (_, i) => i + 1))
      .forEach((customer, index) =>
        routes[index % input.vehicleCount].push(customer),
      );
    for (const route of routes) route.push(0);
    const routeLoads = routes.map((route) =>
      exactInstanceSum(
        route.map((node) => demands[node]),
        "maximumDemand",
      ),
    );
    const routeLengths = routes.map((route) =>
      routingTourLength(route, geometry.distances),
    );
    const totalLength = routeLengths.reduce((a, b) => a + b, 0);
    if (!Number.isFinite(totalLength))
      simpleError(
        "maximumCoordinate",
        "The total route length must be finite.",
        "numeric_overflow",
      );
    return toolSuccess({
      ...geometry,
      demands,
      vehicleCapacity: input.vehicleCapacity,
      routes,
      routeLoads,
      routeLengths,
      totalLength,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const vehicleRoutingInstanceExample = {
  input: {
    customerCount: 5,
    vehicleCount: 2,
    vehicleCapacity: 9,
    minimumDemand: 1,
    maximumDemand: 3,
    minimumCoordinate: 0,
    maximumCoordinate: 10,
    seed: 42,
  },
  output: {
    points: [
      [6, 4],
      [9, 7],
      [1, 5],
      [3, 6],
      [9, 5],
      [2, 9],
    ],
    distances: [
      [
        0, 4.242640687119286, 5.099019513592785, 3.6055512754639896,
        3.1622776601683795, 6.4031242374328485,
      ],
      [
        4.242640687119286, 0, 8.246211251235321, 6.0827625302982185, 2,
        7.280109889280519,
      ],
      [
        5.099019513592785, 8.246211251235321, 0, 2.23606797749979, 8,
        4.123105625617661,
      ],
      [
        3.6055512754639896, 6.0827625302982185, 2.23606797749979, 0,
        6.0827625302982185, 3.1622776601683795,
      ],
      [3.1622776601683795, 2, 8, 6.0827625302982185, 0, 8.06225774829855],
      [
        6.4031242374328485, 7.280109889280519, 4.123105625617661,
        3.1622776601683795, 8.06225774829855, 0,
      ],
    ],
    demands: [0, 3, 1, 1, 2, 3],
    vehicleCapacity: 9,
    routes: [
      [0, 5, 2, 4, 0],
      [0, 3, 1, 0],
    ],
    routeLoads: [6, 4],
    routeLengths: [21.688507523218888, 13.930954492881494],
    totalLength: 35.619462016100385,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  VehicleRoutingInstanceInput,
  VehicleRoutingInstanceOutput
>;
export const vehicleRoutingInstanceTool = createModelDefinition<
  VehicleRoutingInstanceInput,
  VehicleRoutingInstanceOutput
>({
  id: "random/vehicle-routing-instance",
  title: "Random Capacitated Vehicle Routing Instance Generator",
  description:
    "Generate a single-depot Euclidean capacitated routing instance for identical vehicles with positive integer demands and a planted round-robin feasible route set; dimension/bound combinations must guarantee capacity, with no optimality or real-road claim.",
  inputSchema,
  outputSchema,
  execute: calculateVehicleRoutingInstance,
});
export const runVehicleRoutingInstance = vehicleRoutingInstanceTool.execute;
export default vehicleRoutingInstanceTool;
