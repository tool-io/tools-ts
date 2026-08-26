import { describe, expect, it } from "vitest";
import {
  calculateSartDetectionRange,
  sartDetectionRangeExample,
  runSartDetectionRange,
} from "./tool.js";

describe("SART Detection Range", () => {
  it("publishes an executable example", () =>
    expect(runSartDetectionRange(sartDetectionRangeExample.input)).toEqual({
      ok: true,
      output: sartDetectionRangeExample.output,
    }));

  it.each([
    [25, 25, 11.7],
    [9, 4, 5.85],
    [1, 1, 2.34],
    [100, 16, 16.38],
    [0.25, 0.25, 1.17],
  ])(
    "scales with the square roots of both heights",
    (sartHeightFeet, responderAntennaFeet, expected) => {
      expect(
        calculateSartDetectionRange({ responderAntennaFeet, sartHeightFeet }),
      ).toEqual({ detectionRangeNm: expected });
    },
  );

  it("caps the range at forty nautical miles", () => {
    expect(
      calculateSartDetectionRange({
        responderAntennaFeet: 400,
        sartHeightFeet: 400,
      }),
    ).toEqual({ detectionRangeNm: 40 });
    expect(
      calculateSartDetectionRange({
        responderAntennaFeet: 10000,
        sartHeightFeet: 900,
      }),
    ).toEqual({ detectionRangeNm: 40 });
  });

  it("stays below the cap for typical mast heights", () => {
    const result = runSartDetectionRange({
      responderAntennaFeet: 9,
      sartHeightFeet: 3,
    });
    expect(result.ok).toBe(true);
  });

  it.each([
    [0, 25],
    [25, 0],
    [-3, 9],
    [9, -9],
  ])("rejects non-positive heights", (sartHeightFeet, responderAntennaFeet) => {
    expect(
      calculateSartDetectionRange({ responderAntennaFeet, sartHeightFeet }),
    ).toBeNull();
    const result = runSartDetectionRange({
      responderAntennaFeet,
      sartHeightFeet,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_height");
  });

  it("rejects non-finite heights at the schema level", () => {
    const result = runSartDetectionRange({
      responderAntennaFeet: Number.NaN,
      sartHeightFeet: 3,
    });
    expect(result.ok).toBe(false);
    expect(runSartDetectionRange({} as never).ok).toBe(false);
  });

  it("rejects unknown input fields and null input", () => {
    const result = runSartDetectionRange({
      extra: 1,
      responderAntennaFeet: 25,
      sartHeightFeet: 25,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(runSartDetectionRange(null as never).ok).toBe(false);
  });

  it("is monotonic in each height below the cap", () => {
    const low = calculateSartDetectionRange({
      responderAntennaFeet: 9,
      sartHeightFeet: 4,
    })!.detectionRangeNm;
    const high = calculateSartDetectionRange({
      responderAntennaFeet: 9,
      sartHeightFeet: 16,
    })!.detectionRangeNm;
    expect(high).toBeGreaterThan(low);
  });
});
