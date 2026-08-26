import { describe, expect, it } from "vitest";
import { runVhfLineOfSightRange, vhfLineOfSightRangeExample } from "./tool.js";

describe("VHF Range Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runVhfLineOfSightRange(vhfLineOfSightRangeExample.input)).toEqual({
      ok: true,
      output: { communicationRangeNm: 12.87 },
    });
  });

  it("adds the horizon contributions of both antennas", () => {
    const result = runVhfLineOfSightRange({
      shoreAntennaFeet: 9,
      vesselAntennaFeet: 16,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.communicationRangeNm).toBeCloseTo(1.17 * (3 + 4), 10);
  });

  it("grows with the square root of each antenna height", () => {
    const low = runVhfLineOfSightRange({
      shoreAntennaFeet: 25,
      vesselAntennaFeet: 4,
    });
    const high = runVhfLineOfSightRange({
      shoreAntennaFeet: 100,
      vesselAntennaFeet: 16,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.communicationRangeNm).toBeCloseTo(
      Number(low.output.communicationRangeNm) * 2,
      10,
    );
  });

  it("matches a tall shore station giving long range", () => {
    const result = runVhfLineOfSightRange({
      shoreAntennaFeet: 256,
      vesselAntennaFeet: 9,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.communicationRangeNm).toBeCloseTo(22.23, 10);
  });

  it("rejects non-positive antenna heights", () => {
    expect(
      runVhfLineOfSightRange({
        shoreAntennaFeet: 64,
        vesselAntennaFeet: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "vesselAntennaFeet" }],
      },
      ok: false,
    });
    expect(
      runVhfLineOfSightRange({
        shoreAntennaFeet: -10,
        vesselAntennaFeet: 9,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "shoreAntennaFeet" }] },
      ok: false,
    });
  });

  it("rejects non-finite heights", () => {
    expect(
      runVhfLineOfSightRange({
        shoreAntennaFeet: Number.NaN,
        vesselAntennaFeet: 9,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runVhfLineOfSightRange({
        powerWatts: 25,
        shoreAntennaFeet: 64,
        vesselAntennaFeet: 9,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "powerWatts" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runVhfLineOfSightRange(null).ok).toBe(false);
    expect(runVhfLineOfSightRange({}).ok).toBe(false);
  });
});
