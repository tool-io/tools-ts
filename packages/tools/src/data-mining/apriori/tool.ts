import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrequentItemset = {
  readonly count: number;
  readonly items: readonly string[];
  readonly support: number;
};
export type AprioriResult = {
  readonly frequentItemsets: readonly FrequentItemset[];
  readonly transactionCount: number;
};
const signature = (items: readonly string[]) =>
  [...items].sort().join("\u0000");
export const mineFrequentItemsets = (
  transactions: readonly (readonly string[])[],
  minimumSupport: number,
  maximumSize: number,
): AprioriResult | null => {
  if (
    !transactions.length ||
    transactions.some((row) => !row.length || row.some((item) => !item.trim()))
  )
    return null;
  const normalized = transactions.map((row) => new Set(row));
  const minimumCount = Math.ceil(minimumSupport * transactions.length);
  let level = [...new Set(transactions.flat())].sort().map((item) => [item]);
  const frequent: FrequentItemset[] = [];
  for (let size = 1; size <= maximumSize && level.length; size += 1) {
    const accepted: string[][] = [];
    for (const items of level) {
      const count = normalized.filter((transaction) =>
        items.every((item) => transaction.has(item)),
      ).length;
      if (count >= minimumCount) {
        accepted.push(items);
        frequent.push({
          count,
          items,
          support: Number((count / transactions.length).toPrecision(12)),
        });
      }
    }
    if (size === maximumSize) break;
    const candidates = new Map<string, string[]>();
    for (let first = 0; first < accepted.length; first += 1)
      for (let second = first + 1; second < accepted.length; second += 1) {
        const union = [
          ...new Set([...accepted[first]!, ...accepted[second]!]),
        ].sort();
        if (union.length === size + 1) candidates.set(signature(union), union);
      }
    level = [...candidates.values()];
  }
  return { frequentItemsets: frequent, transactionCount: transactions.length };
};
export const aprioriExample = {
  input: {
    maximumSize: 3,
    minimumSupport: 0.6,
    transactions: [
      ["bread", "milk"],
      ["bread", "diapers", "beer"],
      ["milk", "diapers", "beer"],
      ["bread", "milk", "diapers", "beer"],
      ["bread", "milk", "diapers"],
    ],
  },
  output: {
    result: {
      frequentItemsets: [
        { count: 3, items: ["beer"], support: 0.6 },
        { count: 4, items: ["bread"], support: 0.8 },
        { count: 4, items: ["diapers"], support: 0.8 },
        { count: 4, items: ["milk"], support: 0.8 },
        { count: 3, items: ["beer", "diapers"], support: 0.6 },
        { count: 3, items: ["bread", "diapers"], support: 0.6 },
        { count: 3, items: ["bread", "milk"], support: 0.6 },
        { count: 3, items: ["diapers", "milk"], support: 0.6 },
      ],
      transactionCount: 5,
    },
  },
} satisfies ToolExample<
  {
    readonly maximumSize: number;
    readonly minimumSupport: number;
    readonly transactions: readonly (readonly string[])[];
  },
  { readonly result: AprioriResult }
>;
export const aprioriTool = createSimpleTool({
  id: "data-mining/apriori",
  title: "Apriori Frequent Itemset Miner",
  description:
    "Find item combinations whose support meets a selected threshold.",
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
      id: "maximumSize",
      kind: "integer",
      label: "Maximum itemset size",
      maximum: 10,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "data-mining/frequent-itemsets",
      id: "result",
      kind: "object",
      label: "Frequent itemsets",
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
    const result = mineFrequentItemsets(
      transactions as string[][],
      input.minimumSupport as number,
      input.maximumSize as number,
    );
    if (!result)
      return simpleError(
        "transactions",
        "Enter nonempty transactions containing nonempty item names.",
      );
    return { result };
  },
});
export const runApriori = aprioriTool.execute;
export default aprioriTool;
