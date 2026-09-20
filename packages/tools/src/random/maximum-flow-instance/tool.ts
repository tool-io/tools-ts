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
  flowNodeCountSchema,
  flowArcCountSchema,
  flowNodeSchema,
  flowNodesSchema,
  constructFlowArcs,
} from "../flow-instance-construction.js";
import {
  positiveInstanceIntegerSchema as positive,
  nonnegativeInstanceIntegerSchema as nonnegative,
  orderedInstanceRange,
} from "../optimization-instance-integers.js";

export type MaximumFlowInstanceInput = {
  readonly nodeCount: number;
  readonly arcCount: number;
  readonly minimumCapacity: number;
  readonly maximumCapacity: number;
  readonly seed?: number;
};
export type MaximumFlowInstanceOutput = {
  readonly nodes: readonly number[];
  readonly source: number;
  readonly sink: number;
  readonly arcs: readonly {
    readonly from: number;
    readonly to: number;
    readonly capacity: number;
  }[];
  readonly witnessPath: readonly number[];
  readonly arcFlows: readonly number[];
  readonly flowValue: number;
  readonly randomness: GeneratorReplay;
};
const arc = {
  type: "object",
  additionalProperties: false,
  properties: { from: flowNodeSchema, to: flowNodeSchema, capacity: positive },
  required: ["from", "to", "capacity"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodeCount: flowNodeCountSchema,
    arcCount: flowArcCountSchema,
    minimumCapacity: positive,
    maximumCapacity: positive,
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "arcCount", "minimumCapacity", "maximumCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: flowNodesSchema,
    source: flowNodeSchema,
    sink: flowNodeSchema,
    arcs: { type: "array", minItems: 1, maxItems: 992, items: arc },
    witnessPath: flowNodesSchema,
    arcFlows: { type: "array", minItems: 1, maxItems: 992, items: nonnegative },
    flowValue: positive,
    randomness: generatorReplaySchema,
  },
  required: [
    "nodes",
    "source",
    "sink",
    "arcs",
    "witnessPath",
    "arcFlows",
    "flowValue",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MaximumFlowInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateMaximumFlowInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MaximumFlowInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumCapacity,
      input.maximumCapacity,
      "maximumCapacity",
    );

    const random = createGeneratorRandom(input.seed, context);
    const network = constructFlowArcs(input.nodeCount, input.arcCount, random);
    const arcs = network.pairs.map(([from, to]) => ({
      from,
      to,
      capacity: random.integer(input.minimumCapacity, input.maximumCapacity),
    }));
    const flowValue = Math.min(
      ...arcs.slice(0, input.nodeCount - 1).map((arc) => arc.capacity),
    );
    const arcFlows = arcs.map((_, index) =>
      index < input.nodeCount - 1 ? flowValue : 0,
    );

    return toolSuccess({
      nodes: network.nodes,
      source: 0,
      sink: input.nodeCount - 1,
      arcs,
      witnessPath: network.path,
      arcFlows,
      flowValue,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const maximumFlowInstanceExample = {
  input: {
    nodeCount: 4,
    arcCount: 6,
    minimumCapacity: 2,
    maximumCapacity: 9,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3],
    source: 0,
    sink: 3,
    arcs: [
      {
        from: 0,
        to: 1,
        capacity: 5,
      },
      {
        from: 1,
        to: 2,
        capacity: 3,
      },
      {
        from: 2,
        to: 3,
        capacity: 9,
      },
      {
        from: 0,
        to: 2,
        capacity: 7,
      },
      {
        from: 3,
        to: 1,
        capacity: 4,
      },
      {
        from: 1,
        to: 3,
        capacity: 3,
      },
    ],
    witnessPath: [0, 1, 2, 3],
    arcFlows: [3, 3, 3, 0, 0, 0],
    flowValue: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MaximumFlowInstanceInput, MaximumFlowInstanceOutput>;
export const maximumFlowInstanceTool = createModelDefinition<
  MaximumFlowInstanceInput,
  MaximumFlowInstanceOutput
>({
  id: "random/maximum-flow-instance",
  title: "Random Maximum Flow Instance Generator",
  description:
    "Generate a capacitated directed network containing a spanning source-to-sink path, with a feasible positive flow witness; reverse arcs are allowed, with no maximum-flow claim.",
  inputSchema,
  outputSchema,
  execute: calculateMaximumFlowInstance,
});
export const runMaximumFlowInstance = maximumFlowInstanceTool.execute;
export default maximumFlowInstanceTool;
