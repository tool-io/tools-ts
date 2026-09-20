import { expect, it } from "vitest";
import tool, { calculateFictionalRiverTownNetwork, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalRiverTownNetwork, example);
it("lightweight unrepresentable ordinal sampling spans have a stable numeric error", () => {
  expect(
    tool.execute({
      ...example.input,
      minimumElevation: -Number.MAX_SAFE_INTEGER,
      maximumElevation: Number.MAX_SAFE_INTEGER,
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "maximumElevation", code: "numeric_overflow" }],
    },
  });
});
it("lightweight independent distinct elevations require enough ordinal values", () => {
  expect(
    tool.execute({ ...example.input, maximumElevation: 11 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "infeasible_constraints", field: "maximumElevation" }],
    },
  });
  const result = tool.execute(example.input);
  if (!result.ok) throw new Error("Expected fixture");
  for (const edge of result.output.rivers) {
    const from = result.output.towns.find((t) => t.id === edge.from);
    const to = result.output.towns.find((t) => t.id === edge.to);
    expect(from?.elevation).toBeGreaterThan(to?.elevation ?? Infinity);
  }
});
