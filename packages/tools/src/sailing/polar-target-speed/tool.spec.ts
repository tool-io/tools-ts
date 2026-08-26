import { describe, expect, it } from "vitest";
import { polarTargetSpeedExample, runPolarTargetSpeed } from "./tool.js";

describe("Polar Target Speed Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPolarTargetSpeed(polarTargetSpeedExample.input)).toEqual({
      ok: true,
      output: { targetBoatSpeedKt: 6 },
    });
  });

  it("defaults the efficiency ratio to one half when omitted", () => {
    expect(runPolarTargetSpeed({ windSpeedKt: 8 })).toEqual({
      ok: true,
      output: { targetBoatSpeedKt: 4 },
    });
  });

  it("doubles wind speed at the maximum ratio of two", () => {
    expect(
      runPolarTargetSpeed({ efficiencyRatio: 2, windSpeedKt: 20 }),
    ).toEqual({ ok: true, output: { targetBoatSpeedKt: 40 } });
  });

  it("accepts the minimum ratio of zero point one", () => {
    expect(
      runPolarTargetSpeed({ efficiencyRatio: 0.1, windSpeedKt: 4 }),
    ).toEqual({ ok: true, output: { targetBoatSpeedKt: 0.4 } });
  });

  it("handles fractional wind speeds", () => {
    expect(runPolarTargetSpeed({ windSpeedKt: 7.5 })).toEqual({
      ok: true,
      output: { targetBoatSpeedKt: 3.75 },
    });
  });

  it("rejects a ratio above the maximum", () => {
    expect(
      runPolarTargetSpeed({ efficiencyRatio: 2.1, windSpeedKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "efficiencyRatio" }] },
      ok: false,
    });
  });

  it("rejects a ratio below the minimum", () => {
    expect(
      runPolarTargetSpeed({ efficiencyRatio: 0, windSpeedKt: 12 }).ok,
    ).toBe(false);
  });

  it("rejects zero wind speed with a stable error", () => {
    expect(runPolarTargetSpeed({ windSpeedKt: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects negative wind speed", () => {
    expect(runPolarTargetSpeed({ windSpeedKt: -5 }).ok).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runPolarTargetSpeed({ sailAreaFt2: 400, windSpeedKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "sailAreaFt2" }] },
      ok: false,
    });
    expect(runPolarTargetSpeed(null).ok).toBe(false);
  });

  it("rejects missing wind speed", () => {
    expect(runPolarTargetSpeed({}).ok).toBe(false);
  });
});
