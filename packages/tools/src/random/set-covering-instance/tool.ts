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
import { constructPlantedSetFamily } from "../planted-set-family.js";
import {
  positiveInstanceIntegerSchema as positive,
  exactInstanceSum,
  orderedInstanceRange,
} from "../optimization-instance-integers.js";

export type SetCoveringInstanceInput = {
  readonly universeSize: number;
  readonly setCount: number;
  readonly plantedSetCount: number;
  readonly extraInclusionProbability: number;
  readonly minimumCost: number;
  readonly maximumCost: number;
  readonly seed?: number;
};
export type SetCoveringInstanceOutput = {
  readonly universe: readonly number[];
  readonly subsets: readonly (readonly number[])[];
  readonly costs: readonly number[];
  readonly witnessIndices: readonly number[];
  readonly witnessCost: number;
  readonly randomness: GeneratorReplay;
};
const elements = {
  type: "array",
  minItems: 1,
  maxItems: 64,
  items: { type: "integer", minimum: 0, maximum: 63 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universeSize: { type: "integer", minimum: 1, maximum: 64 },
    setCount: { type: "integer", minimum: 1, maximum: 128 },
    plantedSetCount: { type: "integer", minimum: 1, maximum: 64 },
    extraInclusionProbability: { type: "number", minimum: 0, maximum: 1 },
    minimumCost: positive,
    maximumCost: positive,
    seed: generatorSeedSchema,
  },
  required: [
    "universeSize",
    "setCount",
    "plantedSetCount",
    "extraInclusionProbability",
    "minimumCost",
    "maximumCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: elements,
    subsets: { type: "array", minItems: 1, maxItems: 128, items: elements },
    costs: { type: "array", minItems: 1, maxItems: 128, items: positive },
    witnessIndices: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "integer", minimum: 0, maximum: 127 },
    },
    witnessCost: positive,
    randomness: generatorReplaySchema,
  },
  required: [
    "universe",
    "subsets",
    "costs",
    "witnessIndices",
    "witnessCost",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is SetCoveringInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateSetCoveringInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SetCoveringInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(input.minimumCost, input.maximumCost, "maximumCost");
    const random = createGeneratorRandom(input.seed, context);
    const family = constructPlantedSetFamily(
      input.universeSize,
      input.setCount,
      input.plantedSetCount,
      input.extraInclusionProbability,
      random,
    );
    const costs = family.subsets.map(() =>
      random.integer(input.minimumCost, input.maximumCost),
    );
    const witnessCost = exactInstanceSum(
      family.witnessIndices.map((i) => costs[i]),
      "maximumCost",
    );
    return toolSuccess({
      ...family,
      costs,
      witnessCost,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const setCoveringInstanceExample = {
  input: {
    universeSize: 6,
    setCount: 5,
    plantedSetCount: 2,
    extraInclusionProbability: 0.4,
    minimumCost: 2,
    maximumCost: 9,
    seed: 42,
  },
  output: {
    universe: [0, 1, 2, 3, 4, 5],
    subsets: [[1, 5], [0, 2, 3, 4], [1, 4, 5], [3], [0, 2, 3, 4, 5]],
    costs: [8, 6, 2, 3, 8],
    witnessIndices: [0, 1],
    witnessCost: 14,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<SetCoveringInstanceInput, SetCoveringInstanceOutput>;
export const setCoveringInstanceTool = createModelDefinition<
  SetCoveringInstanceInput,
  SetCoveringInstanceOutput
>({
  id: "random/set-covering-instance",
  title: "Random Set Covering Instance Generator",
  description:
    "Generate a nonempty finite subset family and positive costs with a planted cover witness; feasible selections may cover elements multiple times, duplicate columns allowed, with no minimum-cost claim.",
  inputSchema,
  outputSchema,
  execute: calculateSetCoveringInstance,
});
export const runSetCoveringInstance = setCoveringInstanceTool.execute;
export default setCoveringInstanceTool;
