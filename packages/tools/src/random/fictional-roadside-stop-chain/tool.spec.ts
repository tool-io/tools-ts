import { expect, it } from "vitest";
import tool, { calculateFictionalRoadsideStopChain, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalRoadsideStopChain, example);
it("lightweight independent singleton has no travel and impossible exclusion rejects", () => {
  expect(tool.execute({ ...example.input, count: 1 })).toMatchObject({
    ok: true,
    output: { links: [], totalKm: 0, componentCount: 1 },
  });
  expect(
    tool.execute({ ...example.input, stopTypes: [example.input.stopTypes[0]] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_constraints", field: "stopTypes" }] },
  });
});
