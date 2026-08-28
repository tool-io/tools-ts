import { describe, expect, it } from "vitest";
import { runBoyleLaw } from "./tool.js";
describe("Boyle's Law Calculator", () => {
  it("calculates a valid result", () =>
    expect(runBoyleLaw({ pressure1: 100, volume1: 2, volume2: 4 })).toEqual({
      ok: true,
      output: { pressure2: 50 },
    }));
  it("rejects invalid input", () =>
    expect(runBoyleLaw({ pressure1: 100, volume1: 2, volume2: 0 }).ok).toBe(
      false,
    ));
});
