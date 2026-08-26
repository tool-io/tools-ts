import { describe, expect, it } from "vitest";
import { pressPressureSpecExample, runPressPressureSpec } from "./tool.js";

describe("Press Pressure Spec Check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPressPressureSpec(pressPressureSpecExample.input)).toEqual({
      ok: true,
      output: pressPressureSpecExample.output,
    });
  });

  it("accepts the 0.2 lower boundary", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: 0.2 })).toEqual({
      ok: true,
      output: { isInRange: true },
    });
  });

  it("accepts the 0.8 upper boundary", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: 0.8 })).toEqual({
      ok: true,
      output: { isInRange: true },
    });
  });

  it("fails just below the specification", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: 0.19 })).toEqual({
      ok: true,
      output: { isInRange: false },
    });
  });

  it("fails just above the specification", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: 0.81 })).toEqual({
      ok: true,
      output: { isInRange: false },
    });
  });

  it("fails zero pressure", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: 0 })).toEqual({
      ok: true,
      output: { isInRange: false },
    });
  });

  it("fails the three N/mm² input maximum", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: 3 })).toEqual({
      ok: true,
      output: { isInRange: false },
    });
  });

  it("rejects pressure above three N/mm²", () => {
    const result = runPressPressureSpec({ pressureNPerMm2: 3.5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects negative pressure", () => {
    expect(runPressPressureSpec({ pressureNPerMm2: -0.5 }).ok).toBe(false);
  });

  it("requires the press pressure", () => {
    expect(runPressPressureSpec({}).ok).toBe(false);
  });
});
