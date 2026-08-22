import { describe, expect, it } from "vitest";
import { centripetalForceExample, runCentripetalForce } from "./tool.js";

describe("Centripetal Force Calculator", () => {
  it("matches the canonical example", () => {
    expect(runCentripetalForce(centripetalForceExample.input)).toEqual({
      ok: true,
      output: centripetalForceExample.output,
    });
  });

  it("returns an exact high precision result", () => {
    expect(
      runCentripetalForce({ massKg: 1.1, velocityMs: 7.3, radiusM: 0.9 }),
    ).toEqual({
      ok: true,
      output: { newtons: 65.13222222222223 },
    });
  });

  it("rejects zero radius with a stable code", () => {
    const result = runCentripetalForce({
      massKg: 2,
      velocityMs: 3,
      radiusM: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_radius",
        field: "radiusM",
        message: "The radius must be greater than zero metres.",
      });
  });

  it("rejects negative radius with the same code", () => {
    const result = runCentripetalForce({
      massKg: 2,
      velocityMs: 3,
      radiusM: -1.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_radius");
  });

  it("ignores the sign of velocity because speed is squared", () => {
    const forward = runCentripetalForce({
      massKg: 2,
      velocityMs: 3,
      radiusM: 1.5,
    });
    const backward = runCentripetalForce({
      massKg: 2,
      velocityMs: -3,
      radiusM: 1.5,
    });
    expect(backward).toEqual(forward);
  });

  it("yields zero force for zero mass", () => {
    expect(
      runCentripetalForce({ massKg: 0, velocityMs: 3, radiusM: 1.5 }),
    ).toEqual({
      ok: true,
      output: { newtons: 0 },
    });
  });

  it("quadruples the force when the speed doubles", () => {
    const slow = runCentripetalForce({
      massKg: 2,
      velocityMs: 3,
      radiusM: 1.5,
    });
    const fast = runCentripetalForce({
      massKg: 2,
      velocityMs: 6,
      radiusM: 1.5,
    });
    expect(fast.ok && slow.ok ? fast.output.newtons : Number.NaN).toBe(
      slow.ok ? 4 * (slow.output.newtons as number) : Number.NaN,
    );
  });

  it("rejects non object input", () =>
    expect(runCentripetalForce(null).ok).toBe(false));

  it("rejects unknown fields", () => {
    const result = runCentripetalForce({
      massKg: 1,
      velocityMs: 1,
      radiusM: 1,
      extra: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects non finite numbers", () => {
    const result = runCentripetalForce({
      massKg: Number.POSITIVE_INFINITY,
      velocityMs: 3,
      radiusM: 1.5,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = runCentripetalForce({ massKg: 2, velocityMs: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("radiusM");
  });
});
