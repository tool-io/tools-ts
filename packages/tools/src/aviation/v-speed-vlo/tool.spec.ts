import { describe, expect, it } from "vitest";
import { calculateVSpeedVlo, runVSpeedVlo, vSpeedVloExample } from "./tool.js";

describe("vlo speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVSpeedVlo(vSpeedVloExample.input)).toEqual({
      ok: true,
      output: vSpeedVloExample.output,
    });
  });

  it("equals 1.7 times the stall speed", () => {
    expect(calculateVSpeedVlo({ stallingSpeed: 200 })).toEqual({ vlo: 340 });
    expect(calculateVSpeedVlo({ stallingSpeed: 60 })).toEqual({ vlo: 102 });
  });

  it("keeps the raw quotient without rounding", () => {
    expect(calculateVSpeedVlo({ stallingSpeed: 33.3 })).toEqual({
      vlo: 1.7 * 33.3,
    });
  });

  it("handles tiny stall speeds", () => {
    expect(calculateVSpeedVlo({ stallingSpeed: 0.02 })).toEqual({ vlo: 0.034 });
  });

  it("handles large stall speeds", () => {
    expect(calculateVSpeedVlo({ stallingSpeed: 280 })).toEqual({ vlo: 476 });
  });

  it("rejects zero through execution", () => {
    expect(runVSpeedVlo({ stallingSpeed: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runVSpeedVlo({ stallingSpeed: -70 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runVSpeedVlo({ stallingSpeed: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("accepts fractional speeds just above zero", () => {
    expect(runVSpeedVlo({ stallingSpeed: 0.5 })).toEqual({
      ok: true,
      output: { vlo: 0.85 },
    });
  });

  it("scales linearly across the valid domain", () => {
    expect(calculateVSpeedVlo({ stallingSpeed: 100 }).vlo).toBe(
      2 * calculateVSpeedVlo({ stallingSpeed: 50 }).vlo,
    );
  });
});
