import { describe, expect, it } from "vitest";
import { runCombustionOxygenMass } from "./tool.js";

describe("Combustion Oxygen Mass Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runCombustionOxygenMass({
        carbonMassG: 6,
        hydrogenMassG: 1,
        sampleMassG: 10,
      }),
    ).toEqual({ ok: true, output: { oxygenMassG: 3 } });
  });

  it("rejects invalid input", () =>
    expect(runCombustionOxygenMass(null).ok).toBe(false));
});
