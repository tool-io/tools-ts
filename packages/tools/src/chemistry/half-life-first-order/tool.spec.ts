import { describe, expect, it } from "vitest";
import { runHalfLifeFirstOrder } from "./tool.js";
describe("First Order Half-Life", () => {
  it("calculates a valid result", () =>
    expect(runHalfLifeFirstOrder({ rateConstantPerS: 0.01 })).toEqual({
      ok: true,
      output: { halfLifeSeconds: 69.31471805599453 },
    }));
  it("rejects invalid input", () =>
    expect(runHalfLifeFirstOrder({ rateConstantPerS: 0 }).ok).toBe(false));
});
