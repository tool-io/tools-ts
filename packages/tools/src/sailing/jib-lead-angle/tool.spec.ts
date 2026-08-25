import { describe, expect, it } from "vitest";
import { jibLeadAngleExample, runJibLeadAngle } from "./tool.js";

describe("jib lead angle guide", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJibLeadAngle(jibLeadAngleExample.input)).toEqual({
      ok: true,
      output: jibLeadAngleExample.output,
    });
  });

  it("clamps to five degrees in calm air at the zero boundary", () => {
    expect(runJibLeadAngle({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { leadAngleDegrees: 5 },
    });
  });

  it("rounds half values upward", () => {
    expect(runJibLeadAngle({ apparentWindKt: 10.625 })).toEqual({
      ok: true,
      output: { leadAngleDegrees: 9 },
    });
  });

  it("caps at twenty-five degrees in heavy air", () => {
    expect(runJibLeadAngle({ apparentWindKt: 40 })).toEqual({
      ok: true,
      output: { leadAngleDegrees: 25 },
    });
  });

  it("returns the exact cap when the raw value lands on it", () => {
    expect(runJibLeadAngle({ apparentWindKt: 31.25 })).toEqual({
      ok: true,
      output: { leadAngleDegrees: 25 },
    });
  });

  it("tracks the wind across the unclamped middle", () => {
    const result = runJibLeadAngle({ apparentWindKt: 15 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.leadAngleDegrees).toBe(12);
  });

  it("rejects negative wind through validation", () => {
    expect(runJibLeadAngle({ apparentWindKt: -0.5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runJibLeadAngle({}).ok).toBe(false);
    expect(runJibLeadAngle({ apparentWindKt: "breeze" }).ok).toBe(false);
    expect(
      runJibLeadAngle({ apparentWindKt: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });
});
