import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
import { distinct, safe, sum } from "./m500b-charts-math-graphs-support.js";

export type HierarchyNode = {
  readonly id: string;
  readonly parent: number;
  readonly leaf: boolean;
};
/** Parent indices precede children, so ancestor aggregation is iterative. */
export const hierarchyValues = (
  nodes: readonly HierarchyNode[],
  minimum: number,
  maximum: number,
  empty: readonly number[],
  random: GeneratorRandom,
): { values: number[]; depths: number[] } => {
  distinct(
    nodes.map((n) => n.id),
    "nodes",
  );
  if (minimum > maximum)
    return simpleError(
      "maximum",
      "Leaf value range must be ordered.",
      "invalid_range",
    );
  if (nodes[0]?.parent !== -1)
    return simpleError(
      "nodes",
      "The first node must be the root.",
      "invalid_hierarchy",
    );
  const children = nodes.map(() => [] as number[]),
    depths = [0];
  for (let i = 1; i < nodes.length; i++) {
    const p = nodes[i].parent;
    if (p < 0 || p >= i)
      return simpleError(
        "nodes",
        "Every nonroot parent must precede its child.",
        "invalid_hierarchy",
      );
    children[p].push(i);
    depths.push(depths[p] + 1);
  }
  distinct(empty, "emptyBranches");
  for (const i of empty)
    if (i >= nodes.length || nodes[i].leaf || children[i].length)
      return simpleError(
        "emptyBranches",
        "Only nonleaf terminal nodes may be declared empty.",
        "invalid_empty_branch",
      );
  for (let i = 0; i < nodes.length; i++)
    if (
      nodes[i].leaf
        ? children[i].length > 0
        : children[i].length === 0 && !empty.includes(i)
    )
      return simpleError(
        "nodes",
        "Leaf declarations and children disagree.",
        "invalid_hierarchy",
      );
  const values = nodes.map((n, i) =>
    n.leaf ? random.integer(minimum, maximum) : 0,
  );
  if (!nodes.some((n) => n.leaf)) random.unit();
  for (let i = nodes.length - 1; i >= 0; i--)
    if (children[i].length)
      values[i] = safe(sum(children[i].map((c) => values[c])), "maximum");
  return { values, depths };
};
