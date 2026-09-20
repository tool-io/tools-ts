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
import { runMean } from "../../statistics/mean/tool.js";

export type ParallelCoordinateProfileDatasetInput = {
  readonly axes: readonly string[];
  readonly centers: readonly number[];
  readonly jitter: number;
  readonly count: number;
  readonly seed?: number;
};
export type ParallelCoordinateProfileDatasetOutput = {
  readonly axes: readonly string[];
  readonly centers: readonly number[];
  readonly values: readonly (readonly number[])[];
  readonly means: readonly number[];
  readonly jitter: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    axes: array(label, 8, 2),
    centers: array(integer, 8, 2),
    jitter: { type: "integer", minimum: 0, maximum: 1000000 },
    count: { type: "integer", minimum: 1, maximum: 8 },
    seed: generatorSeedSchema,
  },
  ["axes", "centers", "jitter", "count"],
);
export const outputSchema = object({
  axes: array(label, 8, 2),
  centers: array(integer, 8, 2),
  values: array(array(integer, 8, 2), 8, 1),
  means: array(number, 8, 1),
  jitter: integer,
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is ParallelCoordinateProfileDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateParallelCoordinateProfileDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ParallelCoordinateProfileDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.axes, "axes");
    if (input.axes.length !== input.centers.length)
      simpleError(
        "centers",
        "One center is required per axis.",
        "shape_mismatch",
      );
    for (const c of input.centers) {
      safe(c - input.jitter, "centers");
      safe(c + input.jitter, "centers");
    }
    const values = Array.from({ length: input.count }, () =>
      input.centers.map((c) =>
        safe(c + random.integer(-input.jitter, input.jitter)),
      ),
    );
    for (const row of values) finite(row.reduce((a, b) => a + b, 0));
    const means = values.map((row) =>
      finite(core(runMean({ values: row })).mean),
    );
    const result = {
      axes: [...input.axes],
      centers: [...input.centers],
      values,
      means,
      jitter: input.jitter,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const parallelCoordinateProfileDatasetExample = {
  input: { axes: ["x", "y"], centers: [10, 20], jitter: 1, count: 1, seed: 42 },
  output: {
    axes: ["x", "y"],
    centers: [10, 20],
    values: [[10, 20]],
    means: [15],
    jitter: 1,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ParallelCoordinateProfileDatasetInput,
  ParallelCoordinateProfileDatasetOutput
>;
export const parallelCoordinateProfileDatasetTool = createModelDefinition<
  ParallelCoordinateProfileDatasetInput,
  ParallelCoordinateProfileDatasetOutput
>({
  id: "random/parallel-coordinate-profile-dataset",
  title: "Random Parallel Coordinate Profile Dataset Generator",
  description:
    "Generate planted feature profiles with bounded additive integer jitter and explicit shared axes, centers and per-profile means.",
  inputSchema,
  outputSchema,
  execute: calculateParallelCoordinateProfileDataset,
});
export const runParallelCoordinateProfileDataset =
  parallelCoordinateProfileDatasetTool.execute;
export default parallelCoordinateProfileDatasetTool;
