import { describe, expect, it } from "vitest";
import {
  lighthouseGeographicRangeExample,
  runLighthouseGeographicRange,
} from "./tool.js";

describe("Lighthouse Geographic Range Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runLighthouseGeographicRange(lighthouseGeographicRangeExample.input),
    ).toEqual({ ok: true, output: { geographicRangeNm: 9.36 } });
  });

  it("sums both horizon contributions for equal heights", () => {
    expect(
      runLighthouseGeographicRange({
        objectHeightFeet: 1,
        observerHeightFeet: 1,
      }),
    ).toEqual({ ok: true, output: { geographicRangeNm: 2.34 } });
  });

  it("handles perfect square heights exactly", () => {
    expect(
      runLighthouseGeographicRange({
        objectHeightFeet: 9,
        observerHeightFeet: 4,
      }),
    ).toEqual({ ok: true, output: { geographicRangeNm: 5.85 } });
  });

  it("computes an irrational sum for non-square heights", () => {
    const result = runLighthouseGeographicRange({
      objectHeightFeet: 50,
      observerHeightFeet: 25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.geographicRangeNm).toBe(14.123149339882605);
  });

  it("grows when the light is taller", () => {
    const shorter = runLighthouseGeographicRange({
      objectHeightFeet: 16,
      observerHeightFeet: 9,
    });
    const taller = runLighthouseGeographicRange({
      objectHeightFeet: 36,
      observerHeightFeet: 9,
    });
    if (!shorter.ok || !taller.ok) throw new Error("expected success");
    expect(taller.output.geographicRangeNm).toBeGreaterThan(
      shorter.output.geographicRangeNm as number,
    );
  });

  it("uses the object's horizon when observer height is zero", () => {
    expect(
      runLighthouseGeographicRange({
        objectHeightFeet: 25,
        observerHeightFeet: 0,
      }),
    ).toEqual({ ok: true, output: { geographicRangeNm: 5.85 } });
  });

  it("rejects negative object heights", () => {
    expect(
      runLighthouseGeographicRange({
        objectHeightFeet: -25,
        observerHeightFeet: 9,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite heights", () => {
    expect(
      runLighthouseGeographicRange({
        objectHeightFeet: Number.NaN,
        observerHeightFeet: 9,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runLighthouseGeographicRange({
        nominalRangeNm: 12,
        objectHeightFeet: 25,
        observerHeightFeet: 9,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "nominalRangeNm" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runLighthouseGeographicRange(null).ok).toBe(false);
    expect(runLighthouseGeographicRange({ observerHeightFeet: 9 }).ok).toBe(
      false,
    );
  });
});
