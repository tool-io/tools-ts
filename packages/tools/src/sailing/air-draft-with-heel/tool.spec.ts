import { describe, expect, it } from "vitest";
import { airDraftWithHeelExample, runAirDraftWithHeel } from "./tool.js";

describe("Air Draft With Heel", () => {
  it("calculates the canonical example exactly", () => {
    expect(runAirDraftWithHeel(airDraftWithHeelExample.input)).toEqual({
      ok: true,
      output: { effectiveAirDraftMeters: 18.320508075688775 },
    });
  });

  it("equals the upright air draft at zero heel", () => {
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 16,
        beamMeters: 5,
        heelDeg: 0,
      }),
    ).toEqual({ ok: true, output: { effectiveAirDraftMeters: 16 } });
  });

  it("approaches half the beam at ninety degrees of heel", () => {
    const result = runAirDraftWithHeel({
      airDraftUprightMeters: 18,
      beamMeters: 6,
      heelDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.effectiveAirDraftMeters).toBeCloseTo(3, 6);
  });

  it("reduces the effective height for typical heels", () => {
    const result = runAirDraftWithHeel({
      airDraftUprightMeters: 16,
      beamMeters: 4.2,
      heelDeg: 25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.effectiveAirDraftMeters).toBeCloseTo(
      15.388422942241867,
      10,
    );
  });

  it("accepts fractional heel angles within the range", () => {
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 12,
        beamMeters: 4,
        heelDeg: 12.5,
      }).ok,
    ).toBe(true);
  });

  it("rejects heel outside zero to ninety degrees", () => {
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 16,
        beamMeters: 4,
        heelDeg: 90.1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "heelDeg" }] },
      ok: false,
    });
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 16,
        beamMeters: 4,
        heelDeg: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive upright air draft and beam", () => {
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 0,
        beamMeters: 4,
        heelDeg: 30,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "airDraftUprightMeters" }],
      },
      ok: false,
    });
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 16,
        beamMeters: 0,
        heelDeg: 30,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "beamMeters" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runAirDraftWithHeel({
        airDraftUprightMeters: 20,
        draftMeters: 2,
        beamMeters: 4,
        heelDeg: 30,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "draftMeters" }] },
      ok: false,
    });
    expect(runAirDraftWithHeel(null).ok).toBe(false);
  });
});
