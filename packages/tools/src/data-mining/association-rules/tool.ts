import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { mineFrequentItemsets } from "../apriori/tool.js";

export type AssociationRule = {
  readonly antecedent: readonly string[];
  readonly confidence: number;
  readonly consequent: readonly string[];
  readonly lift: number;
  readonly support: number;
};
const subsets = (items: readonly string[]): string[][] => {
  const values: string[][] = [];
  for (let mask = 1; mask < 2 ** items.length - 1; mask += 1)
    values.push(items.filter((_, index) => mask & (1 << index)));
  return values;
};
export const generateAssociationRules = (
  transactions: readonly (readonly string[])[],
  minimumSupport: number,
  minimumConfidence: number,
  maximumSize: number,
): AssociationRule[] | null => {
  const mined = mineFrequentItemsets(transactions, minimumSupport, maximumSize);
  if (!mined) return null;
  const support = new Map(
    mined.frequentItemsets.map((set) => [
      set.items.join("\u0000"),
      set.support,
    ]),
  );
  const rules: AssociationRule[] = [];
  for (const set of mined.frequentItemsets.filter(
    ({ items }) => items.length > 1,
  ))
    for (const antecedent of subsets(set.items)) {
      const consequent = set.items.filter((item) => !antecedent.includes(item));
      const antecedentSupport = support.get(antecedent.join("\u0000"));
      const consequentSupport = support.get(consequent.join("\u0000"));
      if (!antecedentSupport || !consequentSupport) continue;
      const confidence = set.support / antecedentSupport;
      if (confidence >= minimumConfidence)
        rules.push({
          antecedent,
          confidence: Number(confidence.toPrecision(12)),
          consequent,
          lift: Number((confidence / consequentSupport).toPrecision(12)),
          support: set.support,
        });
    }
  return rules;
};
export const associationRulesExample = {
  input: {
    maximumSize: 3,
    minimumConfidence: 0.6,
    minimumSupport: 0.5,
    transactions: {
      values: [["bread", "milk"], ["bread", "milk"], ["bread"], ["milk"]],
    },
  },
  output: {
    rules: {
      values: [
        {
          antecedent: ["bread"],
          confidence: 0.666666666667,
          consequent: ["milk"],
          lift: 0.888888888889,
          support: 0.5,
        },
        {
          antecedent: ["milk"],
          confidence: 0.666666666667,
          consequent: ["bread"],
          lift: 0.888888888889,
          support: 0.5,
        },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly maximumSize: number;
    readonly minimumConfidence: number;
    readonly minimumSupport: number;
    readonly transactions: {
      readonly values: readonly (readonly string[])[];
    };
  },
  { readonly rules: { readonly values: readonly AssociationRule[] } }
>;
export const associationRulesTool = createSimpleTool({
  id: "data-mining/association-rules",
  title: "Association Rule Generator",
  description:
    "Derive association rules and calculate support, confidence, and lift.",
  inputs: [
    {
      format: "transactions",
      id: "transactions",
      kind: "object",
      label: "Transactions",
    },
    {
      id: "minimumSupport",
      kind: "number",
      label: "Minimum support",
      maximum: 1,
      minimum: Number.MIN_VALUE,
    },
    {
      id: "minimumConfidence",
      kind: "number",
      label: "Minimum confidence",
      maximum: 1,
      minimum: Number.MIN_VALUE,
    },
    {
      id: "maximumSize",
      kind: "integer",
      label: "Maximum itemset size",
      maximum: 10,
      minimum: 2,
    },
  ],
  outputs: [
    {
      format: "data-mining/association-rules",
      id: "rules",
      kind: "object",
      label: "Rules",
    },
  ],
  calculate: (input) => {
    const transactions =
      (input.transactions as { values?: unknown }).values ?? input.transactions;
    if (!Array.isArray(transactions))
      return simpleError(
        "transactions",
        "Enter transactions as a values array.",
      );
    const rules = generateAssociationRules(
      transactions as string[][],
      input.minimumSupport as number,
      input.minimumConfidence as number,
      input.maximumSize as number,
    );
    if (!rules) return simpleError("transactions", "Enter valid transactions.");
    return { rules: { values: rules } };
  },
});
export const runAssociationRules = associationRulesTool.execute;
export default associationRulesTool;
