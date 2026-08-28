import { describe, expect, it } from "vitest";
import { runCharlesLaw } from "./tool.js";
describe("Charles's Law Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runCharlesLaw({ temperature1: 273.15, temperature2: 546.3, volume1: 1 }),
    ).toEqual({
      ok: true,
      output: { volume2: 2 },
    }));
  it("rejects invalid input", () =>
    expect(
      runCharlesLaw({ temperature1: 0, temperature2: 546.3, volume1: 1 }).ok,
    ).toBe(false));
});
