import { describe, expect, it } from "vitest";
import { apttRatioExample, runApttRatio } from "./tool.js";

describe("APTT Ratio", () => {
  it("publishes an executable example", () =>
    expect(runApttRatio(apttRatioExample.input)).toEqual({
      ok: true,
      output: apttRatioExample.output,
    }));
  it("returns one for matching times", () =>
    expect(
      runApttRatio({ controlApttSeconds: 32, patientApttSeconds: 32 }),
    ).toEqual({ ok: true, output: { apttRatio: 1 } }));
  it("computes a supratherapeutic ratio", () =>
    expect(
      runApttRatio({ controlApttSeconds: 30, patientApttSeconds: 120 }),
    ).toEqual({ ok: true, output: { apttRatio: 4 } }));
  it("keeps fractional precision", () =>
    expect(
      runApttRatio({ controlApttSeconds: 40, patientApttSeconds: 50 }),
    ).toEqual({ ok: true, output: { apttRatio: 1.25 } }));
  it("supports sub-unity ratios", () =>
    expect(
      runApttRatio({ controlApttSeconds: 25, patientApttSeconds: 12.5 }),
    ).toEqual({ ok: true, output: { apttRatio: 0.5 } }));
  it("rejects zero patient APTT", () => {
    const result = runApttRatio({
      controlApttSeconds: 35,
      patientApttSeconds: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("patientApttSeconds");
  });
  it("rejects negative control APTT", () => {
    const result = runApttRatio({
      controlApttSeconds: -35,
      patientApttSeconds: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("controlApttSeconds");
  });
  it("rejects unknown fields", () => {
    const result = runApttRatio({
      controlApttSeconds: 35,
      patientApttSeconds: 90,
      units: "s",
    });
    expect(result.ok).toBe(false);
  });
});
