import { expect, it } from "vitest";
import tool, {
  calculateGraphRepresentationRoundTripCorpus,
  graphRepresentationRoundTripCorpusExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(
  tool,
  calculateGraphRepresentationRoundTripCorpus,
  example,
);
it("preserves directions, loops and semantic edge presence independently of duplicate order", () => {
  const result = calculateGraphRepresentationRoundTripCorpus({
    ...example.input,
    count: 6,
    nodeCount: 8,
    directed: true,
    allowSelfLoops: true,
    duplicateProbability: 1,
    seed: 29,
  });
  if (!result.ok) throw new Error("expected graph corpus");
  for (const row of result.output.cases) {
    let ones = 0;
    row.nodes.forEach((a, i) =>
      row.nodes.forEach((b, j) => {
        const expected = row.rawAdjacency[a].includes(b) ? 1 : 0;
        expect(row.matrix[i][j]).toBe(expected);
        ones += expected;
        expect(row.reconstructedAdjacency[a].includes(b)).toBe(expected === 1);
      }),
    );
    expect(row.normalizedEdges.length).toBe(ones);
    expect(row.semanticallyEquivalent).toBe(true);
    expect(
      Object.values(row.rawAdjacency).some(
        (neighbors) => new Set(neighbors).size < neighbors.length,
      ),
    ).toBe(true);
  }
});
it("round trips isolated singleton graphs and a self-loop", () => {
  const isolate = calculateGraphRepresentationRoundTripCorpus({
    ...example.input,
    nodeCount: 1,
    edgeProbability: 0,
  });
  const loop = calculateGraphRepresentationRoundTripCorpus({
    ...example.input,
    nodeCount: 1,
    allowSelfLoops: true,
    edgeProbability: 1,
  });
  if (!isolate.ok || !loop.ok) throw new Error("expected singleton cases");
  expect(isolate.output.cases[0].matrix).toEqual([[0]]);
  expect(loop.output.cases[0].matrix).toEqual([[1]]);
  expect(tool.execute({ ...example.input, count: 17 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
