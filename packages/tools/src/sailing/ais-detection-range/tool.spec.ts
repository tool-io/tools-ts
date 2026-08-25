import { describe, expect, it } from "vitest";
import { aisDetectionRangeExample, runAisDetectionRange } from "./tool.js";

describe("AIS Range Estimate", () => {
  it("calculates the canonical example exactly", () => {
    expect(runAisDetectionRange(aisDetectionRangeExample.input)).toEqual({
      ok: true,
      output: { detectionRangeNm: 11.7 },
    });
  });

  it("matches the sum of both antenna horizons times the coefficient", () => {
    const result = runAisDetectionRange({
      ownAntennaFeet: 16,
      targetAntennaFeet: 36,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.detectionRangeNm).toBeCloseTo(1.17 * (4 + 6), 10);
  });

  it("grows with the square root of each antenna height", () => {
    const low = runAisDetectionRange({
      ownAntennaFeet: 9,
      targetAntennaFeet: 9,
    });
    const high = runAisDetectionRange({
      ownAntennaFeet: 36,
      targetAntennaFeet: 49,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.detectionRangeNm).toBeCloseTo(1.17 * (6 + 7), 10);
    expect(high.output.detectionRangeNm).toBeGreaterThan(
      Number(low.output.detectionRangeNm),
    );
  });

  it("treats identical masthead heights symmetrically", () => {
    expect(
      runAisDetectionRange({
        ownAntennaFeet: 25,
        targetAntennaFeet: 25,
      }),
    ).toEqual({ ok: true, output: { detectionRangeNm: 11.7 } });
  });

  it("rejects non-positive antenna heights", () => {
    expect(
      runAisDetectionRange({ ownAntennaFeet: 0, targetAntennaFeet: 49 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "ownAntennaFeet" }] },
      ok: false,
    });
    expect(
      runAisDetectionRange({ ownAntennaFeet: 9, targetAntennaFeet: -2 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "targetAntennaFeet" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite heights", () => {
    expect(
      runAisDetectionRange({
        ownAntennaFeet: 9,
        targetAntennaFeet: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runAisDetectionRange({
        mmsi: 235009803,
        ownAntennaFeet: 9,
        targetAntennaFeet: 49,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "mmsi" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runAisDetectionRange(null).ok).toBe(false);
    expect(runAisDetectionRange({}).ok).toBe(false);
  });
});
