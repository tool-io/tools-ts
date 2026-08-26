import { describe, expect, it } from "vitest";
import { runStartLineBias, startLineBiasExample } from "./tool.js";

describe("start line bias calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStartLineBias(startLineBiasExample.input)).toEqual({
      ok: true,
      output: startLineBiasExample.output,
    });
  });

  it("returns negative bias when the line bears parallel against the wind shift", () => {
    expect(
      runStartLineBias({
        boatSpeedKt: 6,
        lineBearingDeg: 90,
        lineLengthNm: 0.5,
        trueWindFromDeg: 270,
      }),
    ).toEqual({ ok: true, output: { lineBiasSeconds: -300 } });
  });

  it("returns near zero for a square line", () => {
    const result = runStartLineBias({
      boatSpeedKt: 6,
      lineBearingDeg: 180,
      lineLengthNm: 0.5,
      trueWindFromDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.lineBiasSeconds).toBeCloseTo(0, 12);
  });

  it("scales with line length and inversely with speed", () => {
    const result = runStartLineBias({
      boatSpeedKt: 4,
      lineBearingDeg: 0,
      lineLengthNm: 1,
      trueWindFromDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.lineBiasSeconds).toBe(900);
  });

  it("rejects zero line length through calculation and negative lengths through validation", () => {
    expect(
      runStartLineBias({
        boatSpeedKt: 6,
        lineBearingDeg: 90,
        lineLengthNm: 0,
        trueWindFromDeg: 90,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "lineLengthNm" }] },
      ok: false,
    });
    expect(
      runStartLineBias({
        boatSpeedKt: 6,
        lineBearingDeg: 90,
        lineLengthNm: -0.2,
        trueWindFromDeg: 90,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lineLengthNm" }] },
      ok: false,
    });
  });

  it("rejects non-positive boat speed with invalid_input", () => {
    expect(
      runStartLineBias({
        boatSpeedKt: 0,
        lineBearingDeg: 90,
        lineLengthNm: 0.5,
        trueWindFromDeg: 90,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "boatSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects bearings outside zero to 360 through validation", () => {
    for (const bearing of [-1, 361])
      expect(
        runStartLineBias({
          boatSpeedKt: 6,
          lineBearingDeg: bearing,
          lineLengthNm: 0.5,
          trueWindFromDeg: 90,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "lineBearingDeg" }] },
        ok: false,
      });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runStartLineBias({}).ok).toBe(false);
    expect(
      runStartLineBias({
        boatSpeedKt: 6,
        lineBearingDeg: "east",
        lineLengthNm: 0.5,
        trueWindFromDeg: 90,
      }).ok,
    ).toBe(false);
    expect(runStartLineBias(null).ok).toBe(false);
  });
});
