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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  enumSchema,
} from "../m500b-csv-algorithms-schemas.js";
import { sortedNumbers } from "../m500b-csv-algorithms-sequence.js";

type IntervalJob = {
  readonly id: number;
  readonly start: number;
  readonly endExclusive: number;
  readonly weight: number;
};
export type IntervalSchedulingChallengeInput = {
  readonly jobCount: number;
  readonly horizon: number;
  readonly maximumDuration: number;
  readonly objective: "count" | "weight";
  readonly seed?: number;
};
export type IntervalSchedulingChallengeOutput = {
  readonly jobs: readonly IntervalJob[];
  readonly selectedIds: readonly number[];
  readonly objectiveValue: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    jobCount: countSchema(16, 1),
    horizon: countSchema(64, 1),
    maximumDuration: countSchema(64, 1),
    objective: enumSchema(["count", "weight"]),
    seed: generatorSeedSchema,
  },
  ["jobCount", "horizon", "maximumDuration", "objective"],
);
export const outputSchema = objectSchema({
  jobs: arraySchema(
    objectSchema({
      id: countSchema(15),
      start: countSchema(63),
      endExclusive: countSchema(64, 1),
      weight: countSchema(9, 1),
    }),
    16,
  ),
  selectedIds: arraySchema(countSchema(15), 16),
  objectiveValue: countSchema(144),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is IntervalSchedulingChallengeInput =>
  matchesModelInput(input, inputSchema);
export const calculateIntervalSchedulingChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IntervalSchedulingChallengeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      jobs = Array.from({ length: input.jobCount }, (_, id) => {
        const start = random.integer(0, input.horizon - 1),
          duration = random.integer(
            1,
            Math.min(input.maximumDuration, input.horizon - start),
          );
        return {
          id,
          start,
          endExclusive: start + duration,
          weight: random.integer(1, 9),
        };
      });
    const pending = [...jobs],
      byFinish = sortedNumbers(jobs.map((job) => job.endExclusive)).map(
        (end) => {
          const index = pending.findIndex((job) => job.endExclusive === end),
            job = pending.splice(index, 1)[0];
          if (index < 0 || !job)
            throw new Error("Sorted interval end lost its job.");
          return job;
        },
      );
    const best: { readonly value: number; readonly ids: readonly number[] }[] =
      [{ value: 0, ids: [] }];
    for (const [index, job] of byFinish.entries()) {
      let predecessor = index - 1;
      while (
        predecessor >= 0 &&
        (byFinish[predecessor]?.endExclusive ?? Infinity) > job.start
      )
        predecessor -= 1;
      const compatible = best[predecessor + 1],
        excluded = best[index];
      if (!compatible || !excluded)
        throw new Error("Interval recurrence state missing.");
      const included = {
        value:
          compatible.value + (input.objective === "weight" ? job.weight : 1),
        ids: [...compatible.ids, job.id],
      };
      best.push(included.value > excluded.value ? included : excluded);
    }
    const answer = best[best.length - 1];
    if (!answer) throw new Error("Interval optimum missing.");
    return toolSuccess({
      jobs,
      selectedIds: [...answer.ids],
      objectiveValue: answer.value,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const intervalSchedulingChallengeExample = {
  input: {
    jobCount: 3,
    horizon: 6,
    maximumDuration: 3,
    objective: "weight",
    seed: 42,
  },
  output: {
    jobs: [
      { id: 0, start: 3, endExclusive: 5, weight: 8 },
      { id: 1, start: 4, endExclusive: 5, weight: 5 },
      { id: 2, start: 1, endExclusive: 3, weight: 8 },
    ],
    selectedIds: [2, 0],
    objectiveValue: 16,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  IntervalSchedulingChallengeInput,
  IntervalSchedulingChallengeOutput
>;
export const intervalSchedulingChallengeTool = createModelDefinition<
  IntervalSchedulingChallengeInput,
  IntervalSchedulingChallengeOutput
>({
  id: "random/interval-scheduling-challenge",
  title: "Random Interval Scheduling Challenge Generator",
  description:
    "Generate synthetic positive-duration half-open jobs and solve the declared count or weight objective exactly with finish-time dynamic programming, retaining one optimum with exclusion on objective ties.",
  inputSchema,
  outputSchema,
  execute: calculateIntervalSchedulingChallenge,
});
export const runIntervalSchedulingChallenge =
  intervalSchedulingChallengeTool.execute;
export default intervalSchedulingChallengeTool;
