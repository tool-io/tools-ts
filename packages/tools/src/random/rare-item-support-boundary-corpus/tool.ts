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
import { mineFrequentItemsets } from "../../data-mining/apriori/tool.js";
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
  labelSchema,
  positiveSupportSchema,
  integerSchema,
  numberSchema,
  nullable,
  distinctLabels,
  pickItem,
} from "../m250-algorithms-common.js";

export type RareItemSupportBoundaryCorpusInput = {
  readonly target: string;
  readonly backgroundItems: readonly string[];
  readonly transactionCount: number;
  readonly minimumSupport: number;
  readonly seed?: number;
};
export type RareItemSupportBoundaryCorpusOutput = {
  readonly minimumCount: number;
  readonly cases: readonly {
    readonly position: "below" | "at" | "above";
    readonly transactions: readonly (readonly string[])[];
    readonly targetCount: number;
    readonly support: number;
    readonly frequent: boolean;
    readonly coreSupport: number | null;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    target: labelSchema,
    backgroundItems: arraySchema(labelSchema, 5, 1),
    transactionCount: integerSchema(2, 128),
    minimumSupport: positiveSupportSchema,
    seed: generatorSeedSchema,
  },
  ["target", "backgroundItems", "transactionCount", "minimumSupport"],
);
export const outputSchema = objectSchema({
  minimumCount: integerSchema(1, 127),
  cases: arraySchema(
    objectSchema({
      position: { type: "string", enum: ["below", "at", "above"] },
      transactions: arraySchema(arraySchema(labelSchema, 6, 1), 128, 2),
      targetCount: integerSchema(0, 128),
      support: numberSchema,
      frequent: { type: "boolean" },
      coreSupport: nullable(numberSchema),
    }),
    3,
    3,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is RareItemSupportBoundaryCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateRareItemSupportBoundaryCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RareItemSupportBoundaryCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinctLabels([input.target, ...input.backgroundItems], "backgroundItems");
    const minimumCount = Math.ceil(
      input.minimumSupport * input.transactionCount,
    );
    if (minimumCount >= input.transactionCount)
      simpleError(
        "minimumSupport",
        "The cutoff must leave room for the above-cutoff corpus.",
        "infeasible_support_boundary",
      );
    const random = createGeneratorRandom(input.seed, context);
    const positions = ["below", "at", "above"] as const;
    const cases = positions.map((position, i) => {
      const targetCount = minimumCount + i - 1;
      const present = new Set(
        random
          .shuffle(
            Array.from({ length: input.transactionCount }, (_, index) => index),
          )
          .slice(0, targetCount),
      );
      const transactions = Array.from(
        { length: input.transactionCount },
        (_, index) => {
          const row = new Set([pickItem(input.backgroundItems, random)]);
          if (present.has(index)) row.add(input.target);
          return [...row].sort();
        },
      );
      const core = mineFrequentItemsets(transactions, input.minimumSupport, 1);
      if (!core)
        throw new Error("Constructed boundary baskets failed Apriori.");
      const target = core.frequentItemsets.find(
        (set) => set.items[0] === input.target,
      );
      return {
        position,
        transactions,
        targetCount,
        support: targetCount / input.transactionCount,
        frequent: target !== undefined,
        coreSupport: target?.support ?? null,
      };
    });
    return toolSuccess({
      minimumCount,
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const rareItemSupportBoundaryCorpusExample = {
  input: {
    target: "rare",
    backgroundItems: ["tea"],
    transactionCount: 4,
    minimumSupport: 0.5,
    seed: 42,
  },
  output: {
    minimumCount: 2,
    cases: [
      {
        position: "below",
        transactions: [["rare", "tea"], ["tea"], ["tea"], ["tea"]],
        targetCount: 1,
        support: 0.25,
        frequent: false,
        coreSupport: null,
      },
      {
        position: "at",
        transactions: [["rare", "tea"], ["rare", "tea"], ["tea"], ["tea"]],
        targetCount: 2,
        support: 0.5,
        frequent: true,
        coreSupport: 0.5,
      },
      {
        position: "above",
        transactions: [
          ["tea"],
          ["rare", "tea"],
          ["rare", "tea"],
          ["rare", "tea"],
        ],
        targetCount: 3,
        support: 0.75,
        frequent: true,
        coreSupport: 0.75,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RareItemSupportBoundaryCorpusInput,
  RareItemSupportBoundaryCorpusOutput
>;
export const rareItemSupportBoundaryCorpusTool = createModelDefinition<
  RareItemSupportBoundaryCorpusInput,
  RareItemSupportBoundaryCorpusOutput
>({
  id: "random/rare-item-support-boundary-corpus",
  title: "Random Rare Item Support Boundary Corpus Generator",
  description:
    "Construct synthetic baskets one occurrence below, at and above the discrete support cutoff, with sampled background items and delegated Apriori boundary outcomes.",
  inputSchema,
  outputSchema,
  execute: calculateRareItemSupportBoundaryCorpus,
});
export const runRareItemSupportBoundaryCorpus =
  rareItemSupportBoundaryCorpusTool.execute;
export default rareItemSupportBoundaryCorpusTool;
