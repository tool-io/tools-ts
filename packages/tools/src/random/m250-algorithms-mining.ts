import { mineFrequentItemsets } from "../data-mining/apriori/tool.js";
import { generateAssociationRules } from "../data-mining/association-rules/tool.js";
import {
  arraySchema,
  objectSchema,
  numberSchema,
  labelSchema,
  integerSchema,
} from "./m250-algorithms-common.js";

export type MiningEvidence = {
  readonly itemsets: readonly {
    readonly items: readonly string[];
    readonly count: number;
    readonly support: number;
    readonly coreSupport: number;
  }[];
  readonly rules: readonly {
    readonly antecedent: readonly string[];
    readonly consequent: readonly string[];
    readonly support: number;
    readonly confidence: number;
    readonly lift: number;
    readonly coreSupport: number;
    readonly coreConfidence: number;
    readonly coreLift: number;
  }[];
};
const itemset = arraySchema(labelSchema, 3, 1);
export const miningEvidenceSchema = objectSchema({
  itemsets: arraySchema(
    objectSchema({
      items: itemset,
      count: integerSchema(0, 128),
      support: numberSchema,
      coreSupport: numberSchema,
    }),
    41,
  ),
  rules: arraySchema(
    objectSchema({
      antecedent: itemset,
      consequent: itemset,
      support: numberSchema,
      confidence: numberSchema,
      lift: numberSchema,
      coreSupport: numberSchema,
      coreConfidence: numberSchema,
      coreLift: numberSchema,
    }),
    150,
  ),
});
export const mineEvidence = (
  transactions: readonly (readonly string[])[],
  minimumSupport: number,
  minimumConfidence: number,
  maximumSize: number,
): MiningEvidence => {
  const mined = mineFrequentItemsets(transactions, minimumSupport, maximumSize);
  // Request every supported rule before applying confidence to full-precision counts.
  const delegated = generateAssociationRules(
    transactions,
    minimumSupport,
    0,
    maximumSize,
  );
  if (!mined || !delegated)
    throw new Error("Constructed nonempty transactions failed mining cores.");
  const count = (items: readonly string[]): number =>
    transactions.filter((row) => items.every((item) => row.includes(item)))
      .length;
  return {
    itemsets: mined.frequentItemsets.map((set) => ({
      items: [...set.items],
      count: set.count,
      support: set.count / transactions.length,
      coreSupport: set.support,
    })),
    rules: delegated
      .map((rule) => {
        const joint = count([...rule.antecedent, ...rule.consequent]);
        const confidence = joint / count(rule.antecedent);
        return {
          antecedent: [...rule.antecedent],
          consequent: [...rule.consequent],
          support: joint / transactions.length,
          confidence,
          lift: confidence / (count(rule.consequent) / transactions.length),
          coreSupport: rule.support,
          coreConfidence: rule.confidence,
          coreLift: rule.lift,
        };
      })
      .filter((rule) => rule.confidence >= minimumConfidence),
  };
};
export type PairMetrics = {
  readonly countA: number;
  readonly countB: number;
  readonly jointCount: number;
  readonly support: number;
  readonly confidence: number;
  readonly lift: number;
};
export const pairMetricsSchema = objectSchema({
  countA: integerSchema(1, 128),
  countB: integerSchema(1, 128),
  jointCount: integerSchema(0, 128),
  support: numberSchema,
  confidence: numberSchema,
  lift: numberSchema,
});
export const pairMetrics = (
  transactions: readonly (readonly string[])[],
  a: string,
  b: string,
): PairMetrics => {
  const countA = transactions.filter((row) => row.includes(a)).length;
  const countB = transactions.filter((row) => row.includes(b)).length;
  const jointCount = transactions.filter(
    (row) => row.includes(a) && row.includes(b),
  ).length;
  if (!countA || !countB)
    throw new Error("Pair construction must include both marginals.");
  return {
    countA,
    countB,
    jointCount,
    support: jointCount / transactions.length,
    confidence: jointCount / countA,
    lift: jointCount / countA / (countB / transactions.length),
  };
};
