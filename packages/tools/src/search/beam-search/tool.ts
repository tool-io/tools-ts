import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamNode = {
  readonly children?: readonly BeamNode[];
  readonly label: string;
  readonly score: number;
};
export type BeamSearchResult = {
  readonly bestPath: readonly string[];
  readonly bestScore: number;
  readonly levels: readonly {
    readonly kept: readonly string[];
    readonly pruned: readonly string[];
  }[];
};
const validNode = (node: unknown, depth = 0): node is BeamNode => {
  if (typeof node !== "object" || node === null || depth > 30) return false;
  const value = node as Record<string, unknown>;
  return (
    typeof value.label === "string" &&
    value.label.length > 0 &&
    typeof value.score === "number" &&
    Number.isFinite(value.score) &&
    (value.children === undefined ||
      (Array.isArray(value.children) &&
        value.children.every((child) => validNode(child, depth + 1))))
  );
};
export const beamSearch = (
  tree: BeamNode,
  width: number,
  maximumDepth: number,
): BeamSearchResult | null => {
  if (!validNode(tree)) return null;
  type Candidate = { node: BeamNode; path: string[]; score: number };
  let beam: Candidate[] = [
    { node: tree, path: [tree.label], score: tree.score },
  ];
  const levels: { kept: string[]; pruned: string[] }[] = [];
  for (let depth = 0; depth < maximumDepth; depth += 1) {
    const expanded = beam
      .flatMap(({ node, path, score }) =>
        (node.children ?? []).map((child) => ({
          node: child,
          path: [...path, child.label],
          score: score + child.score,
        })),
      )
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.path.join("> ").localeCompare(b.path.join("> ")),
      );
    if (!expanded.length) break;
    beam = expanded.slice(0, width);
    levels.push({
      kept: beam.map(({ path }) => path.join(" > ")),
      pruned: expanded.slice(width).map(({ path }) => path.join(" > ")),
    });
  }
  return { bestPath: beam[0]!.path, bestScore: beam[0]!.score, levels };
};
export const beamSearchExample = {
  input: {
    maximumDepth: 3,
    tree: {
      label: "root",
      score: 0,
      children: [
        {
          label: "A",
          score: 3,
          children: [
            { label: "A1", score: 2 },
            { label: "A2", score: 5 },
          ],
        },
        {
          label: "B",
          score: 2,
          children: [
            { label: "B1", score: 8 },
            { label: "B2", score: 1 },
          ],
        },
      ],
    },
    width: 2,
  },
  output: {
    result: {
      bestPath: ["root", "B", "B1"],
      bestScore: 10,
      levels: [
        { kept: ["root > A", "root > B"], pruned: [] },
        {
          kept: ["root > B > B1", "root > A > A2"],
          pruned: ["root > A > A1", "root > B > B2"],
        },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly maximumDepth: number;
    readonly tree: BeamNode;
    readonly width: number;
  },
  { readonly result: BeamSearchResult }
>;
export const beamSearchTool = createSimpleTool({
  id: "search/beam-search",
  title: "Beam Search Visualizer",
  description:
    "Expand a scored tree while retaining only the best paths at each level.",
  inputs: [
    { format: "tree/scored", id: "tree", kind: "object", label: "Search tree" },
    {
      id: "width",
      kind: "integer",
      label: "Beam width",
      maximum: 1_000,
      minimum: 1,
    },
    {
      id: "maximumDepth",
      kind: "integer",
      label: "Maximum depth",
      maximum: 30,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "search/beam",
      id: "result",
      kind: "object",
      label: "Beam trace",
    },
  ],
  calculate: (input) => {
    const result = beamSearch(
      input.tree as BeamNode,
      input.width as number,
      input.maximumDepth as number,
    );
    if (!result) return simpleError("tree", "Enter a valid scored tree.");
    return { result };
  },
});
export const runBeamSearch = beamSearchTool.execute;
export default beamSearchTool;
