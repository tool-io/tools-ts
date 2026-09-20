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

export type MinCostFlowInstanceInput = {
  readonly nodeCount: number;
  readonly arcCount: number;
  readonly minimumCapacity: number;
  readonly maximumCapacity: number;
  readonly requiredFlow: number;
  readonly minimumCost: number;
  readonly maximumCost: number;
  readonly seed?: number;
};
export type MinCostFlowInstanceOutput = {
  readonly nodes: readonly number[];
  readonly source: number;
  readonly sink: number;
  readonly arcs: readonly {
    readonly from: number;
    readonly to: number;
    readonly capacity: number;
    readonly unitCost: number;
  }[];
  readonly witnessPath: readonly number[];
  readonly arcFlows: readonly number[];
  readonly flowValue: number;
  readonly totalCost: number;
  readonly randomness: GeneratorReplay;
};
const arc = {
  type: "object",
  additionalProperties: false,
  properties: {
    from: flowNodeSchema,
    to: flowNodeSchema,
    capacity: positive,
    unitCost: nonnegative,
  },
  required: ["from", "to", "capacity", "unitCost"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodeCount: flowNodeCountSchema,
    arcCount: flowArcCountSchema,
    minimumCapacity: positive,
    maximumCapacity: positive,
    requiredFlow: positive,
    minimumCost: nonnegative,
    maximumCost: nonnegative,
    seed: generatorSeedSchema,
  },
  required: [
    "nodeCount",
    "arcCount",
    "minimumCapacity",
    "maximumCapacity",
    "requiredFlow",
    "minimumCost",
    "maximumCost",
  ],
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
    totalCost: nonnegative,
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
    "totalCost",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MinCostFlowInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateMinCostFlowInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MinCostFlowInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumCapacity,
      input.maximumCapacity,
      "maximumCapacity",
    );
    orderedInstanceRange(input.minimumCost, input.maximumCost, "maximumCost");
    if (input.requiredFlow > input.minimumCapacity)
      simpleError(
        "requiredFlow",
        "Required flow must not exceed the minimum generated capacity.",
        "infeasible_flow",
      );
    const random = createGeneratorRandom(input.seed, context);
    const network = constructFlowArcs(input.nodeCount, input.arcCount, random);
    const arcs = network.pairs.map(([from, to]) => ({
      from,
      to,
      capacity: random.integer(input.minimumCapacity, input.maximumCapacity),
      unitCost: random.integer(input.minimumCost, input.maximumCost),
    }));
    const flowValue = input.requiredFlow;
    const arcFlows = arcs.map((_, index) =>
      index < input.nodeCount - 1 ? flowValue : 0,
    );
    const cost = arcs.reduce(
      (sum, arc, i) => sum + BigInt(arcFlows[i]) * BigInt(arc.unitCost),
      0n,
    );
    if (cost > BigInt(Number.MAX_SAFE_INTEGER))
      simpleError(
        "maximumCost",
        "The witness total cost must be a safe integer.",
        "unsafe_aggregate",
      );
    const totalCost = Number(cost);
    return toolSuccess({
      nodes: network.nodes,
      source: 0,
      sink: input.nodeCount - 1,
      arcs,
      witnessPath: network.path,
      arcFlows,
      flowValue,
      totalCost,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const minCostFlowInstanceExample = {
  input: {
    nodeCount: 4,
    arcCount: 6,
    minimumCapacity: 2,
    maximumCapacity: 9,
    requiredFlow: 2,
    minimumCost: 0,
    maximumCost: 5,
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
        unitCost: 1,
      },
      {
        from: 1,
        to: 2,
        capacity: 9,
        unitCost: 4,
      },
      {
        from: 2,
        to: 3,
        capacity: 4,
        unitCost: 1,
      },
      {
        from: 0,
        to: 2,
        capacity: 6,
        unitCost: 4,
      },
      {
        from: 3,
        to: 1,
        capacity: 6,
        unitCost: 0,
      },
      {
        from: 1,
        to: 3,
        capacity: 5,
        unitCost: 5,
      },
    ],
    witnessPath: [0, 1, 2, 3],
    arcFlows: [2, 2, 2, 0, 0, 0],
    flowValue: 2,
    totalCost: 12,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MinCostFlowInstanceInput, MinCostFlowInstanceOutput>;
export const minCostFlowInstanceTool = createModelDefinition<
  MinCostFlowInstanceInput,
  MinCostFlowInstanceOutput
>({
  id: "random/min-cost-flow-instance",
  title: "Random Minimum-Cost Flow Instance Generator",
  description:
    "Generate a capacitated directed network containing a spanning source-to-sink path, with a feasible fixed-amount flow and nonnegative unit costs witness; reverse arcs are allowed, with no cost-minimality claim.",
  inputSchema,
  outputSchema,
  execute: calculateMinCostFlowInstance,
});
export const runMinCostFlowInstance = minCostFlowInstanceTool.execute;
export default minCostFlowInstanceTool;
