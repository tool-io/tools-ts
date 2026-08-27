import { describe, expect, it } from "vitest";
import { runBandwidthFromQ } from "./tool.js";
describe("Bandwidth From Q", () => {
  it("calculates a valid result", () =>
    expect(runBandwidthFromQ({ qFactor: 50, resonantFreqHz: 1000 })).toEqual({
      ok: true,
      output: { bandwidthHz: 20 },
    }));
  it("calculates another value", () =>
    expect(runBandwidthFromQ({ qFactor: 5, resonantFreqHz: 2500 })).toEqual({
      ok: true,
      output: { bandwidthHz: 500 },
    }));
  it("rejects zero resonant frequency", () => {
    const result = runBandwidthFromQ({ qFactor: 10, resonantFreqHz: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "resonantFreqHz",
      });
  });
  it("rejects zero quality factor", () => {
    const result = runBandwidthFromQ({ qFactor: 0, resonantFreqHz: 1000 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "qFactor",
      });
  });
  it("rejects negative inputs", () => {
    const result = runBandwidthFromQ({ qFactor: -1, resonantFreqHz: -100 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("resonantFreqHz");
  });
  it("rejects non-finite input", () =>
    expect(
      runBandwidthFromQ({
        qFactor: Number.POSITIVE_INFINITY,
        resonantFreqHz: 1000,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runBandwidthFromQ({
      extra: 3,
      qFactor: 1,
      resonantFreqHz: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runBandwidthFromQ({ resonantFreqHz: 1000 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runBandwidthFromQ({ qFactor: "50", resonantFreqHz: 1000 }).ok).toBe(
      false,
    ));
});
