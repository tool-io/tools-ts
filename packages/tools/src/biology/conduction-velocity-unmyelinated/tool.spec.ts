import { describe, expect, it } from "vitest";
import { runConductionVelocityUnmyelinated } from "./tool.js";

describe("Unmyelinated Conduction Velocity", () => {
  it("calculates a valid result", () =>
    expect(runConductionVelocityUnmyelinated({ diameterUm: 10 })).toEqual({
      ok: true,
      output: { conductionVelocityMPerS: 1.5811388300841898 },
    }));
  it("uses the documented factor at one micrometre", () => {
    const result = runConductionVelocityUnmyelinated({ diameterUm: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.conductionVelocityMPerS).toBe(0.5);
  });
  it("scales with the square root of diameter", () => {
    const result = runConductionVelocityUnmyelinated({ diameterUm: 20 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.conductionVelocityMPerS).toBeCloseTo(
        2.23606797749979,
        12,
      );
  });
  it("handles fractional diameters", () => {
    const result = runConductionVelocityUnmyelinated({ diameterUm: 2.5 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.conductionVelocityMPerS).toBeCloseTo(
        0.7905694150420949,
        12,
      );
  });
  it("rejects zero diameter", () =>
    expect(runConductionVelocityUnmyelinated({ diameterUm: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative diameter", () => {
    const result = runConductionVelocityUnmyelinated({ diameterUm: -10 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_diameter");
  });
  it("rejects non-finite diameter", () =>
    expect(
      runConductionVelocityUnmyelinated({
        diameterUm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false));
});
