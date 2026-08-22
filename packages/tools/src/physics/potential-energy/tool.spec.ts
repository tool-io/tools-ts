import { describe, expect, it } from "vitest";
import { runPotentialEnergy } from "./tool.js";

describe("Potential Energy Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runPotentialEnergy({ gravityMs2: 9.80665, heightM: 5, massKg: 2 }),
    ).toEqual({
      ok: true,
      output: { joules: expect.closeTo(98.0665, 9) },
    });
  });

  it("defaults to standard Earth gravity", () => {
    expect(runPotentialEnergy({ heightM: 10, massKg: 1 })).toEqual({
      ok: true,
      output: { joules: expect.closeTo(98.0665, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runPotentialEnergy(null).ok).toBe(false));
});
