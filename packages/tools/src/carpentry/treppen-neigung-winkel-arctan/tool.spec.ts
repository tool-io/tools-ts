import { describe, expect, it } from "vitest";
import { stairPitchAngleExample, runStairPitchAngle } from "./tool.js";

describe("Stair Pitch Angle Calculator", () => {
  it("computes the canonical example", () =>
    expect(runStairPitchAngle(stairPitchAngleExample.input)).toEqual({
      ok: true,
      output: { angleDegrees: 30.379126011368346 },
    }));

  it("returns 45 degrees for equal rise and run", () =>
    expect(runStairPitchAngle({ riseCm: 18, runCm: 18 })).toEqual({
      ok: true,
      output: { angleDegrees: 45 },
    }));

  it("returns a shallow angle for twice the run", () =>
    expect(runStairPitchAngle({ riseCm: 17, runCm: 34 })).toEqual({
      ok: true,
      output: { angleDegrees: 26.56505117707799 },
    }));

  it("returns a steep angle for twice the rise", () =>
    expect(runStairPitchAngle({ riseCm: 34, runCm: 17 })).toEqual({
      ok: true,
      output: { angleDegrees: 63.43494882292201 },
    }));

  it("computes the classic 3-4-5 pitch of about 37 degrees", () =>
    expect(runStairPitchAngle({ riseCm: 21, runCm: 28 })).toEqual({
      ok: true,
      output: { angleDegrees: 36.86989764584402 },
    }));

  it("accepts fractional inputs", () =>
    expect(runStairPitchAngle({ riseCm: 17.5, runCm: 28.5 })).toEqual({
      ok: true,
      output: { angleDegrees: 31.55138494831348 },
    }));

  it("rejects a zero rise", () => {
    const result = runStairPitchAngle({ riseCm: 0, runCm: 29 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "riseCm",
        message: "Rise must be greater than zero.",
      });
  });

  it("rejects negative run values", () => {
    const result = runStairPitchAngle({ riseCm: 17, runCm: -29 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects non-finite inputs", () =>
    expect(
      runStairPitchAngle({
        riseCm: Number.POSITIVE_INFINITY,
        runCm: 29,
      }).ok,
    ).toBe(false));

  it("rejects a missing run", () => {
    const result = runStairPitchAngle({ riseCm: 17 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("runCm");
  });

  it("rejects unknown input fields", () => {
    const result = runStairPitchAngle({
      riseCm: 17,
      runCm: 29,
      angleDegrees: 30,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
