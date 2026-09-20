import type { ToolExecutionContext } from "../../core/definition.js";
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
import { calculateCartesianProduct } from "../../list/cartesian-product/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  snArray,
  snBoundOutput,
  snDistinct,
  snFrequencies,
  snId,
  snInteger,
  snObject,
  snSample,
} from "../m250-sampling-narrative-support.js";

export type BalancedFactorialAssignmentInput = {
  readonly factors: readonly {
    readonly name: string;
    readonly levels: readonly string[];
  }[];
  readonly unitIds: readonly string[];
  readonly replication: number;
  readonly seed?: number;
};
export type BalancedFactorialAssignmentOutput = {
  readonly factorNames: readonly string[];
  readonly combinations: readonly {
    readonly index: number;
    readonly levels: readonly string[];
    readonly count: number;
  }[];
  readonly assignments: readonly {
    readonly unitId: string;
    readonly combinationIndex: number;
    readonly levels: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = snObject(
  {
    factors: snArray(
      snObject({ name: snId, levels: snArray(snId, 16, 1) }),
      8,
      1,
    ),
    unitIds: snArray(snId, 512, 1),
    replication: { type: "integer", minimum: 1, maximum: 512 },
    seed: generatorSeedSchema,
  },
  ["factors", "unitIds", "replication"],
);
export const outputSchema = snObject({
  factorNames: snArray(snId, 8, 1),
  combinations: snArray(
    snObject({
      index: snInteger,
      levels: snArray(snId, 8, 1),
      count: snInteger,
    }),
    256,
    1,
  ),
  assignments: snArray(
    snObject({
      unitId: snId,
      combinationIndex: snInteger,
      levels: snArray(snId, 8, 1),
    }),
    512,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is BalancedFactorialAssignmentInput =>
  matchesModelInput(input, inputSchema);
export const calculateBalancedFactorialAssignment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BalancedFactorialAssignmentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(input.unitIds, "unitIds");
    snDistinct(
      input.factors.map((factor) => factor.name),
      "factors",
    );
    let combinations: string[][] = [[]];
    for (const factor of input.factors) {
      snDistinct(factor.levels, "factors");
      if (combinations.length * factor.levels.length > 256)
        simpleError(
          "factors",
          "The factorial product exceeds 256 combinations.",
          "resource_limit_exceeded",
        );
      const pairs = calculateCartesianProduct({
        first: combinations.map((_, i) => i),
        second: factor.levels.map((_, i) => i),
      }).pairs;
      combinations = pairs.map(([prefix, level]) => [
        ...combinations[prefix],
        factor.levels[level],
      ]);
    }
    if (combinations.length * input.replication !== input.unitIds.length)
      simpleError(
        "unitIds",
        "Unit count must equal factorial combinations times exact replication.",
        "infeasible_replication",
      );
    const slots = combinations.flatMap((_, index) =>
        Array.from({ length: input.replication }, () => index),
      ),
      random = createGeneratorRandom(input.seed, context);
    const randomized = snSample(slots, slots.length, false, random),
      counts = snFrequencies(randomized.map(String));
    const assignments = input.unitIds.map((unitId, i) => ({
      unitId,
      combinationIndex: randomized[i],
      levels: [...combinations[randomized[i]]],
    }));
    return toolSuccess(
      snBoundOutput({
        factorNames: input.factors.map((factor) => factor.name),
        combinations: combinations.map((levels, index) => ({
          index,
          levels,
          count: counts.get(String(index)) ?? 0,
        })),
        assignments,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const balancedFactorialAssignmentExample = {
  input: {
    factors: [
      { name: "temperature", levels: ["low", "high"] },
      { name: "time", levels: ["short", "long"] },
    ],
    unitIds: ["u1", "u2", "u3", "u4"],
    replication: 1,
    seed: 42,
  },
  output: {
    factorNames: ["temperature", "time"],
    combinations: [
      { index: 0, levels: ["low", "short"], count: 1 },
      { index: 1, levels: ["low", "long"], count: 1 },
      { index: 2, levels: ["high", "short"], count: 1 },
      { index: 3, levels: ["high", "long"], count: 1 },
    ],
    assignments: [
      { unitId: "u1", combinationIndex: 2, levels: ["high", "short"] },
      { unitId: "u2", combinationIndex: 1, levels: ["low", "long"] },
      { unitId: "u3", combinationIndex: 3, levels: ["high", "long"] },
      { unitId: "u4", combinationIndex: 0, levels: ["low", "short"] },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  BalancedFactorialAssignmentInput,
  BalancedFactorialAssignmentOutput
>;
export const balancedFactorialAssignmentTool = createModelDefinition<
  BalancedFactorialAssignmentInput,
  BalancedFactorialAssignmentOutput
>({
  id: "random/balanced-factorial-assignment",
  title: "Random Balanced Factorial Assignment Generator",
  description:
    "Construct every supplied factor combination and randomly assign distinct units under exact equal replication quotas for caller-reviewed experiments.",
  inputSchema,
  outputSchema,
  execute: calculateBalancedFactorialAssignment,
});
export const runBalancedFactorialAssignment =
  balancedFactorialAssignmentTool.execute;
export default balancedFactorialAssignmentTool;
