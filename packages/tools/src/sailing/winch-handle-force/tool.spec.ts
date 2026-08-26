import { describe, expect, it } from "vitest";
import { runWinchHandleForce, winchHandleForceExample } from "./tool.js";

describe("Winch Handle Force Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runWinchHandleForce(winchHandleForceExample.input)).toEqual({
      ok: true,
      output: { handleForceNewtons: 50 },
    });
  });

  it("divides the load by the power ratio", () => {
    expect(runWinchHandleForce({ loadNewtons: 100, powerRatio: 8 })).toEqual({
      ok: true,
      output: { handleForceNewtons: 12.5 },
    });
  });

  it("halves the required force when the ratio doubles", () => {
    const base = runWinchHandleForce({ loadNewtons: 900, powerRatio: 12 });
    const doubled = runWinchHandleForce({ loadNewtons: 900, powerRatio: 24 });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.handleForceNewtons).toBeCloseTo(
      Number(base.output.handleForceNewtons) / 2,
      12,
    );
  });

  it("supports fractional results for large loads", () => {
    const result = runWinchHandleForce({ loadNewtons: 1000, powerRatio: 35 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.handleForceNewtons).toBeCloseTo(
      28.571428571428573,
      12,
    );
  });

  it("rejects zero or negative load with a stable error", () => {
    expect(
      runWinchHandleForce({ loadNewtons: 0, powerRatio: 16 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "loadNewtons" }] },
      ok: false,
    });
    expect(runWinchHandleForce({ loadNewtons: -100, powerRatio: 16 }).ok).toBe(
      false,
    );
  });

  it("rejects zero or negative power ratio with a stable error", () => {
    expect(
      runWinchHandleForce({ loadNewtons: 800, powerRatio: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "powerRatio" }] },
      ok: false,
    });
    expect(runWinchHandleForce({ loadNewtons: 800, powerRatio: -16 }).ok).toBe(
      false,
    );
  });

  it("rejects unknown fields", () => {
    expect(
      runWinchHandleForce({
        drumDiameterMm: 100,
        loadNewtons: 800,
        powerRatio: 16,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "drumDiameterMm" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runWinchHandleForce(null).ok).toBe(false);
    expect(runWinchHandleForce({}).ok).toBe(false);
  });
});
