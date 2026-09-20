import { expect, it } from "vitest";
import tool, {
  calculateBipartiteGraphConstructionPuzzle,
  bipartiteGraphConstructionPuzzleExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(
  tool,
  calculateBipartiteGraphConstructionPuzzle,
  example,
);
it("constructs two-colorable edges and exact partial completions", () => {
  const result = calculateBipartiteGraphConstructionPuzzle({
    ...example.input,
    vertexCount: 10,
    leftCount: 4,
    mode: "bipartite",
    hiddenEdgeCount: 5,
    seed: 13,
  });
  if (!result.ok) throw new Error("expected bipartite puzzle");
  const {
    partition,
    visibleEdges,
    missingEdges,
    solutionEdges,
    solutionCheck,
  } = result.output;
  const left = new Set(partition.left);
  expect(solutionCheck.bipartite).toBe(true);
  expect(missingEdges.length).toBe(5);
  const union = [...visibleEdges, ...missingEdges]
    .map((edge) => edge.join(","))
    .sort();
  expect(union).toEqual(solutionEdges.map((edge) => edge.join(",")).sort());
  for (const [a, b] of solutionEdges) {
    expect(left.has(a)).not.toBe(left.has(b));
    expect(solutionCheck.colors[a]).not.toBe(solutionCheck.colors[b]);
  }
  expect(new Set(union).size).toBe(union.length);
});
it("provides an independent odd cycle witness whose missing edge restores the control", () => {
  const result = calculateBipartiteGraphConstructionPuzzle(example.input);
  if (!result.ok) throw new Error("expected odd cycle");
  const cycle = result.output.oddCycle;
  expect((cycle.length - 1) % 2).toBe(1);
  expect(cycle[0]).toBe(cycle.at(-1));
  for (let i = 1; i < cycle.length; i += 1)
    expect(
      result.output.solutionEdges.some(
        ([a, b]) =>
          a === Math.min(cycle[i - 1], cycle[i]) &&
          b === Math.max(cycle[i - 1], cycle[i]),
      ),
    ).toBe(true);
  expect(result.output.visibleCheck.bipartite).toBe(true);
  expect(result.output.solutionCheck.bipartite).toBe(false);
});
it("rejects infeasible partitions, hidden counts and resource requests", () => {
  expect(tool.execute({ ...example.input, leftCount: 4 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_partition", field: "leftCount" }] },
  });
  expect(tool.execute({ ...example.input, leftCount: 1 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_partition" }] },
  });
  expect(tool.execute({ ...example.input, hiddenEdgeCount: 66 })).toMatchObject(
    {
      ok: false,
      error: {
        issues: [{ code: "infeasible_hidden_count", field: "hiddenEdgeCount" }],
      },
    },
  );
  expect(tool.execute({ ...example.input, vertexCount: 13 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "vertexCount" }] },
  });
});
