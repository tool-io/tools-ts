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
import type { AssociationRule } from "../../data-mining/association-rules/tool.js";
import { generateAssociationRules } from "../../data-mining/association-rules/tool.js";
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
  probabilitySchema,
  positiveSupportSchema,
  integerSchema,
  numberSchema,
  nullable,
  distinctLabels,
  pickItem,
} from "../m250-algorithms-common.js";
import {
  pairMetrics,
  pairMetricsSchema,
  type PairMetrics,
} from "../m250-algorithms-mining.js";

export type AssociationRuleThresholdExerciseInput = {
  readonly items: readonly string[];
  readonly transactionCount: number;
  readonly backgroundProbability: number;
  readonly supportChoices: readonly number[];
  readonly confidenceChoices: readonly number[];
  readonly liftChoices: readonly number[];
  readonly seed?: number;
};
export type AssociationRuleThresholdExerciseOutput = {
  readonly transactions: readonly (readonly string[])[];
  readonly rule: { readonly antecedent: string; readonly consequent: string };
  readonly thresholds: {
    readonly support: number;
    readonly confidence: number;
    readonly lift: number;
  };
  readonly answer: {
    readonly metrics: PairMetrics;
    readonly coreRule: AssociationRule | null;
    readonly meetsSupport: boolean;
    readonly meetsConfidence: boolean;
    readonly meetsLift: boolean;
    readonly accepted: boolean;
  };
  readonly randomness: GeneratorReplay;
};
const itemsSchema = arraySchema(labelSchema, 6, 1);
const coreRuleSchema = objectSchema({
  antecedent: itemsSchema,
  consequent: itemsSchema,
  support: numberSchema,
  confidence: numberSchema,
  lift: numberSchema,
});
export const inputSchema = objectSchema(
  {
    items: arraySchema(labelSchema, 6, 2),
    transactionCount: integerSchema(2, 128),
    backgroundProbability: probabilitySchema,
    supportChoices: arraySchema(positiveSupportSchema, 8, 1),
    confidenceChoices: arraySchema(probabilitySchema, 8, 1),
    liftChoices: arraySchema({ type: "number", minimum: 0 }, 8, 1),
    seed: generatorSeedSchema,
  },
  [
    "items",
    "transactionCount",
    "backgroundProbability",
    "supportChoices",
    "confidenceChoices",
    "liftChoices",
  ],
);
export const outputSchema = objectSchema({
  transactions: arraySchema(itemsSchema, 128, 2),
  rule: objectSchema({ antecedent: labelSchema, consequent: labelSchema }),
  thresholds: objectSchema({
    support: numberSchema,
    confidence: numberSchema,
    lift: numberSchema,
  }),
  answer: objectSchema({
    metrics: pairMetricsSchema,
    coreRule: nullable(coreRuleSchema),
    meetsSupport: { type: "boolean" },
    meetsConfidence: { type: "boolean" },
    meetsLift: { type: "boolean" },
    accepted: { type: "boolean" },
  }),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is AssociationRuleThresholdExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateAssociationRuleThresholdExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AssociationRuleThresholdExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinctLabels(input.items, "items");
    if (input.transactionCount < input.items.length)
      simpleError(
        "transactionCount",
        "Include at least one anchor basket per item.",
        "insufficient_anchor_baskets",
      );
    const random = createGeneratorRandom(input.seed, context);
    const baskets: string[][] = input.items.map((item) => [item]);
    while (baskets.length < input.transactionCount) {
      const row = new Set([pickItem(input.items, random)]);
      for (const item of input.items)
        if (random.unit() < input.backgroundProbability) row.add(item);
      baskets.push([...row].sort());
    }
    const transactions = random.shuffle(baskets);
    const pair = random.shuffle(input.items),
      antecedent = pair[0],
      consequent = pair[1];
    const thresholds = {
      support: pickItem(input.supportChoices, random),
      confidence: pickItem(input.confidenceChoices, random),
      lift: pickItem(input.liftChoices, random),
    };
    const metrics = pairMetrics(transactions, antecedent, consequent);
    const rules = generateAssociationRules(
      transactions,
      Number.MIN_VALUE,
      0,
      2,
    );
    if (!rules)
      throw new Error("Constructed exercise baskets failed association rules.");
    const coreRule =
      rules.find(
        (rule) =>
          rule.antecedent.length === 1 &&
          rule.consequent.length === 1 &&
          rule.antecedent[0] === antecedent &&
          rule.consequent[0] === consequent,
      ) ?? null;
    const meetsSupport =
        metrics.jointCount >=
        Math.ceil(thresholds.support * transactions.length),
      meetsConfidence = metrics.confidence >= thresholds.confidence,
      meetsLift = metrics.lift >= thresholds.lift;
    return toolSuccess({
      transactions,
      rule: { antecedent, consequent },
      thresholds,
      answer: {
        metrics,
        coreRule,
        meetsSupport,
        meetsConfidence,
        meetsLift,
        accepted: meetsSupport && meetsConfidence && meetsLift,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const associationRuleThresholdExerciseExample = {
  input: {
    items: ["bread", "milk"],
    transactionCount: 4,
    backgroundProbability: 0.5,
    supportChoices: [0.25, 0.5],
    confidenceChoices: [0.5, 0.75],
    liftChoices: [1, 1.5],
    seed: 42,
  },
  output: {
    transactions: [["bread"], ["bread", "milk"], ["bread", "milk"], ["milk"]],
    rule: { antecedent: "milk", consequent: "bread" },
    thresholds: { support: 0.25, confidence: 0.75, lift: 1.5 },
    answer: {
      metrics: {
        countA: 3,
        countB: 3,
        jointCount: 2,
        support: 0.5,
        confidence: 0.6666666666666666,
        lift: 0.8888888888888888,
      },
      coreRule: {
        antecedent: ["milk"],
        consequent: ["bread"],
        support: 0.5,
        confidence: 0.666666666667,
        lift: 0.888888888889,
      },
      meetsSupport: true,
      meetsConfidence: false,
      meetsLift: false,
      accepted: false,
    },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  AssociationRuleThresholdExerciseInput,
  AssociationRuleThresholdExerciseOutput
>;
export const associationRuleThresholdExerciseTool = createModelDefinition<
  AssociationRuleThresholdExerciseInput,
  AssociationRuleThresholdExerciseOutput
>({
  id: "random/association-rule-threshold-exercise",
  title: "Random Association Rule Threshold Exercise Generator",
  description:
    "Generate anchored synthetic baskets and a directed rule exercise with sampled thresholds, unrounded answers and explicitly rounded core evidence; association implies no causation.",
  inputSchema,
  outputSchema,
  execute: calculateAssociationRuleThresholdExercise,
});
export const runAssociationRuleThresholdExercise =
  associationRuleThresholdExerciseTool.execute;
export default associationRuleThresholdExerciseTool;
