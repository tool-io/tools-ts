import { describe, expect, it } from "vitest";
import { polarVmgMaxDownwindExample, runPolarVmgMaxDownwind } from "./tool.js";

describe("Downwind VMG Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPolarVmgMaxDownwind(polarVmgMaxDownwindExample.input)).toEqual({
      ok: true,
      output: { velocityMadeGoodKt: 4.949747468305832 },
    });
  });

  it("equals boat speed at the one hundred eighty degree inclusive bound", () => {
    expect(
      runPolarVmgMaxDownwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 180 }),
    ).toEqual({ ok: true, output: { velocityMadeGoodKt: 7 } });
  });

  it("approaches zero at the ninety degree inclusive bound", () => {
    expect(
      runPolarVmgMaxDownwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 90 }),
    ).toEqual({
      ok: true,
      output: { velocityMadeGoodKt: 4.286263797015736e-16 },
    });
  });

  it("matches one hundred twenty degree geometry", () => {
    expect(
      runPolarVmgMaxDownwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 120 }),
    ).toEqual({
      ok: true,
      output: { velocityMadeGoodKt: 3.4999999999999982 },
    });
  });

  it("returns positive values across the whole range", () => {
    for (const twa of [95, 120, 150, 175]) {
      const result = runPolarVmgMaxDownwind({
        targetBoatSpeedKt: 6,
        trueWindAngleDeg: twa,
      });
      if (!result.ok) throw new Error("expected success");
      expect(result.output.velocityMadeGoodKt).toBeGreaterThanOrEqual(0);
    }
  });

  it("rejects zero or negative boat speed with a stable error", () => {
    expect(
      runPolarVmgMaxDownwind({ targetBoatSpeedKt: -2, trueWindAngleDeg: 135 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "targetBoatSpeedKt" }],
      },
      ok: false,
    });
  });

  it("rejects wind angles outside the schema bounds", () => {
    expect(
      runPolarVmgMaxDownwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 89 }).ok,
    ).toBe(false);
    expect(
      runPolarVmgMaxDownwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 181 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "trueWindAngleDeg" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runPolarVmgMaxDownwind({
        targetBoatSpeedKt: 7,
        trueWindAngleDeg: 135,
        trueWindSpeedKt: 12,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "trueWindSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runPolarVmgMaxDownwind(null).ok).toBe(false);
    expect(runPolarVmgMaxDownwind({}).ok).toBe(false);
  });
});
