import { describe, expect, it } from "vitest";
import { calculateVSpeedVle, runVSpeedVle, vSpeedVleExample } from "./tool.js";

describe("vle speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVSpeedVle(vSpeedVleExample.input)).toEqual({
      ok: true,
      output: vSpeedVleExample.output,
    });
  });

  it("equals 1.8 times the stall speed", () => {
    expect(calculateVSpeedVle({ stallingSpeed: 55 })).toEqual({ vle: 99 });
    expect(calculateVSpeedVle({ stallingSpeed: 45 })).toEqual({ vle: 81 });
  });

  it("keeps the raw quotient without rounding", () => {
    expect(calculateVSpeedVle({ stallingSpeed: 0.01 })).toEqual({
      vle: 1.8 * 0.01,
    });
  });

  it("handles tiny stall speeds", () => {
    expect(calculateVSpeedVle({ stallingSpeed: 0.001 })).toEqual({
      vle: 1.8 * 0.001,
    });
  });

  it("handles large stall speeds", () => {
    expect(calculateVSpeedVle({ stallingSpeed: 300 })).toEqual({ vle: 540 });
  });

  it("rejects zero through execution", () => {
    expect(runVSpeedVle({ stallingSpeed: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runVSpeedVle({ stallingSpeed: -65 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runVSpeedVle({ stallingSpeed: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("accepts fractional speeds just above zero", () => {
    expect(runVSpeedVle({ stallingSpeed: 0.5 })).toEqual({
      ok: true,
      output: { vle: 0.9 },
    });
  });

  it("scales linearly across the valid domain", () => {
    expect(calculateVSpeedVle({ stallingSpeed: 100 }).vle).toBe(
      2 * calculateVSpeedVle({ stallingSpeed: 50 }).vle,
    );
  });
});
