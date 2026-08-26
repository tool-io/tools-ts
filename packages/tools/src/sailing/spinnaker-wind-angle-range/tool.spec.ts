import { describe, expect, it } from "vitest";
import {
  runSpinnakerWindAngleRange,
  spinnakerWindAngleRangeExample,
} from "./tool.js";

describe("Spinnaker Wind Angle Range", () => {
  it("calculates the canonical symmetric example", () =>
    expect(
      runSpinnakerWindAngleRange(spinnakerWindAngleRangeExample.input),
    ).toEqual({ ok: true, output: spinnakerWindAngleRangeExample.output }));
  it("looks up the asymmetric band", () =>
    expect(runSpinnakerWindAngleRange({ sailType: "asymmetric" })).toEqual({
      ok: true,
      output: { maxTwaDeg: 155, minTwaDeg: 95 },
    }));
  it("returns ordered bands for both sail types", () => {
    for (const output of [
      runSpinnakerWindAngleRange({ sailType: "symmetric" }),
      runSpinnakerWindAngleRange({ sailType: "asymmetric" }),
    ]) {
      if (!output.ok) throw new Error("Expected success.");
      expect(Number(output.output.minTwaDeg)).toBeLessThan(
        Number(output.output.maxTwaDeg),
      );
    }
  });
  it("rejects an unsupported sail type", () => {
    const result = runSpinnakerWindAngleRange({ sailType: "gennaker" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects a non-string sail type", () =>
    expect(runSpinnakerWindAngleRange({ sailType: 110 }).ok).toBe(false));
  it("rejects a missing sail type", () =>
    expect(runSpinnakerWindAngleRange({}).ok).toBe(false));
  it("rejects null and malformed input", () => {
    expect(runSpinnakerWindAngleRange(null).ok).toBe(false);
    expect(runSpinnakerWindAngleRange({ sailType: null }).ok).toBe(false);
  });
  it("rejects unknown fields", () =>
    expect(
      runSpinnakerWindAngleRange({ sailType: "symmetric", twaDeg: 120 }).ok,
    ).toBe(false));
});
