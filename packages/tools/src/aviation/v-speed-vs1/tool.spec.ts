import { describe, expect, it } from "vitest";
import { calculateVSpeedVs1, runVSpeedVs1, vSpeedVs1Example } from "./tool.js";

describe("vs1 speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVSpeedVs1(vSpeedVs1Example.input)).toEqual({
      ok: true,
      output: vSpeedVs1Example.output,
    });
  });

  it("equals 1.15 times the reference stall speed", () => {
    expect(calculateVSpeedVs1({ landingStallSpeed: 100 })).toEqual({
      vs1: 100 * 1.15,
    });
    expect(calculateVSpeedVs1({ landingStallSpeed: 60 })).toEqual({ vs1: 69 });
  });

  it("keeps the raw product without rounding", () => {
    expect(calculateVSpeedVs1({ landingStallSpeed: 33.3 })).toEqual({
      vs1: 33.3 * 1.15,
    });
  });

  it("handles tiny reference speeds", () => {
    expect(calculateVSpeedVs1({ landingStallSpeed: 0.01 })).toEqual({
      vs1: 0.0115,
    });
  });

  it("handles large reference speeds", () => {
    expect(calculateVSpeedVs1({ landingStallSpeed: 260 })).toEqual({
      vs1: 299,
    });
  });

  it("rejects zero through execution", () => {
    expect(runVSpeedVs1({ landingStallSpeed: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runVSpeedVs1({ landingStallSpeed: -52 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runVSpeedVs1({ landingStallSpeed: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("accepts fractional speeds just above zero", () => {
    expect(runVSpeedVs1({ landingStallSpeed: 0.5 })).toEqual({
      ok: true,
      output: { vs1: 0.575 },
    });
  });

  it("scales linearly across the valid domain", () => {
    expect(calculateVSpeedVs1({ landingStallSpeed: 100 }).vs1).toBe(
      2 * calculateVSpeedVs1({ landingStallSpeed: 50 }).vs1,
    );
  });
});
