import { describe, expect, it } from "vitest";
import { calculateVSpeedVs0, runVSpeedVs0, vSpeedVs0Example } from "./tool.js";

describe("vs0 speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVSpeedVs0(vSpeedVs0Example.input)).toEqual({
      ok: true,
      output: vSpeedVs0Example.output,
    });
  });

  it("divides the clean stall speed by 1.15", () => {
    expect(calculateVSpeedVs0({ cleanStallSpeed: 115 })).toEqual({
      vs0: 115 / 1.15,
    });
    expect(calculateVSpeedVs0({ cleanStallSpeed: 57.5 })).toEqual({
      vs0: 57.5 / 1.15,
    });
  });

  it("keeps the raw quotient without rounding", () => {
    expect(calculateVSpeedVs0({ cleanStallSpeed: 1 })).toEqual({
      vs0: 1 / 1.15,
    });
  });

  it("handles tiny clean stall speeds", () => {
    expect(calculateVSpeedVs0({ cleanStallSpeed: 0.0115 })).toEqual({
      vs0: 0.01,
    });
  });

  it("handles large clean stall speeds", () => {
    expect(calculateVSpeedVs0({ cleanStallSpeed: 345 })).toEqual({ vs0: 300 });
  });

  it("rejects zero through execution", () => {
    expect(runVSpeedVs0({ cleanStallSpeed: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runVSpeedVs0({ cleanStallSpeed: -48 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runVSpeedVs0({ cleanStallSpeed: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("accepts fractional speeds just above zero", () => {
    expect(runVSpeedVs0({ cleanStallSpeed: 0.5 })).toEqual({
      ok: true,
      output: { vs0: 0.5 / 1.15 },
    });
  });

  it("inverts the vs1 relationship", () => {
    expect(calculateVSpeedVs0({ cleanStallSpeed: 345 }).vs0 * 1.15).toBe(345);
  });
});
