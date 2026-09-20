import { expect, it } from "vitest";
import tool, { calculateFictionalMigrationStoryMap, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalMigrationStoryMap, example);
it("lightweight independent no-repeat walk is bounded by declared locations", () => {
  expect(tool.execute({ ...example.input, stopCount: 4 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "stopCount", code: "infeasible_constraints" }] },
  });
});
