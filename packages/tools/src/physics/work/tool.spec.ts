import { describe, expect, it } from "vitest";
import { runWork, workExample } from "./tool.js";

describe("Work Calculator", () => {
  it("matches the canonical example", () => {
    expect(runWork(workExample.input)).toEqual({
      ok: true,
      output: workExample.output,
    });
  });

  it("defaults the angle to zero degrees", () => {
    expect(runWork({ forceN: 10, distanceM: 5 })).toEqual({
      ok: true,
      output: { workJoules: 50 },
    });
  });

  it("produces effectively zero work at ninety degrees", () => {
    const result = runWork({ forceN: 10, distanceM: 5, angleDegrees: 90 });
    expect(result.ok && result.output.workJoules).toBeCloseTo(0, 12);
  });

  it("keeps the exact floating point residue at ninety degrees", () => {
    expect(runWork({ forceN: 10, distanceM: 5, angleDegrees: 90 })).toEqual({
      ok: true,
      output: { workJoules: 3.061616997868383e-15 },
    });
  });

  it("negates work at one hundred eighty degrees", () => {
    expect(runWork({ forceN: 10, distanceM: 5, angleDegrees: 180 })).toEqual({
      ok: true,
      output: { workJoules: -50 },
    });
  });

  it("returns an exact high precision result at forty five degrees", () => {
    expect(runWork({ forceN: 7, distanceM: 3, angleDegrees: 45 })).toEqual({
      ok: true,
      output: { workJoules: 14.849242404917499 },
    });
  });

  it("accepts negative force as opposing displacement", () => {
    expect(runWork({ forceN: -10, distanceM: 5, angleDegrees: 0 })).toEqual({
      ok: true,
      output: { workJoules: -50 },
    });
  });

  it("rejects non object input", () => expect(runWork(null).ok).toBe(false));

  it("rejects unknown fields", () => {
    const result = runWork({ forceN: 1, distanceM: 1, extra: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects non finite numbers", () => {
    const result = runWork({
      forceN: Number.NaN,
      distanceM: 5,
      angleDegrees: 0,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = runWork({ distanceM: 5, angleDegrees: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("forceN");
  });
});
