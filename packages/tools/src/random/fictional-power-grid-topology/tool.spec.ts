import { expect, it } from "vitest";
import tool, { calculateFictionalPowerGridTopology, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalPowerGridTopology, example);
it("lightweight independent consumers require direct backbone links", () => {
  expect(
    tool.execute({
      ...example.input,
      candidates: [
        { from: "g", to: "j" },
        { from: "c", to: "d" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "infeasible_constraints", field: "candidates" }],
    },
  });
});
