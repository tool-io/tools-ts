import { expect, it } from "vitest";
import tool, {
  calculateGraphTraversalQuiz,
  graphTraversalQuizExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateGraphTraversalQuiz, example);
it("agrees with independent queue distances and recursive DFS on generated directed graphs", () => {
  for (const seed of [1, 8, 31]) {
    const result = calculateGraphTraversalQuiz({
      nodeCount: 9,
      directed: true,
      edgeProbability: 0.3,
      seed,
    });
    if (!result.ok) throw new Error("expected directed graph");
    const { graph, start, breadthFirst, depthFirst, nodes, unreachable } =
      result.output;
    const distances = new Map<string, number>([[start, 0]]),
      queue = [start];
    for (let head = 0; head < queue.length; head += 1) {
      const node = queue[head],
        depth = distances.get(node);
      if (depth === undefined) throw new Error("missing queue distance");
      for (const next of [...graph[node]].sort())
        if (!distances.has(next)) {
          distances.set(next, depth + 1);
          queue.push(next);
        }
    }
    const seen = new Set<string>(),
      order: string[] = [],
      depths: Record<string, number> = {};
    const visit = (node: string, depth: number): void => {
      if (seen.has(node)) return;
      seen.add(node);
      order.push(node);
      depths[node] = depth;
      for (const neighbor of [...graph[node]].sort())
        visit(neighbor, depth + 1);
    };
    visit(start, 0);
    expect(breadthFirst).toEqual({
      visitOrder: queue,
      depths: Object.fromEntries(distances),
    });
    expect(depthFirst).toEqual({ visitOrder: order, depths });
    expect(unreachable).toEqual(nodes.filter((node) => !distances.has(node)));
  }
});
it("retains isolates and bounds the graph", () => {
  const result = calculateGraphTraversalQuiz({
    ...example.input,
    edgeProbability: 0,
  });
  if (!result.ok) throw new Error("expected edgeless graph");
  expect(result.output.edges).toEqual([]);
  expect(result.output.breadthFirst.visitOrder).toEqual([result.output.start]);
  expect(result.output.unreachable.length).toBe(3);
  expect(tool.execute({ ...example.input, nodeCount: 13 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "nodeCount", code: "invalid_field" }] },
  });
  expect(
    tool.execute({ ...example.input, edgeProbability: NaN }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "edgeProbability", code: "invalid_field" }] },
  });
});
