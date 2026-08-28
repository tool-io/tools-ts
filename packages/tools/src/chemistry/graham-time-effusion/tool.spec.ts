import { describe, expect, it } from "vitest";
import { runGrahamTimeEffusion } from "./tool.js";

describe("Graham Time of Effusion Calculator", () => {
  it("calculates a valid result for hydrogen vs oxygen", () => {
    const result = runGrahamTimeEffusion({
      referenceMolarMassGMol: 2,
      referenceTimeS: 10,
      testMolarMassGMol: 32,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.testTimeS).toBeCloseTo(40, 6);
  });

  it("rejects invalid input", () =>
    expect(runGrahamTimeEffusion(null).ok).toBe(false));
});
