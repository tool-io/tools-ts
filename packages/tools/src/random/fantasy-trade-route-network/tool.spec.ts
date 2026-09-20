import { expect, it } from "vitest";
import tool, { calculateFantasyTradeRouteNetwork, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFantasyTradeRouteNetwork, example);
it("lightweight independent commodity intersection is required for connectivity", () => {
  expect(
    tool.execute({
      ...example.input,
      markets: [
        { id: "a", commodityIds: ["ore"] },
        ...example.input.markets.slice(1),
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints", field: "edgeCount" }] },
  });
});
