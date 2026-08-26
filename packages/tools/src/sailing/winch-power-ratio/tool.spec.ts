import { describe, expect, it } from "vitest";
import { runWinchPowerRatio, winchPowerRatioExample } from "./tool.js";

describe("Winch Power Ratio Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runWinchPowerRatio(winchPowerRatioExample.input)).toEqual({
      ok: true,
      output: { powerRatio: 22 },
    });
  });

  it("defaults to a two hundred fifty millimeter handle and 4.4 gearing", () => {
    expect(runWinchPowerRatio({ drumDiameterMm: 100 })).toEqual({
      ok: true,
      output: { powerRatio: 22 },
    });
  });

  it("increases the ratio with a longer handle", () => {
    expect(
      runWinchPowerRatio({ drumDiameterMm: 100, handleLengthMm: 400 }),
    ).toEqual({
      ok: true,
      output: { powerRatio: 35.2 },
    });
  });

  it("uses a direct one-to-one gear ratio", () => {
    expect(runWinchPowerRatio({ drumDiameterMm: 100, gearRatio: 1 })).toEqual({
      ok: true,
      output: { powerRatio: 5 },
    });
  });

  it("accepts the inclusive handle bounds of one hundred fifty and four hundred millimeters", () => {
    expect(
      runWinchPowerRatio({ drumDiameterMm: 100, handleLengthMm: 150 }).ok,
    ).toBe(true);
    expect(
      runWinchPowerRatio({ drumDiameterMm: 100, handleLengthMm: 400 }).ok,
    ).toBe(true);
  });

  it("rejects a handle outside the schema bounds", () => {
    expect(
      runWinchPowerRatio({ drumDiameterMm: 100, handleLengthMm: 450 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "handleLengthMm" }] },
      ok: false,
    });
  });

  it("accepts fractional gearing and rejects ratios below one", () => {
    expect(runWinchPowerRatio({ drumDiameterMm: 100, gearRatio: 4.5 })).toEqual(
      { ok: true, output: { powerRatio: 22.5 } },
    );
    expect(runWinchPowerRatio({ drumDiameterMm: 100, gearRatio: 0 }).ok).toBe(
      false,
    );
  });

  it("rejects zero drum diameter with a stable error", () => {
    expect(runWinchPowerRatio({ drumDiameterMm: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "drumDiameterMm" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runWinchPowerRatio({ drumDiameterMm: 100, winchModel: "46ST" }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "winchModel" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runWinchPowerRatio(null).ok).toBe(false);
    expect(runWinchPowerRatio({}).ok).toBe(false);
  });
});
