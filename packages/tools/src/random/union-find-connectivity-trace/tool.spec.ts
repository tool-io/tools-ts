import { describe, expect, it } from "vitest";
import tool, { example, calculateUnionFindConnectivityTrace } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Union find trace", () => {
  lightweightModelTests(tool, calculateUnionFindConnectivityTrace, example);
  it("lightweight independently joins a transitive chain and answers connectivity", () => {
    const draws = [0, 0, 0.4, 0, 0.4, 0.9, 0.9, 0.9, 0];
    const result = tool.execute(
      { nodeCount: 3, operations: ["union", "query"], eventCount: 3 },
      { random: () => draws.shift() ?? 0 },
    );
    if (!result.ok) throw new Error("Expected disjoint sets");
    expect(result.output.events.map((event) => event.components)).toEqual([
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    expect(result.output.events[2]).toMatchObject({
      kind: "query",
      a: 2,
      b: 0,
      connected: true,
    });
  });
  it("lightweight labels redundant self unions and rejects invalid node counts", () => {
    expect(
      tool.execute({
        nodeCount: 1,
        operations: ["union"],
        eventCount: 1,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        events: [{ connected: true, redundantUnion: true, components: [0] }],
      },
    });
    expect(tool.execute({ ...example.input, nodeCount: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "nodeCount", code: "invalid_field" }] },
    });
  });
});
