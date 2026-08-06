import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GameTree = {
  readonly children?: readonly GameTree[];
  readonly value?: number;
};
export type AlphaBetaResult = {
  readonly bestValue: number;
  readonly evaluatedLeaves: number;
  readonly prunedBranches: number;
};

const validTree = (node: unknown, depth = 0): node is GameTree => {
  if (typeof node !== "object" || node === null || depth > 30) return false;
  const candidate = node as Record<string, unknown>;
  if (candidate.children === undefined)
    return (
      typeof candidate.value === "number" && Number.isFinite(candidate.value)
    );
  return (
    Array.isArray(candidate.children) &&
    candidate.children.length > 0 &&
    candidate.children.every((child) => validTree(child, depth + 1))
  );
};

export const alphaBetaSearch = (
  tree: GameTree,
  maximizing = true,
): AlphaBetaResult | null => {
  if (!validTree(tree)) return null;
  let evaluatedLeaves = 0;
  let prunedBranches = 0;
  const visit = (
    node: GameTree,
    maximize: boolean,
    alpha: number,
    beta: number,
  ): number => {
    if (!node.children) {
      evaluatedLeaves += 1;
      return node.value!;
    }
    let best = maximize ? -Infinity : Infinity;
    for (let index = 0; index < node.children.length; index += 1) {
      const value = visit(node.children[index]!, !maximize, alpha, beta);
      best = maximize ? Math.max(best, value) : Math.min(best, value);
      if (maximize) alpha = Math.max(alpha, best);
      else beta = Math.min(beta, best);
      if (beta <= alpha) {
        prunedBranches += node.children.length - index - 1;
        break;
      }
    }
    return best;
  };
  return {
    bestValue: visit(tree, maximizing, -Infinity, Infinity),
    evaluatedLeaves,
    prunedBranches,
  };
};

export const alphaBetaExample = {
  input: {
    maximizing: true,
    tree: {
      children: [
        { children: [{ value: 3 }, { value: 5 }] },
        { children: [{ value: 2 }, { value: 9 }] },
      ],
    },
  },
  output: { result: { bestValue: 3, evaluatedLeaves: 3, prunedBranches: 1 } },
} satisfies ToolExample<
  { readonly maximizing: boolean; readonly tree: GameTree },
  { readonly result: AlphaBetaResult }
>;

export const alphaBetaTool = createSimpleTool({
  id: "game-search/alpha-beta",
  title: "Alpha-Beta Pruning Calculator",
  description:
    "Evaluate a finite minimax tree while pruning branches that cannot affect the result.",
  inputs: [
    { format: "tree/game", id: "tree", kind: "object", label: "Game tree" },
    {
      default: true,
      id: "maximizing",
      kind: "boolean",
      label: "Maximizing root",
    },
  ],
  outputs: [
    {
      format: "search/alpha-beta",
      id: "result",
      kind: "object",
      label: "Search result",
    },
  ],
  calculate: (input) => {
    const result = alphaBetaSearch(
      input.tree as GameTree,
      input.maximizing as boolean,
    );
    if (!result)
      return simpleError(
        "tree",
        "Enter a finite game tree with values at every leaf.",
      );
    return { result };
  },
});
export const runAlphaBeta = alphaBetaTool.execute;
export default alphaBetaTool;
