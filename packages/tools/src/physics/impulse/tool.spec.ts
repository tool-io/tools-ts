import { describe, expect, it } from "vitest";
import { impulseExample, runImpulse } from "./tool.js";

describe("Impulse Calculator", () => {
  it("matches the canonical example", () => {
    expect(runImpulse(impulseExample.input)).toEqual({
      ok: true,
      output: impulseExample.output,
    });
  });

  it("returns an exact high precision result", () => {
    expect(runImpulse({ forceN: 13.7, deltaTimeS: 3.3 })).toEqual({
      ok: true,
      output: { impulseNs: 45.209999999999994 },
    });
  });

  it("rejects a negative time interval with a stable code", () => {
    const result = runImpulse({ forceN: 8, deltaTimeS: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_time",
        field: "deltaTimeS",
        message: "The time interval must not be negative.",
      });
  });

  it("yields zero impulse for zero elapsed time", () => {
    expect(runImpulse({ forceN: 8, deltaTimeS: 0 })).toEqual({
      ok: true,
      output: { impulseNs: 0 },
    });
  });

  it("yields negative impulse for opposing force", () => {
    expect(runImpulse({ forceN: -8, deltaTimeS: 2.5 })).toEqual({
      ok: true,
      output: { impulseNs: -20 },
    });
  });

  it("doubles the impulse when the interval doubles", () => {
    const single = runImpulse({ forceN: 5, deltaTimeS: 1.25 });
    const doubled = runImpulse({ forceN: 5, deltaTimeS: 2.5 });
    expect(
      single.ok &&
        doubled.ok &&
        doubled.output.impulseNs === 2 * (single.output.impulseNs as number),
    ).toBe(true);
  });

  it("rejects non object input", () => expect(runImpulse(42).ok).toBe(false));

  it("rejects unknown fields", () => {
    const result = runImpulse({ forceN: 1, deltaTimeS: 1, extra: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects non finite numbers", () => {
    const result = runImpulse({ forceN: 8, deltaTimeS: Number.NaN });
    expect(result.ok).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = runImpulse({ deltaTimeS: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("forceN");
  });
});
