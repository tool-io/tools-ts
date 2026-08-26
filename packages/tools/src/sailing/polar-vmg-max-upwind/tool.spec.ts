import { describe, expect, it } from "vitest";
import { polarVmgMaxUpwindExample, runPolarVmgMaxUpwind } from "./tool.js";

describe("Upwind VMG Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPolarVmgMaxUpwind(polarVmgMaxUpwindExample.input)).toEqual({
      ok: true,
      output: { velocityMadeGoodKt: 4.949747468305833 },
    });
  });

  it("equals boat speed dead downwind of the zero degree bound", () => {
    expect(
      runPolarVmgMaxUpwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 0 }),
    ).toEqual({ ok: true, output: { velocityMadeGoodKt: 7 } });
  });

  it("matches sixty degree geometry", () => {
    expect(
      runPolarVmgMaxUpwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 60 }),
    ).toEqual({
      ok: true,
      output: { velocityMadeGoodKt: 3.500000000000001 },
    });
  });

  it("approaches zero at the ninety degree inclusive bound", () => {
    expect(
      runPolarVmgMaxUpwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 90 }),
    ).toEqual({
      ok: true,
      output: { velocityMadeGoodKt: 4.286263797015736e-16 },
    });
  });

  it("scales linearly with boat speed", () => {
    const result = runPolarVmgMaxUpwind({
      targetBoatSpeedKt: 5,
      trueWindAngleDeg: 30,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.velocityMadeGoodKt).toBeCloseTo(4.330127018922194, 12);
  });

  it("rejects zero or negative boat speed with a stable error", () => {
    expect(
      runPolarVmgMaxUpwind({ targetBoatSpeedKt: 0, trueWindAngleDeg: 45 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "targetBoatSpeedKt" }],
      },
      ok: false,
    });
  });

  it("rejects wind angles outside the schema bounds", () => {
    expect(
      runPolarVmgMaxUpwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: -1 }).ok,
    ).toBe(false);
    expect(
      runPolarVmgMaxUpwind({ targetBoatSpeedKt: 7, trueWindAngleDeg: 91 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "trueWindAngleDeg" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runPolarVmgMaxUpwind({
        heelDegrees: 15,
        targetBoatSpeedKt: 7,
        trueWindAngleDeg: 45,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "heelDegrees" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runPolarVmgMaxUpwind(null).ok).toBe(false);
    expect(runPolarVmgMaxUpwind({}).ok).toBe(false);
  });
});
