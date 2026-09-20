import { expect, it } from "vitest";
import tool, {
  calculateBeamSearchPruningChallenge,
  beamSearchPruningChallengeExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateBeamSearchPruningChallenge, example);
it("shows a concrete pruned optimum with independently known path scores", () => {
  const result = calculateBeamSearchPruningChallenge(example.input);
  if (!result.ok) throw new Error("expected pruning challenge");
  expect(result.output.beam.bestScore).toBe(2);
  // First branch leaves score 1-1=0 and 1+4=5; second scores 2-4=-2 and 2+0=2.
  expect(result.output.comparison.exhaustiveBestScore).toBe(5);
  expect(result.output.comparison.gap).toBe(3);
  expect(result.output.comparison.beamIsOptimal).toBe(false);
});
it("computes exhaustive winners from the flat parent representation independently", () => {
  const result = calculateBeamSearchPruningChallenge({
    ...example.input,
    branchingFactor: 3,
    treeDepth: 4,
    searchDepth: 3,
    width: 4,
    seed: 6,
  });
  if (!result.ok) throw new Error("expected generated scored tree");
  const { nodes, comparison, beam } = result.output,
    byLabel = new Map(nodes.map((node) => [node.label, node]));
  const candidates = nodes
    .filter((node) => node.depth === 3)
    .map((node) => {
      const path: string[] = [];
      let score = 0;
      let label: string | null = node.label;
      while (label !== null) {
        const current = byLabel.get(label);
        if (!current) throw new Error("unknown parent");
        path.unshift(label);
        score += current.score;
        label = current.parent;
      }
      return { path, score };
    });
  const bestScore = Math.max(...candidates.map((candidate) => candidate.score));
  expect(comparison.exhaustiveBestScore).toBe(bestScore);
  expect(comparison.exhaustivePathCount).toBe(27);
  expect(
    candidates.some(
      (candidate) =>
        candidate.score === bestScore &&
        candidate.path.join(",") === comparison.exhaustiveBestPath.join(","),
    ),
  ).toBe(true);
  const beamPath = candidates.find(
    (candidate) => candidate.path.join(",") === beam.bestPath.join(","),
  );
  expect(beamPath?.score).toBe(beam.bestScore);
  expect(comparison.gap).toBeGreaterThanOrEqual(0);
  expect(beam.levels.every((level) => level.kept.length <= 4)).toBe(true);
});
it("retains an optimum when the width covers every path and respects the node cap", () => {
  const wide = calculateBeamSearchPruningChallenge({
    ...example.input,
    treeDepth: 4,
    searchDepth: 4,
    width: 16,
  });
  if (!wide.ok) throw new Error("expected unpruned search");
  expect(wide.output.comparison.beamIsOptimal).toBe(true);
  expect(wide.output.comparison.gap).toBe(0);
  expect(
    tool.execute({ ...example.input, branchingFactor: 4, treeDepth: 5 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit", field: "treeDepth" }] },
  });
  expect(tool.execute({ ...example.input, searchDepth: 3 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "search_depth_exceeds_tree", field: "searchDepth" }],
    },
  });
  expect(tool.execute({ ...example.input, maximumScore: -6 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "invalid_integer_range", field: "maximumScore" }],
    },
  });
  expect(
    tool.execute({
      ...example.input,
      minimumScore: Number.MAX_SAFE_INTEGER,
      maximumScore: Number.MAX_SAFE_INTEGER,
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "score_precision_loss", field: "maximumScore" }],
    },
  });
});
