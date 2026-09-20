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
import { generatorFailure } from "../../random/generator-random.js";

export type FpGrowthInput = {
  readonly transactions: readonly (readonly string[])[];
  readonly minimumCount: number;
  readonly maximumSize: number;
};
export type FpGrowthOutput = {
  readonly transactionCount: number;
  readonly initialTreeNodeCount: number;
  readonly frequentItemsets: readonly {
    readonly items: readonly string[];
    readonly count: number;
    readonly support: number;
  }[];
};
const item = { type: "string", minLength: 1, maxLength: 64 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transactions: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: { type: "array", maxItems: 16, items: item },
    },
    minimumCount: { type: "integer", minimum: 1, maximum: 512 },
    maximumSize: { type: "integer", minimum: 1, maximum: 16 },
  },
  required: ["transactions", "minimumCount", "maximumSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transactionCount: { type: "integer", minimum: 1, maximum: 512 },
    initialTreeNodeCount: { type: "integer", minimum: 0, maximum: 8192 },
    frequentItemsets: {
      type: "array",
      maxItems: 4096,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          items: { type: "array", minItems: 1, maxItems: 16, items: item },
          count: { type: "integer", minimum: 1, maximum: 512 },
          support: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: ["items", "count", "support"],
      },
    },
  },
  required: ["transactionCount", "initialTreeNodeCount", "frequentItemsets"],
} as const;
type TreeNode = {
  item: string | null;
  count: number;
  parent: TreeNode | null;
  children: Map<string, TreeNode>;
};
type WeightedPath = { items: readonly string[]; weight: number };
type FpTree = { headers: Map<string, TreeNode[]>; nodeCount: number };
const compareLabels = (a: string, b: string): number =>
  a < b ? -1 : a > b ? 1 : 0;
const isInput = (input: unknown): input is FpGrowthInput =>
  matchesModelInput(input, inputSchema);
export const calculateFpGrowth = (
  input: unknown,
): ToolResult<FpGrowthOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const transactions = input.transactions.map((row) => [...new Set(row)]);
    if (new Set(transactions.flat()).size > 16)
      simpleError(
        "transactions",
        "At most 16 distinct item labels are supported.",
        "resource_limit",
      );
    let work = 0;
    const checkpoint = (): void => {
      if (++work > 200_000)
        simpleError(
          "transactions",
          "Conditional tree construction exceeds 200,000 bounded steps.",
          "resource_limit",
        );
    };
    const buildTree = (paths: readonly WeightedPath[]): FpTree => {
      const frequencies = new Map<string, number>();
      for (const path of paths)
        for (const item of path.items) {
          checkpoint();
          frequencies.set(item, (frequencies.get(item) ?? 0) + path.weight);
        }
      const labels = [...frequencies]
        .filter(([, count]) => count >= input.minimumCount)
        .sort((a, b) => b[1] - a[1] || compareLabels(a[0], b[0]))
        .map(([item]) => item);
      const rank = new Map(labels.map((item, i) => [item, i])),
        headers = new Map<string, TreeNode[]>(labels.map((item) => [item, []]));
      const root: TreeNode = {
        item: null,
        count: 0,
        parent: null,
        children: new Map(),
      };
      let nodeCount = 0;
      for (const path of paths) {
        const ordered = path.items
          .filter((item) => rank.has(item))
          .sort((a, b) => (rank.get(a) ?? 0) - (rank.get(b) ?? 0));
        let parent = root;
        for (const item of ordered) {
          checkpoint();
          let node = parent.children.get(item);
          if (!node) {
            node = { item, count: 0, parent, children: new Map() };
            parent.children.set(item, node);
            headers.get(item)?.push(node);
            nodeCount += 1;
          }
          node.count += path.weight;
          parent = node;
        }
      }
      return { headers, nodeCount };
    };
    const tree = buildTree(transactions.map((items) => ({ items, weight: 1 })));
    const frequentItemsets: {
      items: string[];
      count: number;
      support: number;
    }[] = [];
    const mine = (current: FpTree, suffix: readonly string[]): void => {
      const entries = [...current.headers].map(([item, nodes]) => ({
        item,
        nodes,
        count: nodes.reduce((s, node) => s + node.count, 0),
      }));
      entries.sort(
        (a, b) => a.count - b.count || compareLabels(a.item, b.item),
      );
      for (const entry of entries) {
        const pattern = [entry.item, ...suffix];
        if (frequentItemsets.length >= 4096)
          simpleError(
            "maximumSize",
            "At most 4,096 frequent itemsets may be retained.",
            "resource_limit",
          );
        frequentItemsets.push({
          items: [...pattern].sort(compareLabels),
          count: entry.count,
          support: entry.count / transactions.length,
        });
        if (pattern.length >= input.maximumSize) continue;
        const conditional: WeightedPath[] = [];
        for (const node of entry.nodes) {
          const items: string[] = [];
          let parent = node.parent;
          while (parent && parent.item !== null) {
            checkpoint();
            items.push(parent.item);
            parent = parent.parent;
          }
          if (items.length) conditional.push({ items, weight: node.count });
        }
        const subtree = buildTree(conditional);
        if (subtree.headers.size) mine(subtree, pattern);
      }
    };
    mine(tree, []);
    frequentItemsets.sort(
      (a, b) =>
        a.items.length - b.items.length ||
        compareLabels(JSON.stringify(a.items), JSON.stringify(b.items)),
    );
    return toolSuccess({
      transactionCount: transactions.length,
      initialTreeNodeCount: tree.nodeCount,
      frequentItemsets,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fpGrowthExample = {
  input: {
    transactions: [
      ["bread", "milk"],
      ["bread", "milk", "eggs"],
      ["bread"],
      ["eggs", "milk"],
    ],
    minimumCount: 2,
    maximumSize: 2,
  },
  output: {
    transactionCount: 4,
    initialTreeNodeCount: 5,
    frequentItemsets: [
      {
        items: ["bread"],
        count: 3,
        support: 0.75,
      },
      {
        items: ["eggs"],
        count: 2,
        support: 0.5,
      },
      {
        items: ["milk"],
        count: 3,
        support: 0.75,
      },
      {
        items: ["bread", "milk"],
        count: 2,
        support: 0.5,
      },
      {
        items: ["eggs", "milk"],
        count: 2,
        support: 0.5,
      },
    ],
  },
} satisfies ToolExample<FpGrowthInput, FpGrowthOutput>;
export const fpGrowthTool = createModelDefinition<
  FpGrowthInput,
  FpGrowthOutput
>({
  id: "data-mining/fp-growth",
  title: "FP-Growth Frequent Itemset Mining Tool",
  description:
    "Mine bounded transaction itemsets with actual FP-trees and weighted conditional pattern bases, counting each item once per transaction and retaining empty transactions in support denominators.",
  inputSchema,
  outputSchema,
  execute: calculateFpGrowth,
});
export const runFpGrowth = fpGrowthTool.execute;
export default fpGrowthTool;
