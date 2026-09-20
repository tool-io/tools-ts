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
  snCopyRecord,
  snDistinct,
  snExpansionBudget,
  snFrequencies,
  snId,
  snInteger,
  snObject,
  snProbability,
  snSample,
  snText,
  type SamplingRecord,
} from "../m250-sampling-narrative-support.js";

export type StratifiedSampleRow = SamplingRecord & { readonly stratum: string };
export type StratifiedRowSampleInput = {
  readonly rows: readonly StratifiedSampleRow[];
  readonly quotas: readonly {
    readonly stratum: string;
    readonly count: number;
    readonly replacement: boolean;
  }[];
  readonly seed?: number;
};
export type StratifiedRowSampleOutput = {
  readonly draws: readonly {
    readonly sourceIndex: number;
    readonly row: StratifiedSampleRow;
  }[];
  readonly inclusion: readonly {
    readonly rowId: string;
    readonly stratum: string;
    readonly population: number;
    readonly quota: number;
    readonly draws: number;
    readonly probability: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const rowSchema = snObject({
  id: snId,
  values: snArray(snText, 32),
  stratum: snId,
});
export const inputSchema = snObject(
  {
    rows: snArray(rowSchema, 512),
    quotas: snArray(
      snObject({
        stratum: snId,
        count: { type: "integer", minimum: 0, maximum: 4096 },
        replacement: { type: "boolean" },
      }),
      64,
    ),
    seed: generatorSeedSchema,
  },
  ["rows", "quotas"],
);
export const outputSchema = snObject({
  draws: snArray(snObject({ sourceIndex: snInteger, row: rowSchema }), 4096),
  inclusion: snArray(
    snObject({
      rowId: snId,
      stratum: snId,
      population: snInteger,
      quota: snInteger,
      draws: snInteger,
      probability: snProbability,
    }),
    512,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is StratifiedRowSampleInput =>
  matchesModelInput(input, inputSchema);
export const calculateStratifiedRowSample = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StratifiedRowSampleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(
      input.rows.map((row) => row.id),
      "rows",
    );
    snDistinct(
      input.quotas.map((quota) => quota.stratum),
      "quotas",
    );
    const populations = snFrequencies(input.rows.map((row) => row.stratum));
    if (input.quotas.reduce((sum, quota) => sum + quota.count, 0) > 4096)
      simpleError(
        "quotas",
        "Total draws must not exceed 4096.",
        "resource_limit_exceeded",
      );
    for (const quota of input.quotas) {
      const size = populations.get(quota.stratum) ?? 0;
      if (
        quota.count > 0 &&
        (size === 0 || (!quota.replacement && quota.count > size))
      )
        simpleError(
          "quotas",
          `Stratum ${quota.stratum} cannot satisfy its requested quota.`,
          "infeasible_stratum",
        );
    }
    snExpansionBudget(
      input.rows,
      input.quotas.reduce((sum, quota) => sum + quota.count, 0),
      "quotas",
    );
    const random = createGeneratorRandom(input.seed, context),
      draws = input.quotas.flatMap((quota) => {
        const pool = input.rows.flatMap((row, i) =>
          row.stratum === quota.stratum ? [i] : [],
        );
        return snSample(pool, quota.count, quota.replacement, random).map(
          (sourceIndex) => ({
            sourceIndex,
            row: {
              ...snCopyRecord(input.rows[sourceIndex]),
              stratum: quota.stratum,
            },
          }),
        );
      });
    const counts = snFrequencies(draws.map((draw) => draw.row.id));
    const inclusion = input.rows.map((row) => {
      const quota = input.quotas.find((entry) => entry.stratum === row.stratum),
        population = populations.get(row.stratum) ?? 0,
        count = quota?.count ?? 0;
      const probability =
        count === 0
          ? 0
          : quota?.replacement
            ? population === 1
              ? 1
              : -Math.expm1(count * Math.log1p(-1 / population))
            : count / population;
      return {
        rowId: row.id,
        stratum: row.stratum,
        population,
        quota: count,
        draws: counts.get(row.id) ?? 0,
        probability,
      };
    });
    return toolSuccess(
      snBoundOutput({
        draws,
        inclusion,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const stratifiedRowSampleExample = {
  input: {
    rows: [
      { id: "n1", stratum: "north", values: ["oak"] },
      { id: "n2", stratum: "north", values: ["pine"] },
      { id: "s1", stratum: "south", values: ["elm"] },
    ],
    quotas: [
      { stratum: "north", count: 1, replacement: false },
      { stratum: "south", count: 1, replacement: false },
    ],
    seed: 42,
  },
  output: {
    draws: [
      { sourceIndex: 1, row: { id: "n2", values: ["pine"], stratum: "north" } },
      { sourceIndex: 2, row: { id: "s1", values: ["elm"], stratum: "south" } },
    ],
    inclusion: [
      {
        rowId: "n1",
        stratum: "north",
        population: 2,
        quota: 1,
        draws: 0,
        probability: 0.5,
      },
      {
        rowId: "n2",
        stratum: "north",
        population: 2,
        quota: 1,
        draws: 1,
        probability: 0.5,
      },
      {
        rowId: "s1",
        stratum: "south",
        population: 1,
        quota: 1,
        draws: 1,
        probability: 1,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  StratifiedRowSampleInput,
  StratifiedRowSampleOutput
>;
export const stratifiedRowSampleTool = createModelDefinition<
  StratifiedRowSampleInput,
  StratifiedRowSampleOutput
>({
  id: "random/stratified-row-sample",
  title: "Random Stratified Row Sample Generator",
  description:
    "Sample supplied records under exact stratum quotas and replacement rules, retaining row inclusion probabilities and observed draw counts.",
  inputSchema,
  outputSchema,
  execute: calculateStratifiedRowSample,
});
export const runStratifiedRowSample = stratifiedRowSampleTool.execute;
export default stratifiedRowSampleTool;
