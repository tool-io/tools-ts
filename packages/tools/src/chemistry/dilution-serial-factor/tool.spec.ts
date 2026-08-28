import { describe, expect, it } from "vitest";
import { runDilutionSerialFactor } from "./tool.js";

describe("Serial Dilution Factor Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDilutionSerialFactor({ dilutionPerStep: 10, steps: 3 })).toEqual({
      ok: true,
      output: { totalDilutionFactor: 1000 },
    });
  });

  it("rejects invalid input", () =>
    expect(runDilutionSerialFactor(null).ok).toBe(false));
});
