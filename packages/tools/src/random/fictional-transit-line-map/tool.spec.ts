import { expect, it } from "vitest";
import tool, { calculateFictionalTransitLineMap, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalTransitLineMap, example);
it("lightweight independent inadequate connected coverage is rejected", () => {
  expect(tool.execute({ ...example.input, lineStopCounts: [2] })).toMatchObject(
    {
      ok: false,
      error: {
        issues: [{ field: "lineStopCounts", code: "infeasible_constraints" }],
      },
    },
  );
  expect(tool.execute({ ...example.input, lineStopCounts: [3] })).toMatchObject(
    { ok: true, output: { transferStationIds: [], componentCount: 1 } },
  );
});
