import { describe, expect, it } from "vitest";
import { runStallSpeedGust } from "./tool.js";
describe("Gust Stall Speed Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runStallSpeedGust({ gustLoadFactorG: 1.5625, stallingSpeedKt: 64 }),
    ).toEqual({
      ok: true,
      output: { stallSpeedGustKt: 80 },
    }));
  it("keeps the one-g stall speed", () =>
    expect(
      runStallSpeedGust({ gustLoadFactorG: 1, stallingSpeedKt: 120 }),
    ).toEqual({
      ok: true,
      output: { stallSpeedGustKt: 120 },
    }));
  it("handles fractional results", () => {
    const result = runStallSpeedGust({
      gustLoadFactorG: 1.25,
      stallingSpeedKt: 50,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.stallSpeedGustKt).toBeCloseTo(55.90169943749474, 9);
  });
  it("scales with strong gusts", () => {
    const result = runStallSpeedGust({
      gustLoadFactorG: 2,
      stallingSpeedKt: 60,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.stallSpeedGustKt).toBeCloseTo(84.8528137423857, 9);
  });
  it("rejects zero stalling speed", () =>
    expect(
      runStallSpeedGust({ gustLoadFactorG: 1.2, stallingSpeedKt: 0 }).ok,
    ).toBe(false));
  it("rejects negative stalling speed", () =>
    expect(
      runStallSpeedGust({ gustLoadFactorG: 1.2, stallingSpeedKt: -64 }).ok,
    ).toBe(false));
  it("rejects non-positive load factors", () =>
    expect(
      runStallSpeedGust({ gustLoadFactorG: 0, stallingSpeedKt: 64 }).ok,
    ).toBe(false));
});
