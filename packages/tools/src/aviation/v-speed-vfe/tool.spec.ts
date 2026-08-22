import { describe, expect, it } from "vitest";
import { calculateVSpeedVfe, runVSpeedVfe, vSpeedVfeExample } from "./tool.js";

describe("vfe speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVSpeedVfe(vSpeedVfeExample.input)).toEqual({
      ok: true,
      output: vSpeedVfeExample.output,
    });
  });

  it("equals 1.6 times the stall speed", () => {
    expect(calculateVSpeedVfe({ stallingSpeed: 55 })).toEqual({ vfe: 88 });
    expect(calculateVSpeedVfe({ stallingSpeed: 61.5 })).toEqual({
      vfe: 98.4,
    });
  });

  it("keeps the raw quotient without rounding", () => {
    expect(calculateVSpeedVfe({ stallingSpeed: 33.3 })).toEqual({
      vfe: 1.6 * 33.3,
    });
  });

  it("handles tiny stall speeds", () => {
    expect(calculateVSpeedVfe({ stallingSpeed: 0.001 })).toEqual({
      vfe: 0.0016,
    });
  });

  it("handles large stall speeds", () => {
    expect(calculateVSpeedVfe({ stallingSpeed: 250 })).toEqual({ vfe: 400 });
  });

  it("rejects zero through execution", () => {
    expect(runVSpeedVfe({ stallingSpeed: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runVSpeedVfe({ stallingSpeed: -50 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runVSpeedVfe({ stallingSpeed: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("accepts fractional speeds just above zero", () => {
    expect(runVSpeedVfe({ stallingSpeed: 0.5 })).toEqual({
      ok: true,
      output: { vfe: 0.8 },
    });
  });

  it("scales linearly across the valid domain", () => {
    expect(calculateVSpeedVfe({ stallingSpeed: 100 }).vfe).toBe(
      2 * calculateVSpeedVfe({ stallingSpeed: 50 }).vfe,
    );
  });
});
