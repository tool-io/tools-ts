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
  arraySchema,
  objectSchema,
  labelSchema,
  integerSchema,
  distinctLabels,
} from "../m250-algorithms-common.js";
import {
  mineEvidence,
  miningEvidenceSchema,
  pairMetrics,
  pairMetricsSchema,
  type MiningEvidence,
  type PairMetrics,
} from "../m250-algorithms-mining.js";

export type CooccurrenceLiftContrastCorpusInput = {
  readonly itemA: string;
  readonly itemB: string;
  readonly neitherItem: string;
  readonly designs: readonly {
    readonly label: string;
    readonly transactionCount: number;
    readonly countA: number;
    readonly countB: number;
    readonly jointCount: number;
  }[];
  readonly seed?: number;
};
export type CooccurrenceLiftContrastCorpusOutput = {
  readonly cases: readonly {
    readonly label: string;
    readonly cells: {
      readonly both: number;
      readonly onlyA: number;
      readonly onlyB: number;
      readonly neither: number;
    };
    readonly transactions: readonly (readonly string[])[];
    readonly metrics: PairMetrics;
    readonly mining: MiningEvidence;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    itemA: labelSchema,
    itemB: labelSchema,
    neitherItem: labelSchema,
    designs: arraySchema(
      objectSchema({
        label: labelSchema,
        transactionCount: integerSchema(2, 128),
        countA: integerSchema(1, 128),
        countB: integerSchema(1, 128),
        jointCount: integerSchema(0, 128),
      }),
      8,
      2,
    ),
    seed: generatorSeedSchema,
  },
  ["itemA", "itemB", "neitherItem", "designs"],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      label: labelSchema,
      cells: objectSchema({
        both: integerSchema(0, 128),
        onlyA: integerSchema(0, 128),
        onlyB: integerSchema(0, 128),
        neither: integerSchema(0, 128),
      }),
      transactions: arraySchema(arraySchema(labelSchema, 2, 1), 128, 2),
      metrics: pairMetricsSchema,
      mining: miningEvidenceSchema,
    }),
    8,
    2,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CooccurrenceLiftContrastCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateCooccurrenceLiftContrastCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CooccurrenceLiftContrastCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinctLabels([input.itemA, input.itemB, input.neitherItem], "itemA");
    distinctLabels(
      input.designs.map((design) => design.label),
      "designs",
    );
    for (const [i, design] of input.designs.entries())
      if (
        design.countA > design.transactionCount ||
        design.countB > design.transactionCount ||
        design.jointCount > Math.min(design.countA, design.countB) ||
        design.countA + design.countB - design.jointCount >
          design.transactionCount
      )
        simpleError(
          `designs.${i}`,
          "Marginal and joint counts must define a nonnegative contingency table.",
          "infeasible_contingency_counts",
        );
    const random = createGeneratorRandom(input.seed, context);
    const cases = input.designs.map((design) => {
      const cells = {
        both: design.jointCount,
        onlyA: design.countA - design.jointCount,
        onlyB: design.countB - design.jointCount,
        neither:
          design.transactionCount -
          design.countA -
          design.countB +
          design.jointCount,
      };
      const rows: string[][] = [];
      for (let i = 0; i < cells.both; i += 1)
        rows.push([input.itemA, input.itemB].sort());
      for (let i = 0; i < cells.onlyA; i += 1) rows.push([input.itemA]);
      for (let i = 0; i < cells.onlyB; i += 1) rows.push([input.itemB]);
      for (let i = 0; i < cells.neither; i += 1) rows.push([input.neitherItem]);
      const transactions = random.shuffle(rows);
      return {
        label: design.label,
        cells,
        transactions,
        metrics: pairMetrics(transactions, input.itemA, input.itemB),
        mining: mineEvidence(transactions, Number.MIN_VALUE, 0, 2),
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cooccurrenceLiftContrastCorpusExample = {
  input: {
    itemA: "A",
    itemB: "B",
    neitherItem: "other",
    designs: [
      {
        label: "rare-pair",
        transactionCount: 4,
        countA: 2,
        countB: 2,
        jointCount: 2,
      },
      {
        label: "common-pair",
        transactionCount: 4,
        countA: 2,
        countB: 4,
        jointCount: 2,
      },
    ],
    seed: 42,
  },
  output: {
    cases: [
      {
        label: "rare-pair",
        cells: { both: 2, onlyA: 0, onlyB: 0, neither: 2 },
        transactions: [["A", "B"], ["other"], ["A", "B"], ["other"]],
        metrics: {
          countA: 2,
          countB: 2,
          jointCount: 2,
          support: 0.5,
          confidence: 1,
          lift: 2,
        },
        mining: {
          itemsets: [
            { items: ["A"], count: 2, support: 0.5, coreSupport: 0.5 },
            { items: ["B"], count: 2, support: 0.5, coreSupport: 0.5 },
            { items: ["other"], count: 2, support: 0.5, coreSupport: 0.5 },
            { items: ["A", "B"], count: 2, support: 0.5, coreSupport: 0.5 },
          ],
          rules: [
            {
              antecedent: ["A"],
              consequent: ["B"],
              support: 0.5,
              confidence: 1,
              lift: 2,
              coreSupport: 0.5,
              coreConfidence: 1,
              coreLift: 2,
            },
            {
              antecedent: ["B"],
              consequent: ["A"],
              support: 0.5,
              confidence: 1,
              lift: 2,
              coreSupport: 0.5,
              coreConfidence: 1,
              coreLift: 2,
            },
          ],
        },
      },
      {
        label: "common-pair",
        cells: { both: 2, onlyA: 0, onlyB: 2, neither: 0 },
        transactions: [["B"], ["A", "B"], ["A", "B"], ["B"]],
        metrics: {
          countA: 2,
          countB: 4,
          jointCount: 2,
          support: 0.5,
          confidence: 1,
          lift: 1,
        },
        mining: {
          itemsets: [
            { items: ["A"], count: 2, support: 0.5, coreSupport: 0.5 },
            { items: ["B"], count: 4, support: 1, coreSupport: 1 },
            { items: ["A", "B"], count: 2, support: 0.5, coreSupport: 0.5 },
          ],
          rules: [
            {
              antecedent: ["A"],
              consequent: ["B"],
              support: 0.5,
              confidence: 1,
              lift: 1,
              coreSupport: 0.5,
              coreConfidence: 1,
              coreLift: 1,
            },
            {
              antecedent: ["B"],
              consequent: ["A"],
              support: 0.5,
              confidence: 0.5,
              lift: 1,
              coreSupport: 0.5,
              coreConfidence: 0.5,
              coreLift: 1,
            },
          ],
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CooccurrenceLiftContrastCorpusInput,
  CooccurrenceLiftContrastCorpusOutput
>;
export const cooccurrenceLiftContrastCorpusTool = createModelDefinition<
  CooccurrenceLiftContrastCorpusInput,
  CooccurrenceLiftContrastCorpusOutput
>({
  id: "random/cooccurrence-lift-contrast-corpus",
  title: "Random Cooccurrence Lift Contrast Corpus Generator",
  description:
    "Construct and shuffle synthetic baskets from feasible count-controlled pair designs, returning contingency cells and delegated rule metrics without a causal interpretation.",
  inputSchema,
  outputSchema,
  execute: calculateCooccurrenceLiftContrastCorpus,
});
export const runCooccurrenceLiftContrastCorpus =
  cooccurrenceLiftContrastCorpusTool.execute;
export default cooccurrenceLiftContrastCorpusTool;
