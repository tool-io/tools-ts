import { expect, it } from "vitest";
import tool, { calculateFictionalDistrictAdjacency, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalDistrictAdjacency, example);
it("lightweight independent incompatible land uses prove disconnection", () => {
  expect(
    tool.execute({
      ...example.input,
      prohibitedLandUsePairs: [
        { from: "homes", to: "market" },
        { from: "homes", to: "park" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints" }] },
  });
});
