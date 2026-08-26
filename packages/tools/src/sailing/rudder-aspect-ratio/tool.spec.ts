import { describe, expect, it } from "vitest";
import { rudderAspectRatioExample, runRudderAspectRatio } from "./tool.js";

describe("Rudder Aspect Ratio", () => {
  it("calculates the canonical example", () =>
    expect(runRudderAspectRatio(rudderAspectRatioExample.input)).toEqual({
      ok: true,
      output: rudderAspectRatioExample.output,
    }));
  it("yields high ratios for deep narrow blades", () =>
    expect(runRudderAspectRatio({ depthMeters: 2, rudderAreaM2: 1 })).toEqual({
      ok: true,
      output: { rudderAspectRatio: 4 },
    }));
  it("handles fractional dimensions", () =>
    expect(
      runRudderAspectRatio({ depthMeters: 1.5, rudderAreaM2: 0.75 }),
    ).toEqual({ ok: true, output: { rudderAspectRatio: 3 } }));
  it("gives low ratios for shallow wide blades", () =>
    expect(runRudderAspectRatio({ depthMeters: 0.5, rudderAreaM2: 1 })).toEqual(
      { ok: true, output: { rudderAspectRatio: 0.25 } },
    ));
  it("rejects non-positive depth", () => {
    const result = runRudderAspectRatio({ depthMeters: 0, rudderAreaM2: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_depth");
  });
  it("rejects non-positive rudder area", () => {
    const result = runRudderAspectRatio({ depthMeters: 1, rudderAreaM2: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_area");
  });
  it("rejects negative inputs", () =>
    expect(runRudderAspectRatio({ depthMeters: -1, rudderAreaM2: 1 }).ok).toBe(
      false,
    ));
  it("rejects missing and malformed input", () => {
    expect(runRudderAspectRatio({}).ok).toBe(false);
    expect(runRudderAspectRatio({ depthMeters: "1", rudderAreaM2: 1 }).ok).toBe(
      false,
    );
    expect(runRudderAspectRatio(null).ok).toBe(false);
  });
});
