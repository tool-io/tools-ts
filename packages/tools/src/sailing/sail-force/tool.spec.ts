import { describe, expect, it } from "vitest";
import { runSailForce, sailForceExample } from "./tool.js";

describe("sail drag force calculator", () => {
  it("reproduces its canonical example exactly with the default drag coefficient", () => {
    expect(runSailForce(sailForceExample.input)).toEqual({
      ok: true,
      output: sailForceExample.output,
    });
  });

  it("doubles the force when the drag coefficient doubles", () => {
    expect(
      runSailForce({ dragCoefficient: 2, sailAreaM2: 50, windSpeedMs: 10 }),
    ).toEqual({ ok: true, output: { sailForceNewtons: 6125 } });
  });

  it("scales with speed and area under the default coefficient", () => {
    expect(runSailForce({ sailAreaM2: 1, windSpeedMs: 2 })).toEqual({
      ok: true,
      output: { sailForceNewtons: 2.6950000000000003 },
    });
  });

  it("rejects zero wind speed through calculation and negative wind speed through validation", () => {
    expect(runSailForce({ sailAreaM2: 10, windSpeedMs: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "windSpeedMs" }] },
      ok: false,
    });
    expect(runSailForce({ sailAreaM2: 10, windSpeedMs: -3 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedMs" }] },
      ok: false,
    });
  });

  it("rejects non-positive sail area with invalid_input", () => {
    expect(runSailForce({ sailAreaM2: 0, windSpeedMs: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "sailAreaM2" }] },
      ok: false,
    });
  });

  it("rejects drag coefficients outside 0.1 to 2 through validation", () => {
    for (const dragCoefficient of [0.05, 2.1])
      expect(
        runSailForce({ dragCoefficient, sailAreaM2: 10, windSpeedMs: 5 }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_field", field: "dragCoefficient" }],
        },
        ok: false,
      });
  });

  it("accepts the inclusive drag coefficient boundaries", () => {
    expect(
      runSailForce({ dragCoefficient: 0.1, sailAreaM2: 10, windSpeedMs: 5 }).ok,
    ).toBe(true);
    expect(
      runSailForce({ dragCoefficient: 2, sailAreaM2: 10, windSpeedMs: 5 }).ok,
    ).toBe(true);
  });

  it("rejects missing and malformed inputs", () => {
    expect(runSailForce({}).ok).toBe(false);
    expect(runSailForce({ sailAreaM2: "ten", windSpeedMs: 5 }).ok).toBe(false);
    expect(runSailForce(null).ok).toBe(false);
  });
});
