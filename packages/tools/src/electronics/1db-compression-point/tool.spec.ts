import { describe, expect, it } from "vitest";
import { runOneDbCompressionPoint } from "./tool.js";

describe("P1dB Estimate", () => {
  it("calculates a valid result", () =>
    expect(runOneDbCompressionPoint({ ip3Dbm: 30 })).toEqual({
      ok: true,
      output: { p1dbDbm: 20.4 },
    }));
  it("handles zero IP3", () =>
    expect(runOneDbCompressionPoint({ ip3Dbm: 0 })).toEqual({
      ok: true,
      output: { p1dbDbm: -9.6 },
    }));
  it("handles negative IP3", () =>
    expect(runOneDbCompressionPoint({ ip3Dbm: -40 })).toEqual({
      ok: true,
      output: { p1dbDbm: -49.6 },
    }));
  it("returns zero when IP3 equals the rule offset", () =>
    expect(runOneDbCompressionPoint({ ip3Dbm: 9.6 })).toEqual({
      ok: true,
      output: { p1dbDbm: 0 },
    }));
  it("accepts any finite level", () =>
    expect(runOneDbCompressionPoint({ ip3Dbm: -0.4 })).toEqual({
      ok: true,
      output: { p1dbDbm: -10 },
    }));
  it("rejects a non-finite IP3", () =>
    expect(runOneDbCompressionPoint({ ip3Dbm: Number.NaN }).ok).toBe(false));
});
