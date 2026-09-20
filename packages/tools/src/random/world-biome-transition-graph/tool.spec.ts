import { expect, it } from "vitest";
import tool, { calculateWorldBiomeTransitionGraph, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateWorldBiomeTransitionGraph, example);
it("lightweight independent missing compatibility cannot label a nonempty edge", () => {
  expect(tool.execute({ ...example.input, compatiblePairs: [] })).toMatchObject(
    { ok: false, error: { issues: [{ code: "infeasible_constraints" }] } },
  );
});
