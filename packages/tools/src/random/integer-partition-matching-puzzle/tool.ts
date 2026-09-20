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
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";

export type IntegerPartitionMatchingPuzzleInput = {
  readonly target: number;
  readonly partCount: number;
  readonly minimumPart: 0 | 1;
  readonly order: "ordered" | "unordered";
  readonly seed?: number;
};
export type IntegerPartitionMatchingPuzzleOutput = {
  readonly parts: readonly number[];
  readonly target: number;
  readonly sum: number;
  readonly order: "ordered" | "unordered";
  readonly minimumPart: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    target: { type: "integer", minimum: 0, maximum: 1000000 },
    partCount: { type: "integer", minimum: 1, maximum: 16 },
    minimumPart: { type: "integer", enum: [0, 1] },
    order: { type: "string", enum: ["ordered", "unordered"] },
    seed: generatorSeedSchema,
  },
  ["target", "partCount", "minimumPart", "order"],
);
export const outputSchema = object({
  parts: array(integer, 16, 1),
  target: integer,
  sum: integer,
  order: { type: "string", enum: ["ordered", "unordered"] },
  minimumPart: integer,
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is IntegerPartitionMatchingPuzzleInput =>
  matchesModelInput(value, inputSchema);
export const calculateIntegerPartitionMatchingPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IntegerPartitionMatchingPuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.target < input.partCount * input.minimumPart)
      simpleError(
        "partCount",
        "The target cannot supply the requested minimum parts.",
        "infeasible_partition",
      );
    let left = input.target;
    const parts: number[] = [];
    for (let i = 0; i < input.partCount - 1; i++) {
      const v = random.integer(
        input.minimumPart,
        left - (input.partCount - i - 1) * input.minimumPart,
      );
      parts.push(v);
      left -= v;
    }
    parts.push(left);
    if (input.partCount === 1) random.unit();
    if (input.order === "unordered") parts.sort((a, b) => a - b);
    const result = {
      parts,
      target: input.target,
      sum: sum(parts),
      order: input.order,
      minimumPart: input.minimumPart,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const integerPartitionMatchingPuzzleExample = {
  input: {
    target: 10,
    partCount: 3,
    minimumPart: 1,
    order: "unordered",
    seed: 42,
  },
  output: {
    parts: [2, 3, 5],
    target: 10,
    sum: 10,
    order: "unordered",
    minimumPart: 1,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  IntegerPartitionMatchingPuzzleInput,
  IntegerPartitionMatchingPuzzleOutput
>;
export const integerPartitionMatchingPuzzleTool = createModelDefinition<
  IntegerPartitionMatchingPuzzleInput,
  IntegerPartitionMatchingPuzzleOutput
>({
  id: "random/integer-partition-matching-puzzle",
  title: "Random Integer Partition Matching Puzzle Generator",
  description:
    "Construct bounded positive or nonnegative integer compositions and optional canonical unordered partitions, retaining exact sum and conventions.",
  inputSchema,
  outputSchema,
  execute: calculateIntegerPartitionMatchingPuzzle,
});
export const runIntegerPartitionMatchingPuzzle =
  integerPartitionMatchingPuzzleTool.execute;
export default integerPartitionMatchingPuzzleTool;
