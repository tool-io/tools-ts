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
  snDistinct,
  snFrequencies,
  snId,
  snInteger,
  snObject,
  snSample,
} from "../m250-sampling-narrative-support.js";

export type SplitSizes = {
  readonly train: number;
  readonly validation: number;
  readonly test: number;
};
export type SplitRow = {
  readonly id: string;
  readonly group: string;
  readonly stratum: string;
};
export type TrainValidationTestSplitInput = {
  readonly rows: readonly SplitRow[];
  readonly sizes: SplitSizes;
  readonly grouping: "row" | "group";
  readonly stratification: "none" | "exact";
  readonly stratumQuotas: readonly (SplitSizes & {
    readonly stratum: string;
  })[];
  readonly seed?: number;
};
export type TrainValidationTestSplitOutput = {
  readonly train: readonly string[];
  readonly validation: readonly string[];
  readonly test: readonly string[];
  readonly strata: readonly (SplitSizes & { readonly stratum: string })[];
  readonly groups: readonly {
    readonly group: string;
    readonly splits: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const names = ["train", "validation", "test"] as const;
const sizesSchema = snObject({
  train: snInteger,
  validation: snInteger,
  test: snInteger,
});
const quotaSchema = snObject({
  stratum: snId,
  train: snInteger,
  validation: snInteger,
  test: snInteger,
});
export const inputSchema = snObject(
  {
    rows: snArray(snObject({ id: snId, group: snId, stratum: snId }), 128),
    sizes: sizesSchema,
    grouping: { type: "string", enum: ["row", "group"] },
    stratification: { type: "string", enum: ["none", "exact"] },
    stratumQuotas: snArray(quotaSchema, 128),
    seed: generatorSeedSchema,
  },
  ["rows", "sizes", "grouping", "stratification", "stratumQuotas"],
);
export const outputSchema = snObject({
  train: snArray(snId, 128),
  validation: snArray(snId, 128),
  test: snArray(snId, 128),
  strata: snArray(quotaSchema, 128),
  groups: snArray(
    snObject({
      group: snId,
      splits: snArray({ type: "string", enum: names }, 3),
    }),
    128,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is TrainValidationTestSplitInput =>
  matchesModelInput(input, inputSchema);
export const calculateTrainValidationTestSplit = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TrainValidationTestSplitOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(
      input.rows.map((row) => row.id),
      "rows",
    );
    snDistinct(
      input.stratumQuotas.map((quota) => quota.stratum),
      "stratumQuotas",
    );
    if (
      names.some((name) => input.sizes[name] > input.rows.length) ||
      names.reduce((sum, name) => sum + input.sizes[name], 0) !==
        input.rows.length
    )
      simpleError(
        "sizes",
        "Split counts must sum exactly to supplied rows.",
        "infeasible_sizes",
      );
    const strata = [...new Set(input.rows.map((row) => row.stratum))],
      populations = snFrequencies(input.rows.map((row) => row.stratum));
    if (input.stratification === "none" && input.stratumQuotas.length)
      simpleError(
        "stratumQuotas",
        "Unstratified mode requires an empty quota list.",
        "unexpected_quotas",
      );
    if (input.stratification === "exact") {
      if (
        input.stratumQuotas.length !== strata.length ||
        input.stratumQuotas.some(
          (quota) =>
            !strata.includes(quota.stratum) ||
            names.some((name) => quota[name] > input.rows.length) ||
            names.reduce((sum, name) => sum + quota[name], 0) !==
              populations.get(quota.stratum),
        ) ||
        names.some(
          (name) =>
            input.stratumQuotas.reduce((sum, quota) => sum + quota[name], 0) !==
            input.sizes[name],
        )
      )
        simpleError(
          "stratumQuotas",
          "Every stratum and split must have matching exact row totals.",
          "infeasible_stratum_quotas",
        );
    }
    const random = createGeneratorRandom(input.seed, context),
      assigned: number[][] = [[], [], []];
    if (input.grouping === "row") {
      const pools =
        input.stratification === "none"
          ? [
              {
                stratum: "",
                rows: input.rows.map((_, i) => i),
                quotas: input.sizes,
              },
            ]
          : input.stratumQuotas.map((quota) => ({
              stratum: quota.stratum,
              rows: input.rows.flatMap((row, i) =>
                row.stratum === quota.stratum ? [i] : [],
              ),
              quotas: quota,
            }));
      for (const pool of pools) {
        const order = snSample(pool.rows, pool.rows.length, false, random);
        let start = 0;
        names.forEach((name, split) => {
          assigned[split].push(
            ...order.slice(start, start + pool.quotas[name]),
          );
          start += pool.quotas[name];
        });
      }
    } else {
      // Mixed-stratum groups are supported: each group contributes an exact count vector.
      const dimensions = input.stratification === "exact" ? strata : [""];
      const remaining = names.map((name) =>
        dimensions.map((stratum) =>
          input.stratification === "none"
            ? input.sizes[name]
            : (input.stratumQuotas.find((quota) => quota.stratum === stratum)?.[
                name
              ] ?? 0),
        ),
      );
      const groupIds = [...new Set(input.rows.map((row) => row.group))];
      const groups = snSample(groupIds, groupIds.length, false, random)
        .map((id) => {
          const rows = input.rows.flatMap((row, i) =>
            row.group === id ? [i] : [],
          );
          return {
            rows,
            counts: dimensions.map((stratum) =>
              input.stratification === "none"
                ? rows.length
                : rows.filter((i) => input.rows[i].stratum === stratum).length,
            ),
          };
        })
        .sort((a, b) => b.rows.length - a.rows.length);
      const decisions: number[] = [],
        dead = new Set<string>();
      let visits = 0;
      const search = (index: number): boolean => {
        if (++visits > 200000)
          return simpleError(
            "grouping",
            "Exact whole-group search exceeded 200000 visits.",
            "search_budget_exceeded",
          );
        if (index === groups.length)
          return remaining.every((vector) =>
            vector.every((value) => value === 0),
          );
        const key = `${index}:${remaining.flat().join(",")}`;
        if (dead.has(key)) return false;
        const group = groups[index];
        const eligible = names.flatMap((_, split) =>
          group.counts.every((value, dim) => value <= remaining[split][dim])
            ? [split]
            : [],
        );
        for (const split of snSample(
          eligible,
          eligible.length,
          false,
          random,
        )) {
          group.counts.forEach((value, dim) => {
            remaining[split][dim] -= value;
          });
          decisions[index] = split;
          if (search(index + 1)) return true;
          group.counts.forEach((value, dim) => {
            remaining[split][dim] += value;
          });
        }
        dead.add(key);
        return false;
      };
      if (!search(0))
        simpleError(
          "grouping",
          "No whole-group assignment satisfies the exact row/stratum quotas.",
          "infeasible_group_split",
        );
      groups.forEach((group, index) =>
        assigned[decisions[index]].push(...group.rows),
      );
    }
    const output = {
      train: assigned[0].map((i) => input.rows[i].id),
      validation: assigned[1].map((i) => input.rows[i].id),
      test: assigned[2].map((i) => input.rows[i].id),
      strata: strata.map((stratum) => ({
        stratum,
        train: assigned[0].filter((i) => input.rows[i].stratum === stratum)
          .length,
        validation: assigned[1].filter((i) => input.rows[i].stratum === stratum)
          .length,
        test: assigned[2].filter((i) => input.rows[i].stratum === stratum)
          .length,
      })),
      groups: [...new Set(input.rows.map((row) => row.group))].map((group) => ({
        group,
        splits: names.filter((_, split) =>
          assigned[split].some((i) => input.rows[i].group === group),
        ),
      })),
      randomness: generatorReplay(input.seed, context),
    };
    return toolSuccess(snBoundOutput(output));
  } catch (error) {
    return generatorFailure(error);
  }
};
export const trainValidationTestSplitExample = {
  input: {
    rows: [
      { id: "a", group: "g1", stratum: "oak" },
      { id: "b", group: "g2", stratum: "pine" },
      { id: "c", group: "g3", stratum: "oak" },
      { id: "d", group: "g4", stratum: "pine" },
    ],
    sizes: { train: 2, validation: 1, test: 1 },
    grouping: "row",
    stratification: "none",
    stratumQuotas: [],
    seed: 42,
  },
  output: {
    train: ["c", "b"],
    validation: ["d"],
    test: ["a"],
    strata: [
      { stratum: "oak", train: 1, validation: 0, test: 1 },
      { stratum: "pine", train: 1, validation: 1, test: 0 },
    ],
    groups: [
      { group: "g1", splits: ["test"] },
      { group: "g2", splits: ["train"] },
      { group: "g3", splits: ["train"] },
      { group: "g4", splits: ["validation"] },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  TrainValidationTestSplitInput,
  TrainValidationTestSplitOutput
>;
export const trainValidationTestSplitTool = createModelDefinition<
  TrainValidationTestSplitInput,
  TrainValidationTestSplitOutput
>({
  id: "random/train-validation-test-split",
  title: "Random Train Validation Test Split Generator",
  description:
    "Partition supplied IDs into exact row counts with optional exact stratum quotas and whole-group bounded search; group search returns its first feasible result.",
  inputSchema,
  outputSchema,
  execute: calculateTrainValidationTestSplit,
});
export const runTrainValidationTestSplit = trainValidationTestSplitTool.execute;
export default trainValidationTestSplitTool;
