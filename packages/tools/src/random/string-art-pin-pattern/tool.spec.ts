import { expect, it } from "vitest";
import tool, {
  calculateStringArtPinPattern,
  stringArtPinPatternExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateStringArtPinPattern, example);
it("honors repeated pairs and independently counts every endpoint", () => {
  const r = tool.execute({
    pins: [
      { id: "p", x: 0, y: 0 },
      { id: "q", x: 3, y: 4 },
    ],
    connectionCount: 3,
    minimumDegree: 3,
    maximumDegree: 3,
    maximumPairRepetition: 3,
    seed: 17,
  });
  if (!r.ok) throw new Error("Expected repeated pair");
  expect(r.output.totalLength).toBe(15);
  expect(r.output.pairCounts).toEqual([{ from: "p", to: "q", count: 3 }]);
  for (const p of r.output.degrees)
    expect(p.degree).toBe(
      r.output.connections.filter((c) => c.from === p.id || c.to === p.id)
        .length,
    );
});
it("distinguishes exact cardinality failures and resource bounds", () => {
  expect(tool.execute({ ...example.input, connectionCount: 4 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_connections" }] },
  });
  expect(tool.execute({ ...example.input, maximumDegree: 1 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_connections" }] },
  });
  expect(tool.execute({ ...example.input, connectionCount: 65 })).toMatchObject(
    {
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "connectionCount" }] },
    },
  );
});
