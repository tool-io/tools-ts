import { describe, expect, it } from "vitest";
import { runSailAspectRatioJib, sailAspectRatioJibExample } from "./tool.js";

describe("Jib Aspect Ratio", () => {
  it("calculates the canonical example", () =>
    expect(runSailAspectRatioJib(sailAspectRatioJibExample.input)).toEqual({
      ok: true,
      output: sailAspectRatioJibExample.output,
    }));
  it("yields high ratios for tall narrow jibs", () =>
    expect(
      runSailAspectRatioJib({ iMeasurementMeters: 14, jibAreaM2: 28 }),
    ).toEqual({ ok: true, output: { aspectRatio: 7 } }));
  it("halves the ratio when area doubles", () =>
    expect(
      runSailAspectRatioJib({ iMeasurementMeters: 12, jibAreaM2: 96 }),
    ).toEqual({ ok: true, output: { aspectRatio: 1.5 } }));
  it("rejects a non-positive I measurement", () => {
    const result = runSailAspectRatioJib({
      iMeasurementMeters: 0,
      jibAreaM2: 48,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_i_measurement");
  });
  it("rejects non-positive jib area", () => {
    const result = runSailAspectRatioJib({
      iMeasurementMeters: 12,
      jibAreaM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_area");
  });
  it("rejects negative inputs", () =>
    expect(
      runSailAspectRatioJib({ iMeasurementMeters: -12, jibAreaM2: 48 }).ok,
    ).toBe(false));
  it("rejects missing and malformed input", () => {
    expect(runSailAspectRatioJib({}).ok).toBe(false);
    expect(
      runSailAspectRatioJib({ iMeasurementMeters: "12", jibAreaM2: 48 }).ok,
    ).toBe(false);
    expect(runSailAspectRatioJib(null).ok).toBe(false);
  });
});
